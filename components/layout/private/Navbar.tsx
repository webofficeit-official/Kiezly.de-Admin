import { useT } from "@/app/[locale]/layout";
import { useAuth } from "@/lib/context/auth-context";
import LocalizedLink from "@/lib/localizedLink";
import { LanguagesIcon, ShieldCheck, SquareChevronLeft, SquareChevronRight, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {LOCALES, DEFAULT_LOCALE as DEFAULT } from "@/lib/utils/translation";


const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const [activeLanguag, setActiveLanguage] = useState("");
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const t = useT('navbar');

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

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between lg:px-5">
                        {/* Left section */}
                        <div className="flex items-center justify-start rtl:justify-end gap-2">
                            <button
                                type="button"
                                aria-controls="logo-sidebar"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="inline-flex items-center text-sm rounded-lg sm:hidden"
                            >
                                {!sidebarOpen ? <SquareChevronRight /> : <SquareChevronLeft />}

                            </button>
                            <ShieldCheck className="h-5 w-5" />
                            <LocalizedLink href="/" className="font-semibold hover:opacity-80 text-lg">
                                {t("title")}
                            </LocalizedLink>
                        </div>

                        {/* User dropdown */}
                        <div className="flex items-center">
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
                                                className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left border-b border-gray-100 ${activeLanguag == locale && "bg-gray-200"
                                                    }`}
                                            >
                                                {locale.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center ms-3 relative">
                                <button
                                    type="button"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 
                                    focus:ring-gray-300 dark:focus:ring-gray-600"
                                >
                                    <span className="sr-only">{t("user-menu.title")}</span>
                                    {user?.avatar_url ? (
                                        <>
                                            <img
                                                src={user?.avatar_url || "https://placehold.co/96x96"}
                                                alt={user?.first_name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-black-300 flex items-center justify-center text-white font-semibold text-sm">
                                                <User className="w-5 h-5" />
                                            </div>
                                        </>
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <div
                                        className="absolute right-0 top-12 z-50 my-auto text-base list-none bg-white divide-y 
                                        divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600 border shadow-xl"
                                    >
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-gray-900 dark:text-white">{user?.first_name} {user?.last_name}</p>
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <ul className="py-1">
                                            <li>
                                                <LocalizedLink href="/my-profile" className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                                    {t("user-menu.my-profile")}
                                                </LocalizedLink>
                                            </li>
                                            <li>
                                                <LocalizedLink href="/change-password" className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                                    {t("user-menu.change-password")}
                                                </LocalizedLink>
                                            </li>
                                            <li onClick={() => {
                                                logout();
                                            }}>
                                                <LocalizedLink href="/" className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                                    {t("user-menu.logout")}
                                                </LocalizedLink>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar