"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { LoginModal } from "@/components/auth/login-modal";

interface AuthModalContextValue {
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openLogin = useCallback(() => setOpen(true), []);
  const closeLogin = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openLogin, closeLogin }),
    [openLogin, closeLogin],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <LoginModal open={open} onClose={closeLogin} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return context;
}
