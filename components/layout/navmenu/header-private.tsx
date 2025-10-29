'use client';

import { useAuth } from '@/lib/context/auth-context';
import LocalizedLink from '@/lib/localizedLink';
import { ShieldCheck, Languages as LanguagesIcon, Bell, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LOCALES = ['en','de'] as const;
const DEFAULT = 'de';

export default function HeaderPrivate() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useState<'en'|'de'>(DEFAULT);

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

  const displayName =
    (user as any)?.display_name ||
    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() ||
    user?.email ||
    'User';

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          <LocalizedLink href="/" className="font-semibold hover:opacity-80">Kiezly.de</LocalizedLink>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl p-2 border hover:bg-neutral-100" aria-label="Notifications">
            <Bell className="h-5 w-5 text-neutral-700" />
          </button>

          <div className="relative">
            <button
              onClick={() => changeLang(lang === 'en' ? 'de' : 'en')}
              className="relative inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
              aria-label="Language"
            >
              <LanguagesIcon className="h-6 w-6 text-gray-700" />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {lang.toUpperCase()}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center text-sm text-neutral-700">
            {displayName}
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center rounded-xl border px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}
