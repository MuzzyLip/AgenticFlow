"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Languages } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/hooks";
import { localeLabels, locales, type Locale } from "@/i18n";
import { cn } from "@/utils";

const LOCALE_COOKIE = "NEXT_LOCALE";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function LocaleSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchLocale = (next: Locale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }

    setLocaleCookie(next);

    const segments = pathname.split("/");
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }

    const nextPath = segments.join("/") || `/${next}`;
    router.push(nextPath);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t.localeSwitcher.label}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
        >
          <Languages className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto min-w-36 p-1">
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            role="menuitemradio"
            aria-checked={locale === l}
            onClick={() => {
              switchLocale(l);
            }}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              locale === l
                ? "bg-gray-100 font-medium text-gray-950"
                : "text-gray-600 hover:bg-gray-50 hover:text-black",
            )}
          >
            <span>{localeLabels[l]}</span>
            {locale === l ? <Check className="h-4 w-4 shrink-0" /> : null}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
