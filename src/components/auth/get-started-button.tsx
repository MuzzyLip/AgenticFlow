"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { useAuthModal } from "@/contexts/auth-modal-provider";
import { useI18n } from "@/hooks";
import { cn } from "@/utils";

type GetStartedButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export function GetStartedButton({
  children,
  className,
  type = "button",
  onClick,
  ...props
}: GetStartedButtonProps) {
  const { t } = useI18n();
  const { openLogin } = useAuthModal();

  return (
    <button
      type={type}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        openLogin();
      }}
      {...props}
    >
      {children ?? t.common.getStarted}
    </button>
  );
}
