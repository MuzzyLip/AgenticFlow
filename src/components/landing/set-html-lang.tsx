"use client";

import { useEffect } from "react";

import type { Locale } from "@/i18n";

export function SetHtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return null;
}
