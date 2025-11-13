export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "de";


export function getLocaleFromPath(pathname?: string, fallback: Locale = DEFAULT_LOCALE): Locale {
  if (!pathname) return fallback;
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  return parts.length && LOCALES.includes(parts[0] as any) ? (parts[0] as Locale) : fallback;
}

export function getBasePath(pathname?: string): string {
  if (!pathname) return "/";
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const startIndex = parts.length && LOCALES.includes(parts[0] as any) ? 1 : 0;
  return parts.length > startIndex ? `/${parts[startIndex]}` : "/";
}

export function prefixWithLocale(locale: Locale, pathname: string) {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  if (parts.length && LOCALES.includes(parts[0] as any)) parts[0] = locale;
  else parts.unshift(locale);
  return "/" + parts.join("/");
}
