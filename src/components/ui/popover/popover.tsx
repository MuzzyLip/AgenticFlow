"use client";

import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

import { useDismissable } from "@/hooks/use-dismissable";
import { cn } from "@/utils";

interface PopoverTriggerProps {
  onClick?: () => void;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "menu" | boolean;
  "aria-controls"?: string;
}

interface PopoverProps {
  trigger: ReactElement<PopoverTriggerProps>;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  trigger,
  children,
  align = "end",
  className,
  open: openProp,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useDismissable(containerRef, {
    enabled: open,
    onDismiss: () => setOpen(false),
  });

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: () => setOpen(!open),
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": panelId,
      })
    : trigger;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {triggerElement}
      {open ? (
        <div
          id={panelId}
          role="menu"
          className={cn(
            "absolute top-full z-60 mt-2 min-w-36 rounded-xl border border-gray-200 bg-white p-1 shadow-lg shadow-black/5",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
