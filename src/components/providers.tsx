"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

import { AuthModalProvider } from "@/contexts/auth-modal-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthModalProvider>{children}</AuthModalProvider>
    </SessionProvider>
  );
}
