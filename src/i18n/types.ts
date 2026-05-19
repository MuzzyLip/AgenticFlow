import type en from "./dictionaries/en.json";

/** 以 en.json 为结构基准；所有语言文件须在编译期满足此类型 */
export type Dictionary = typeof en;
