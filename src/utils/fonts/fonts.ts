import type { Fonts } from "../../types/basetypes";

export const fontOptions: { value: Fonts; label: string }[] = [
  { value: "vazirmatn", label: "وزیرمتن" },
  { value: "iransans", label: "ایران‌سنس" },
];

export const fontClassMap: Record<Fonts, string> = {
  vazirmatn: "font-vazirmatn",
  iransans: "font-iransans",
  kook: "font-kook",
};