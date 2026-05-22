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

    const handlePointerDown = (event: PointerEvent) => {
      const current = ref.current;
      if (!current) {
        return;
      }

      const path = event.composedPath();
      if (path.includes(current)) {
        return;
      }

      const target = event.target;
      if (target instanceof Node && current.contains(target)) {
        return;
      }

      onDismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onDismiss, ref]);
}
