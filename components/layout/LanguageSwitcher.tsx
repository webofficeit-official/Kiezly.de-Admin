// src/components/LanguageSwitcher.tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES } from "@/lib/utils/translation";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (locale: typeof LOCALES[number]) => {
    document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    // keep rest same
    const segments = pathname.split("/").filter(Boolean);
    const rest = LOCALES.includes(segments[0] as any) ? segments.slice(1) : segments;
    const newPath = `/${locale}/${rest.join("/")}`;
    router.replace(newPath);
  };

  return (
    <div className="space-x-2">
      {LOCALES.map((locale) => (
        <button key={locale} onClick={() => handleChange(locale)} className="px-3 py-1 border rounded hover:bg-gray-200">
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
