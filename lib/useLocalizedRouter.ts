import { useRouter, usePathname } from "next/navigation";
import { getLocaleFromPath, prefixWithLocale } from "./utils/translation";

export function useLocalizedRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);

  return {
    push: (path: string) => router.push(prefixWithLocale(locale, path)),
    replace: (path: string) => router.replace(prefixWithLocale(locale, path)),
    locale,
  };
}
