"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthSession } from "@/contexts/auth-session-provider";

interface StudioAuthGateProps {
  children: React.ReactNode;
  locale: string;
}

export function StudioAuthGate({
  children,
  locale,
}: StudioAuthGateProps) {
  const router = useRouter();
  const { status } = useAuthSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/${locale}`);
    }
  }, [locale, router, status]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white text-sm font-medium text-gray-500">
        Loading workspace...
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return <>{children}</>;
}
