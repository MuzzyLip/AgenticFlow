"use client";

import {
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthSession } from "@/contexts/auth-session-provider";
import { useDismissable, useI18n } from "@/hooks";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useDismissable(panelRef, {
    enabled: open,
    onDismiss: onClose,
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <ModalFixedOverlay>
      <ModalBackdropLayer onClose={onClose} />
      <ModalCenteredContent onClick={(event) => event.stopPropagation()}>
        <ModalDialog panelRef={panelRef}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={t.auth.close}
          >
            <X className="h-5 w-5" />
          </button>

          <h2
            id="login-modal-title"
            className="font-display mb-2 pr-8 text-2xl font-bold tracking-tight text-gray-950"
          >
            {t.auth.title}
          </h2>

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
        </ModalDialog>
      </ModalCenteredContent>
    </ModalFixedOverlay>,
    document.body,
  );
}

function ModalFixedOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {children}
    </div>
  );
}

function ModalBackdropLayer({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      aria-hidden
      tabIndex={-1}
      onClick={onClose}
    />
  );
}

function ModalCenteredContent({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (event: React.MouseEvent) => void;
}) {
  return (
    <div className="relative w-full max-w-md" onClick={onClick}>
      {children}
    </div>
  );
}

function ModalDialog({
  panelRef,
  children,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl shadow-black/10"
    >
      {children}
    </div>
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
