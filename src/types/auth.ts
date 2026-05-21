export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface AuthSession {
  user: AuthUser | null;
}

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";
