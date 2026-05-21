import type { AuthSession, AuthUser } from "@/types";
import { HttpError, buildApiUrl, httpGet, httpPost } from "@/utils/http";

export type OAuthProvider = "google" | "github";

interface SignInParams {
  timeoutMs?: number;
}

interface SignOutParams {
  callbackUrl?: string;
  redirect?: boolean;
}

interface BackendAuthUser {
  id?: string | null;
  subject?: string | null;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
}

interface SessionResponse {
  user?: BackendAuthUser | null;
  session?: {
    user?: BackendAuthUser | null;
  } | null;
}

const SESSION_POLL_INTERVAL_MS = 1000;
const SESSION_POLL_TIMEOUT_MS = 120000;
const POPUP_WIDTH = 520;
const POPUP_HEIGHT = 720;

const authRoutes = {
  session: "/api/auth/session",
  signOut: "/api/auth/sign-out",
  signIn: (provider: OAuthProvider) => `/api/auth/signin/${provider}`,
} as const;

function normalizeUser(
  candidate: BackendAuthUser | null | undefined,
): AuthUser | null {
  const id = candidate?.id ?? candidate?.subject;

  if (!id || !candidate?.name || !candidate.email) {
    return null;
  }

  return {
    id,
    name: candidate.name,
    email: candidate.email,
    avatarUrl: candidate.avatarUrl ?? candidate.avatar_url ?? null,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function openOAuthPopup(url: string, provider: OAuthProvider): Window {
  const top =
    window.screenY + Math.max((window.outerHeight - POPUP_HEIGHT) / 2, 0);
  const left =
    window.screenX + Math.max((window.outerWidth - POPUP_WIDTH) / 2, 0);
  const features = [
    `width=${POPUP_WIDTH}`,
    `height=${POPUP_HEIGHT}`,
    `top=${Math.round(top)}`,
    `left=${Math.round(left)}`,
    "popup=yes",
    "noopener=no",
    "noreferrer=no",
    "resizable=yes",
    "scrollbars=yes",
  ].join(",");
  const popup = window.open(
    url,
    `agentic-flow-oauth-${provider}`,
    features,
  );

  if (!popup) {
    throw new HttpError(
      "Unable to open the sign-in window. Please allow pop-ups and try again.",
      { code: "OAUTH_POPUP_BLOCKED" },
    );
  }

  popup.focus();

  return popup;
}

async function waitForAuthenticatedSession(
  popup: Window,
  timeoutMs: number,
): Promise<AuthSession> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (popup.closed) {
      throw new HttpError(
        "The sign-in window was closed before authentication completed.",
        { code: "OAUTH_POPUP_CLOSED" },
      );
    }

    try {
      const session = await getAuthSession();

      if (session?.user) {
        popup.close();
        return session;
      }
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 401) {
        popup.close();
        throw error;
      }
    }

    await sleep(SESSION_POLL_INTERVAL_MS);
  }

  popup.close();

  throw new HttpError(
    "Timed out while waiting for the OAuth session to be established.",
    { code: "OAUTH_SESSION_TIMEOUT" },
  );
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const response = await httpGet<SessionResponse>(authRoutes.session);
  const user = normalizeUser(response.user ?? response.session?.user);

  if (!user) {
    return null;
  }

  return { user };
}

export async function signInWithOAuth(
  provider: OAuthProvider,
  params?: SignInParams,
): Promise<AuthSession> {
  if (typeof window === "undefined") {
    throw new HttpError("OAuth sign-in must run in the browser.", {
      code: "OAUTH_BROWSER_REQUIRED",
    });
  }

  const popup = openOAuthPopup(
    buildApiUrl(authRoutes.signIn(provider)),
    provider,
  );
  return waitForAuthenticatedSession(
    popup,
    params?.timeoutMs ?? SESSION_POLL_TIMEOUT_MS,
  );
}

export async function signOutWithSession(params?: SignOutParams) {
  const callbackUrl =
    params?.callbackUrl ??
    (typeof window !== "undefined" ? window.location.href : undefined);

  await httpPost<void>(authRoutes.signOut);

  if (params?.redirect === false || typeof window === "undefined") {
    return;
  }

  window.location.assign(callbackUrl ?? "/");
}
