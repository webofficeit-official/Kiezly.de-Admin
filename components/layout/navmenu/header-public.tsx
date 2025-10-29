'use client';

import { usePathname, useRouter } from 'next/navigation';
import LocalizedLink from '@/lib/localizedLink';
import { ShieldCheck, Languages as LanguagesIcon, Menu, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const LOCALES = ['en','de'] as const;
const DEFAULT = 'de';

export default function HeaderPublic() {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState<'en'|'de'>(DEFAULT);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const seg = pathname.split('/').filter(Boolean)[0];
    setLang(LOCALES.includes(seg as any) ? (seg as 'en'|'de') : DEFAULT);
  }, [pathname]);

  const changeLang = (next: 'en'|'de') => {
    document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    const parts = pathname.split('/').filter(Boolean);
    const rest = LOCALES.includes(parts[0] as any) ? parts.slice(1) : parts;
    const search = window.location.search || '';
    const hash = window.location.hash || '';
    router.replace(`/${next}/${rest.join('/')}${search}${hash}`);
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <LocalizedLink href="/" className="font-semibold hover:opacity-80">Kiezly.de</LocalizedLink>
          </div>

          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="relative inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
                aria-label="Language"
                aria-expanded={open}
              >
                <LanguagesIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {lang.toUpperCase()}
                </span>
              </button>

              {open && (
                <div ref={panelRef} className="absolute right-0 top-full mt-2 w-20 rounded-lg border bg-white shadow-md">
                  {LOCALES.map((l) => (
                    <button
                      key={l}
                      onClick={() => { changeLang(l as 'en'|'de'); setOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${l===lang ? 'bg-gray-200' : ''}`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu (optional simple links) */}
            <LocalizedLink href="/signin" className="hidden sm:inline text-sm px-3 py-2 rounded border hover:bg-gray-50">
              Sign in
            </LocalizedLink>
            <LocalizedLink href="/signup" className="hidden sm:inline text-sm px-3 py-2 rounded border hover:bg-gray-50">
              Sign up
            </LocalizedLink>

            <div className="sm:hidden">
              <LocalizedLink href="/signin" className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100">
                <Menu className="h-6 w-6" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
