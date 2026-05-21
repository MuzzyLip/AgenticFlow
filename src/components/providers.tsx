"use client";

import type { ReactNode } from "react";

import { AuthModalProvider } from "@/contexts/auth-modal-provider";
import { AuthSessionProvider } from "@/contexts/auth-session-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthSessionProvider>
      <AuthModalProvider>{children}</AuthModalProvider>
    </AuthSessionProvider>
  );
}
