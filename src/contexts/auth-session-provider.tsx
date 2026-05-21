"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AuthSession, AuthStatus } from "@/types";
import {
  getAuthSession,
  signInWithOAuth,
  signOutWithSession,
  type OAuthProvider,
} from "@/utils";

interface AuthSessionContextValue {
  session: AuthSession | null;
  status: AuthStatus;
  refreshSession: () => Promise<void>;
  signIn: (provider: OAuthProvider) => Promise<void>;
  signOut: (callbackUrl?: string) => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

function getStatus(session: AuthSession | null): AuthStatus {
  return session?.user ? "authenticated" : "unauthenticated";
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refreshSession = useCallback(async () => {
    try {
      const nextSession = await getAuthSession();
      setSession(nextSession);
      setStatus(getStatus(nextSession));
    } catch {
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    let active = true;

    getAuthSession()
      .then((nextSession) => {
        if (!active) {
          return;
        }

        setSession(nextSession);
        setStatus(getStatus(nextSession));
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setSession(null);
        setStatus("unauthenticated");
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      session,
      status,
      refreshSession,
      signIn: async (provider) => {
        const nextSession = await signInWithOAuth(provider);
        setSession(nextSession);
        setStatus(getStatus(nextSession));
      },
      signOut: async (callbackUrl) => {
        await signOutWithSession({ callbackUrl });
        setSession(null);
        setStatus("unauthenticated");
      },
    }),
    [refreshSession, session, status],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }

  return context;
}
