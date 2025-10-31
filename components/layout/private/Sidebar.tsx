import { useT } from "@/app/[locale]/layout";
import LocalizedLink from "@/lib/localizedLink";
import { BriefcaseBusiness, ChevronDown, ChevronUp, FolderCheck, FolderCode, Globe, Languages, LayoutDashboard, ScrollText, ShieldPlus, Users } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const t = useT('sidebar');
    
    return (
        <>
            <div className="relative">
                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform 
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    sm:translate-x-0 bg-white/80 border`}
                >
                    <div className="h-full py-4 overflow-y-auto mt-14 bg-white">
                        <ul className="space-y-2 font-medium p-2">
                            {/* Dashboard */}
                            <li>
                                <LocalizedLink href="/dashboard" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ">
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.dashboard")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Admins */}
                            <li>
                                <LocalizedLink href="/admins" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                    <ShieldPlus className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.admins")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Users */}
                            <li>
                                <LocalizedLink href="/users" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                    <Users className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.users")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Jobs  */}
                            <li>
                                <LocalizedLink href="/jobs" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                    <BriefcaseBusiness className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.jobs")}</span>
                                </LocalizedLink>
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium p-2 border-t border-gray-200 dark:border-gray-700 mt-3 pt-4">
                            {/* Categories */}
                            <li>
                                <LocalizedLink href="/categories" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ">
                                    <FolderCode className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.categories")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Job Tags */}
                            <li>
                                <LocalizedLink href="/job-tags" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                    <FolderCheck className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.job-tags")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Languages */}
                            <li>
                                <LocalizedLink href="/langauges" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                    <Languages className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.langauges")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Countries  */}
                            <li>
                                <LocalizedLink href="/countries" className="flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false">
                                    <Globe className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.countries")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Submenu */}
                            <li>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false justify-between ${isDropdownOpen && 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <ScrollText className="w-5 h-5" />
                                        <span className="ms-3">Submenu</span>
                                    </div>
                                    {isDropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {isDropdownOpen && (
                                    <ul className="py-2 space-y-2">
                                        <li>
                                            <LocalizedLink href="/categories" className="flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm">
                                                <span className="ms-3">Menu 1</span>
                                            </LocalizedLink>
                                        </li>
                                        <li>
                                            <LocalizedLink href="/categories" className="flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm">
                                                <span className="ms-3">Menu 2</span>
                                            </LocalizedLink>
                                        </li>
                                        <li>
                                            <LocalizedLink href="/categories" className="flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm">
                                                <span className="ms-3">Menu 3</span>
                                            </LocalizedLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </aside>

                {/* Optional backdrop for mobile */}
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black opacity-40 sm:hidden z-30"
                    />
                )}
            </div>
        </>
    )
}

export default Sidebar