"use client";

import { useAuth } from "@/lib/context/auth-context";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Bell,
  Languages,
  LanguagesIcon,
  ShieldCheck,
  User,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocalizedRouter } from "@/lib/useLocalizedRouter";
import { useT } from "@/app/[locale]/layout";
import LocalizedLink from "@/lib/localizedLink";
const LOCALES = ["en", "de"] as const;
const DEFAULT = "de";

export default function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [latestThree, setLatestThree] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [activeLanguag, setActiveLanguage] = useState("");
  const pathname = usePathname();

  // ====================== MOBILE DRAWER STATE (NEW) ======================
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileUserSubOpen, setMobileUserSubOpen] = useState(false);
  const drawerPanelRef = useRef<HTMLDivElement | null>(null);
  // ======================================================================

  //  header avatar dropdown state + ref
  const [mobileHeaderDDOpen, setMobileHeaderDDOpen] = useState(false);
  const headerDDRef = useRef<HTMLDivElement | null>(null);

  const t = useT("header");
  const { push } = useLocalizedRouter();

  dayjs.extend(relativeTime);

  useEffect(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    setActiveLanguage(LOCALES.includes(seg as any) ? seg : DEFAULT);
  }, [pathname]);

  const handleChange = (next: "en" | "de") => {
    // Remember for a year (readable by middleware & server)
    document.cookie = `NEXT_LOCALE=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;

    const parts = pathname.split("/").filter(Boolean);
    const rest = LOCALES.includes(parts[0] as any) ? parts.slice(1) : parts;

    // Keep the rest of the path/query/hash
    const search = window.location.search || "";
    const hash = window.location.hash || "";

    router.replace(`/${next}/${rest.join("/")}${search}${hash}`);
  };

  // Close drawer on route change
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false);
    setMobileUserSubOpen(false);
  }, [pathname]);

  // Click outside to close drawer
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!mobileOpen) return;
      const t = e.target as Node;
      if (drawerPanelRef.current && !drawerPanelRef.current.contains(t)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const displayName =
    user?.display_name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!mobileHeaderDDOpen) return;
      const t = e.target as Node;
      if (headerDDRef.current && !headerDDRef.current.contains(t)) {
        setMobileHeaderDDOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileHeaderDDOpen]);

  // Also close it when navigating
  useEffect(() => {
    setMobileHeaderDDOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <LocalizedLink href="/" className="font-semibold hover:opacity-80">
              Kiezly.de
            </LocalizedLink>
          </div>
   
          <div className="flex items-center gap-2 relative">
            <div className="relative mr-2">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className={`relative inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition`}
                aria-label="Notifications"
                aria-expanded={languageOpen}
              >
                <LanguagesIcon className="h-6 w-6 text-gray-700" />
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {(LOCALES.includes(activeLanguag as any)
                    ? activeLanguag
                    : DEFAULT
                  ).toUpperCase()}
                </span>
              </button>
              {/* Dropdown */}
              {languageOpen && (
                <div className="absolute right-0 top-full mt-2 w-12 rounded-lg border bg-white shadow-md z-50">
                  {LOCALES.map((locale) => (
                    <button
                      key={locale}
                      onClick={() => {
                        setLanguageOpen(false);
                        handleChange(locale);
                      }}
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left border-b border-gray-100 ${
                        activeLanguag == locale && "bg-gray-200"
                      }`}
                    >
                      {locale.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
           

            {/* =================== HAMBURGER =================== */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => {
                setMobileOpen(true);
                setLanguageOpen(false);
                setNotificationOpen(false);
                setDropdownOpen(false);
              }}
            >
              <Menu className="h-6 w-6" />
            </button>
            {/* ====================================================== */}
          </div>
        </div>
      </header>

      {/* =================== MOBILE DRAWER  =================== */}
      <div
        className={`fixed inset-0 z-[80] md:hidden ${
          mobileOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <aside
          ref={drawerPanelRef}
          className={`absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl transition-transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            {/* LEFT: Logo / Title */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <LocalizedLink
                href="/"
                className="font-semibold hover:opacity-80"
                onClick={() => setMobileOpen(false)}
              >
                Kiezly.de
              </LocalizedLink>
            </div>

            {/* RIGHT: Avatar + Close button */}
            <div ref={headerDDRef} className="relative flex items-center gap-2">
              {/* Avatar Button */}
              {user && (
                <button
                  onClick={() => setMobileHeaderDDOpen((v) => !v)}
                  aria-label="User menu"
                  aria-expanded={mobileHeaderDDOpen}
                  className="inline-flex items-center justify-center rounded-full h-9 w-9 overflow-hidden border hover:bg-gray-50"
                  title={
                    user?.display_name ||
                    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`
                  }
                >
                  {user?.avatar_url ? (
                    <img
                      src={user?.avatar_url}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {(user?.display_name ||
                        `${user?.first_name ?? ""}${user?.last_name ?? ""}` ||
                        "U")[0].toUpperCase()}
                    </span>
                  )}
                </button>
              )}

              {/* Close button */}
              <button
                className="rounded-md p-2 hover:bg-gray-100"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>

              {/* Avatar Dropdown */}
              {user && mobileHeaderDDOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 rounded-lg border bg-white shadow-lg z-50"
                  role="menu"
                  aria-label="Mobile header user menu"
                >
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-semibold">
                      {user?.display_name ||
                        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(user?.first_name || "") + " " + (user?.last_name || "")}
                    </p>
                  </div>

                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMobileHeaderDDOpen(false);
                      setMobileOpen(false);
                      push("/my-profile");
                    }}
                    role="menuitem"
                  >
                    {t("my-profile")}
                  </button>

                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMobileHeaderDDOpen(false);
                      setMobileOpen(false);
                      push("/change-password");
                    }}
                    role="menuitem"
                  >
                    {t("change-password")}
                  </button>

              

                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      setMobileHeaderDDOpen(false);
                      setMobileOpen(false);
                      logout();
                    }}
                    role="menuitem"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Drawer content */}
          <div className="p-4 space-y-6 overflow-y-auto">
            {user && (
              <>
                <div className="rounded-lg border">
                  <button
                    className="w-full px-3 py-3 flex items-center gap-3 hover:bg-gray-50"
                    // onClick={() => setMobileUserSubOpen((v) => !v)}
                    aria-expanded={mobileUserSubOpen}
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user?.avatar_url || "https://placehold.co/96x96"}
                        alt={displayName || "avatar"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                        {(displayName?.[0] || "U").toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold">{displayName}</p>
                      <p className="text-xs text-gray-500">
                        {(user?.first_name || "") +
                          " " +
                          (user?.last_name || "")}
                      </p>
                    </div>
                    {/* {mobileUserSubOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )} */}
                  </button>

                  {/* {mobileUserSubOpen && (
                    <div className="border-t">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          push("/my-profile");
                          setMobileOpen(false);
                        }}
                      >
                        {t("my-profile")}
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          push("/change-password");
                          setMobileOpen(false);
                        }}
                      >
                        {t("change-password")}
                      </button>

                      {user.role === "client" ? (
                        <button
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => {
                            push("/my-jobs");
                            setMobileOpen(false);
                          }}
                        >
                          {t("my-jobs")}
                        </button>
                      ) : (
                        <>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => {
                              push("/saved-job");
                              setMobileOpen(false);
                            }}
                          >
                            {t("saved-jobs")}
                          </button>
                          <button
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                            onClick={() => {
                              push("/applied-jobs");
                              setMobileOpen(false);
                            }}
                          >
                            {t("applied-jobs")}
                          </button>
                        </>
                      )}

                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                      >
                        {t("logout")}
                      </button>
                    </div>
                  )} */}
                </div>
              </>
            )}
         
            <nav className="space-y-2">
              {!user && (
                <>
                  <div className="grid grid-cols-1 gap-2">
                    <LocalizedLink
                      href="/signin"
                      onClick={() => {
                        setMobileOpen(false);
                      }}
                      className="inline-flex items-center justify-center rounded-xl text-sm font-medium px-3 py-2 transition-colors border bg-neutral-900 text-white border-neutral-900 hover:opacity-90"
                    >
                      {t("signin")}
                    </LocalizedLink>
                  </div>
                  <div className="flex items-center gap-0 my-4">
                    <div className="flex-1 border-t border-gray-200"></div>
                    {/* <span className="text-xs uppercase text-gray-400"></span> */}
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                </>
              )}

              <LocalizedLink
                href="/how-it-works"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {t("how-it-works")}
              </LocalizedLink>
              <LocalizedLink
                href="/#categories"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {t("categories")}
              </LocalizedLink>
              <LocalizedLink
                href="/#trust"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {t("trust-safety")}
              </LocalizedLink>
              <LocalizedLink
                href="/jobs"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                {t("jobs")}
              </LocalizedLink>
            </nav>

            {user && user?.role === "client" && (
              <>
                <div className="flex items-center gap-0 my-4">
                  <div className="flex-1 border-t border-gray-200"></div>
                  {/* <span className="text-xs uppercase text-gray-400"></span> */}
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <LocalizedLink
                    href="/post-job/basic-details"
                    className="inline-flex items-center rounded-xl text-sm font-medium px-3 py-2 transition-colors border bg-neutral-900 text-white border-neutral-900 hover:opacity-90"
                  >
                    {t("post-mini-job")}
                  </LocalizedLink>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
      {/* ========================================================== */}

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

          </div>
        </div>
      ) : null}
    </>
  );
}
