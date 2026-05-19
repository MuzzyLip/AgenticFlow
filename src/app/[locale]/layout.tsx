import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Providers } from "@/components/providers";
import { SetHtmlLang } from "@/components/landing/set-html-lang";
import { I18nProvider } from "@/contexts/i18n-provider";
import { getDictionary, locales, type Locale } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: localeParam } = await params;

  if (!locales.includes(localeParam as Locale)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);

  return (
    <I18nProvider locale={locale} dictionary={dictionary}>
      <Providers>
        <SetHtmlLang locale={locale} />
        {children}
      </Providers>
    </I18nProvider>
  );
}
