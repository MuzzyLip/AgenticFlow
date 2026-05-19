"use client";

import { createContext, type ReactNode } from "react";

import type { Dictionary, Locale } from "@/i18n";

interface I18nContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: Locale;
  dictionary: Dictionary;
  children: ReactNode;
}

export function I18nProvider({
  locale,
  dictionary,
  children,
}: I18nProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, dictionary }}>
      {children}
    </I18nContext.Provider>
  );
}
