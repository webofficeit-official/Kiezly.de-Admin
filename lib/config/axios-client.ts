import axios, { AxiosHeaders } from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { getLocaleFromPath, LOCALES } from "@/lib/utils/translation";

const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") + "/"; // e.g. "http://localhost:4000/api/v1/"

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
    skipAdmin?: boolean;
  }
}

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: { resolve: (token?: string | null) => void; reject: (err?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

type CookieOpts = { remember?: boolean };

export const setAccessToken = (token: string | null, opts: CookieOpts = {}) => {
  accessToken = token;
  if (token) {
    const common = { secure: true, sameSite: "strict" as const, path: "/" };
    if (opts.remember) setCookie("accessToken", token, { ...common, maxAge: 60 * 30 });
    else setCookie("accessToken", token, { ...common });
  } else {
    deleteCookie("accessToken");
  }
};

export const setRefreshToken = (token: string | null, opts: CookieOpts = {}) => {
  const common = { secure: true, sameSite: "strict" as const, path: "/" };
  if (token) {
    if (opts.remember) setCookie("refreshToken", token, { ...common, maxAge: 60 * 60 * 24 * 30 });
    else setCookie("refreshToken", token, { ...common });
  } else {
    deleteCookie("refreshToken");
  }
};

const apiClient = axios.create({
  baseURL, // "http://localhost:4000/api/v1/"
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/** helper: find request locale (cookie -> pathname -> fallback) */
function getRequestLocale(): string {
  const cookieLocale = (getCookie("NEXT_LOCALE") as string | null) || null;
  if (cookieLocale && LOCALES.includes(cookieLocale as any)) return cookieLocale;
  if (typeof window !== "undefined") return getLocaleFromPath(window.location.pathname);
  return LOCALES[0] || "de";
}

/** helper: given a request path, return { clean, firstSegment, isAdmin } */
function parsePath(origUrl?: string) {
  const url = origUrl || "";
  const clean = url.replace(/^\/+/, ""); // no leading slash
  const parts = clean.split("/").filter(Boolean);
  const firstSegment = parts[0] || "";
  const isAdmin = firstSegment === "admin" || clean.includes("/admin/");
  return { clean, firstSegment, isAdmin };
}

/* ------------ request interceptor: attach token and inject /:locale/admin/ ----------- */
apiClient.interceptors.request.use((config) => {
  // allow callers to opt-out of admin injection
  if (config.skipAdmin) return config;

  // attach access token if available
  if (!accessToken) accessToken = (getCookie("accessToken") as string | null) || null;
  if (accessToken) {
    config.headers = config.headers || new AxiosHeaders();
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    } else {
      // fallback for runtime objects
      (config.headers as any)["Authorization"] = `Bearer ${accessToken}`;
    }
  }

  if (!config.url) return config;
  const url = String(config.url);

  // skip absolute urls
  if (url.startsWith("http://") || url.startsWith("https://")) return config;

  const { clean, firstSegment } = parsePath(url);

  // If caller already provided a locale as first segment (e.g. "en/admin/...")
  // keep it but ensure `admin` exists as the next segment.
  if (LOCALES.includes(firstSegment as any)) {
    const parts = clean.split("/").filter(Boolean); // e.g. ["en","admin","foo"]
    // if already has admin as second segment, keep as-is
    if (parts[1] === "admin") {
      config.url = url.startsWith("/") ? url : "/" + url;
      return config;
    }
    // insert admin after locale: "/{locale}/admin/{rest}"
    const rest = parts.slice(1).join("/");
    config.url = rest ? `/${parts[0]}/admin/${rest}` : `/${parts[0]}/admin`;
    return config;
  }

  // Otherwise inject locale + admin before the path
  const locale = getRequestLocale();
  // result url should be "/{locale}/admin/{clean}"
  config.url = clean ? `/${locale}/admin/${clean}` : `/${locale}/admin`;
  return config;
});

/* ---------------- response interceptor: handle 401 + refresh ----------------- */
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);
    if (originalRequest?.skipAuthRefresh) return Promise.reject(error);

    // helper to set Authorization header on a request object safely
    const setAuthHeaderOnRequest = (req: any, token: string) => {
      if (!req.headers) req.headers = new AxiosHeaders();
      if (req.headers instanceof AxiosHeaders) req.headers.set("Authorization", `Bearer ${token}`);
      else req.headers["Authorization"] = `Bearer ${token}`;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (token) {
            // token may be null if refresh failed
            setAuthHeaderOnRequest(originalRequest, token as string);
          }
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = (getCookie("refreshToken") as string | null) || null;
        if (!refreshToken) throw new Error("Missing refresh token");

        // Decide refresh endpoint — by default we use admin refresh for consistency.
        const locale = getRequestLocale();
        const refreshPath = `${locale}/admin/auth/refresh`;
        const refreshUrl = `${baseURL.replace(/\/+$/, "")}/${refreshPath}`; // absolute

        const { data } = await axios.post(refreshUrl, { token: refreshToken }, { withCredentials: true });

        const newAccess = data?.token?.access;
        if (!newAccess) throw new Error("Refresh failed");

        setAccessToken(newAccess, { remember: false });
        processQueue(null, newAccess);

        setAuthHeaderOnRequest(originalRequest, newAccess);
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        setAccessToken(null);
        setRefreshToken(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
