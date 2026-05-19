"use client";

import type { Transition } from "motion/react";

import { useReducedMotionPreference } from "./use-reduced-motion";

interface MotionTransitionOptions {
  duration?: number;
  delay?: number;
}

/**
 * 根据用户无障碍偏好返回 Motion 过渡配置。
 */
export function useMotionTransition(
  options: MotionTransitionOptions = {},
): Transition {
  const { duration = 0.5, delay = 0 } = options;
  const prefersReducedMotion = useReducedMotionPreference();

  if (prefersReducedMotion) {
    return { duration: 0, delay: 0 };
  }

  return { duration, delay };
}
