"use client";

import { useEffect, type RefObject } from "react";

interface UseDismissableOptions {
  enabled: boolean;
  onDismiss: () => void;
}

export function useDismissable(
  ref: RefObject<HTMLElement | null>,
  { enabled, onDismiss }: UseDismissableOptions,
) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target)) return;
      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onDismiss, ref]);
}
