import type { Locale } from "@/i18n";

export function localizedPath(locale: Locale, path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalized}`;
}
