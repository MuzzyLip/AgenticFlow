"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthSession } from "@/contexts/auth-session-provider";
import { useI18n } from "@/hooks";
import { appRoutes } from "@/utils/landing/routes";
import type { OAuthProvider } from "@/utils";

import { GitHubIcon, GoogleIcon } from "./oauth-icons";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { t, lp } = useI18n();
  const router = useRouter();
  const { signIn } = useAuthSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signIn(provider);
      onClose();
      router.replace(lp(appRoutes.studio));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to complete sign-in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="p-8" hideClose aria-label={t.auth.title}>
        <DialogHeader className="mb-2">
          <DialogTitle className="font-display pr-8 text-2xl font-bold tracking-tight text-gray-950 normal-case">
            {t.auth.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <OAuthButton
            label={t.auth.google}
            icon={<GoogleIcon className="h-5 w-5" />}
            onClick={() => void handleOAuthSignIn("google")}
            disabled={isSubmitting}
          />
          <OAuthButton
            label={t.auth.github}
            icon={<GitHubIcon className="h-5 w-5 text-gray-900" />}
            onClick={() => void handleOAuthSignIn("github")}
            disabled={isSubmitting}
          />
        </div>

        {errorMessage ? (
          <p className="mt-4 text-sm text-rose-600">{errorMessage}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

interface OAuthButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function OAuthButton({
  label,
  icon,
  onClick,
  disabled = false,
}: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
