"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";

import { useDismissable, useI18n } from "@/hooks";

import { GitHubIcon, GoogleIcon } from "./oauth-icons";

type OAuthProvider = "google" | "github";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
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

  const handleOAuthSignIn = (provider: OAuthProvider) => {
    void signIn(provider);
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
          <p
            id="login-modal-description"
            className="mb-8 text-sm text-gray-500"
          >
            {t.auth.description}
          </p>

          <div className="flex flex-col gap-3">
            <OAuthButton
              label={t.auth.google}
              icon={<GoogleIcon className="h-5 w-5" />}
              onClick={() => handleOAuthSignIn("google")}
            />
            <OAuthButton
              label={t.auth.github}
              icon={<GitHubIcon className="h-5 w-5 text-gray-900" />}
              onClick={() => handleOAuthSignIn("github")}
            />
          </div>
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
      aria-describedby="login-modal-description"
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
}

function OAuthButton({ label, icon, onClick }: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

