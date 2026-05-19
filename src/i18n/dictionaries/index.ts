import type { Locale } from "../config";
import type { Dictionary } from "../types";
import en from "./en.json";
import zh from "./zh.json";

/** 编译期校验：zh.json 必须与 en.json 结构一致 */
const zhDictionary: Dictionary = zh;

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  zh: zhDictionary,
};
