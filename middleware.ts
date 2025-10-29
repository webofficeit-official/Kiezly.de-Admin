// /middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'de'] as const;
const DEFAULT = 'de';
const LOCALE_COOKIE = 'NEXT_LOCALE';
const TOKEN_COOKIE = 'refreshToken'; // <- match what your login sets
const COOKIE_OPTS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

function splitPath(pathname: string) {
  const segs = pathname.split('/').filter(Boolean);
  const first = segs[0];
  const hasLocale = (LOCALES as readonly string[]).includes(first as any);
  const locale = hasLocale ? (first as typeof LOCALES[number]) : null;
  const rest = '/' + (hasLocale ? segs.slice(1) : segs).join('/');
  return { hasLocale, locale, rest: rest === '/' ? '/' : rest };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip assets/API/files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_COOKIE)?.value || null;
  const { hasLocale, locale: urlLocale, rest } = splitPath(pathname);

  // Determine locale from URL first, then cookie, then default
  const fromCookie = req.cookies.get(LOCALE_COOKIE)?.value;
  const effectiveLocale =
    (urlLocale ??
      (fromCookie && (LOCALES as readonly string[]).includes(fromCookie as any) ? (fromCookie as any) : null)) || DEFAULT;

  // Helper to make redirects easily
  const redirect = (toPath: string) => {
    const url = req.nextUrl.clone();
    url.pathname = toPath;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, effectiveLocale, COOKIE_OPTS);
    return res;
  };

  // If missing locale in URL, prefix it and possibly route to signin/dashboard for "/"
  if (!hasLocale) {
    if (pathname === '/' || pathname === '') {
      return redirect(`/${effectiveLocale}${token ? '/dashboard' : '/signin'}`);
    }
    return redirect(`/${effectiveLocale}${pathname}`);
  }

  // Now we have a locale in the URL. Normalize "/" under that locale.
  if (rest === '/' || rest === '') {
    return redirect(`/${effectiveLocale}${token ? '/dashboard' : '/signin'}`);
  }

  // Auth-aware route protection
  const isAuthPage = rest === '/signin' || rest === '/signup';
  const isPrivateArea = rest.startsWith('/dashboard');

  // Logged-in users shouldn't see signin/signup
  if (token && isAuthPage) {
    return redirect(`/${effectiveLocale}/dashboard`);
  }

  // Logged-out users shouldn't see private pages
  if (!token && isPrivateArea) {
    return redirect(`/${effectiveLocale}/signin`);
  }

  // Otherwise, proceed and refresh locale cookie
  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, effectiveLocale, COOKIE_OPTS);
  return res;
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
