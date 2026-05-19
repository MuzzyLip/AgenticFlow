import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, locales, type Locale } from "@/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale === "en" || cookieLocale === "zh") {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (/zh/i.test(acceptLanguage)) {
    return "zh";
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
