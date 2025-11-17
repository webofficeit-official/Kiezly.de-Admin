import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE as DEFAULT } from "@/lib/utils/translation";
const LOCALE_COOKIE = 'NEXT_LOCALE';
const TOKEN_COOKIE = 'refreshToken';
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

  const fromCookie = req.cookies.get(LOCALE_COOKIE)?.value;
  const effectiveLocale =
    (urlLocale ??
      (fromCookie && (LOCALES as readonly string[]).includes(fromCookie as any) ? (fromCookie as any) : null)) || DEFAULT;


  const redirect = (toPath: string) => {
    const url = req.nextUrl.clone();
    url.pathname = toPath;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, effectiveLocale, COOKIE_OPTS);
    return res;
  };

  if (!hasLocale) {
    if (pathname === '/' || pathname === '') {
      return redirect(`/${effectiveLocale}${token ? '/dashboard' : '/signin'}`);
    }
    return redirect(`/${effectiveLocale}${pathname}`);
  }


  if (rest === '/' || rest === '') {
    return redirect(`/${effectiveLocale}${token ? '/dashboard' : '/signin'}`);
  }


  const isAuthPage = rest === '/signin' || rest === '/signup';
  const isPrivateArea = rest.startsWith('/dashboard');


  if (token && isAuthPage) {
    return redirect(`/${effectiveLocale}/dashboard`);
  }


  if (!token && isPrivateArea) {
    return redirect(`/${effectiveLocale}/signin`);
  }


  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, effectiveLocale, COOKIE_OPTS);
  return res;
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
