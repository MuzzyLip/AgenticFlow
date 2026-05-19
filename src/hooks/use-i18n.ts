"use client";

import { useContext } from "react";

import { I18nContext } from "@/contexts/i18n-provider";
import type { Locale } from "@/i18n";
import { localizedPath } from "@/utils/i18n";

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  const { locale, dictionary: t } = context;

  const lp = (path: string) => localizedPath(locale, path);

  return { locale, t, lp };
}

export function useLocale(): Locale {
  return useI18n().locale;
}
