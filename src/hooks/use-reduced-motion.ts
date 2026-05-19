"use client";

import { useReducedMotion } from "motion/react";

/**
 * 统一动画可访问性策略：尊重系统「减少动态效果」偏好。
 */
export function useReducedMotionPreference(): boolean {
  return useReducedMotion() ?? false;
}
