import type { Locale } from "./config";
import { dictionaries } from "./dictionaries";

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}
