import { useT } from "@/app/[locale]/layout";
import { useAuth } from "@/lib/context/auth-context";
import LocalizedLink from "@/lib/localizedLink";
import { BriefcaseBusiness, ChevronDown, ChevronUp, FolderCheck, FolderCode, Globe, Languages, Layers, LayoutDashboard, MapPinned, Navigation, Newspaper, ShieldPlus, Users,Earth,Briefcase,Tags, Layers2, Ban    } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaClipboardCheck } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const pathName = usePathname()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(pathName?.split('/')[2]);
    const t = useT('sidebar');
    const {user}=useAuth();

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
                                <LocalizedLink href="/dashboard" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'dashboard' && 'bg-slate-100'}`} onClick={() => setCurrentPath('dashboard')}>
                                    <LayoutDashboard className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.dashboard")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Admins */}
                            {user?.is_super_admin?(
                                 <li>
                                <LocalizedLink href="/admins" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'admins' && 'bg-slate-100'}`} onClick={() => setCurrentPath('admins')}>
                                    <ShieldPlus className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.admins")}</span>
                                </LocalizedLink>
                            </li>
                            ):(
                                <></>
                            )}
                          
                            {/* Users */}
                            <li>
                                <LocalizedLink href="/users" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'users' && 'bg-slate-100'}`} onClick={() => setCurrentPath('users')}>
                                    <Users className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.users")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Jobs  */}
                            <li>
                                <button onClick={() => setIsJobOpen(!isJobOpen)} className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false justify-between ${isJobOpen && 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <BriefcaseBusiness className="w-5 h-5" />
                                        <span className="ms-3">{t("menu.jobs")}</span>
                                    </div>
                                    {isJobOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {isJobOpen && (
                                    <ul className="py-2 space-y-2">
                                        <li>
                                            <LocalizedLink href="/jobs" className={`flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm ${currentPath == 'jobs' && 'bg-slate-100'}`} onClick={() => setCurrentPath('jobs')}>
                                                <Layers className="w-5 h-5" />
                                                <span className="ms-3">{t("menu.all-jobs")}</span>
                                            </LocalizedLink>
                                        </li>
                                        <li>
                                            <LocalizedLink href="/new-jobs" className={`flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm ${currentPath == 'new-jobs' && 'bg-slate-100'}`} onClick={() => setCurrentPath('new-jobs')}>
                                                <Newspaper className="w-5 h-5" />
                                                <span className="ms-3">{t("menu.pending-aproval")}</span>
                                            </LocalizedLink>
                                        </li>
                                        <li>
                                            <LocalizedLink href="/reported-jobs" className={`flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm ${currentPath == 'reported-jobs' && 'bg-slate-100'}`} onClick={() => setCurrentPath('reported-jobs')}>
                                                <Ban className="w-5 h-5" />
                                                <span className="ms-3">{t("menu.reported-jobs")}</span>
                                            </LocalizedLink>
                                        </li>
                                         <li>
                                            <LocalizedLink href="/jobs-review" className={`flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm ${currentPath == 'jobs-review' && 'bg-slate-100'}`} onClick={() => setCurrentPath('jobs-review')}>
                                              <FaClipboardCheck  className="w-5 h-5" />
                                                <span className="ms-3">{t("menu.jobs-review")}</span>
                                            </LocalizedLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                        <ul className="space-y-2 font-medium p-2 border-t border-gray-200 dark:border-gray-700 mt-3 pt-4">
                            {/* Categories */}
                            <li>
                                <LocalizedLink href="/categories" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'categories' && 'bg-slate-100'}`} onClick={() => setCurrentPath('categories')}>
                                    <FolderCode className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.categories")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Job Tags */}
                            <li>
                                <LocalizedLink href="/job-tags" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'job-tags' && 'bg-slate-100'}`} onClick={() => setCurrentPath('job-tags')}>
                                    <FolderCheck className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.job-tags")}</span>
                                </LocalizedLink>
                            </li>

                               {/* Job Experience */}
                            <li>
                                <LocalizedLink href="/job-experience" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'job-experience' && 'bg-slate-100'}`} onClick={() => setCurrentPath('job-experience')}>
                                    <Briefcase  className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.job-experience")}</span>
                                </LocalizedLink>
                            </li>

                             {/* Job mode */}
                            <li>
                                <LocalizedLink href="/job-types" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'job-types' && 'bg-slate-100'}`} onClick={() => setCurrentPath('job-types')}>
                                    <Tags className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.job-type")}</span>
                                </LocalizedLink>
                            </li>
                          
                            {/* Languages */}
                            <li>
                                <LocalizedLink href="/langauges" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'langauges' && 'bg-slate-100'}`} onClick={() => setCurrentPath('langauges')}>
                                    <Languages className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.langauges")}</span>
                                </LocalizedLink>
                            </li>
                            {/* Locations */}
                            <li>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false justify-between ${isDropdownOpen && 'bg-gray-100'}`}>
                                    <div className="flex">
                                        <Navigation className="w-5 h-5" />
                                        <span className="ms-3">{t("menu.locations")}</span>
                                    </div>
                                    {isDropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {isDropdownOpen && (
                                    <ul className="py-2 space-y-2">
                                        <li>
                                            <LocalizedLink href="/countries" className={`flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm ${currentPath == 'countries' && 'bg-slate-100'}`} onClick={() => setCurrentPath('countries')}>
                                                <Globe className="w-5 h-5" />
                                                <span className="ms-3">{t("menu.countries")}</span>
                                            </LocalizedLink>
                                        </li>
                                        <li>
                                            <LocalizedLink href="/postal-codes" className={`flex items-center w-full p-2 pl-11 text-gray-900 
                                                    transition duration-75 rounded-lg group 
                                                    hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm ${currentPath == 'postal-codes' && 'bg-slate-100'}`} onClick={() => setCurrentPath('postal-codes')}>
                                                <MapPinned className="w-5 h-5" />
                                                <span className="ms-3">{t("menu.zipcodes")}</span>
                                            </LocalizedLink>
                                        </li>
                                    </ul>
                                )}
                            </li>

                               <li>
                                <LocalizedLink href="/localization" className={`flex px-4 py-2 text-sm hover:bg-gray-100 w-full text-left false ${currentPath == 'localization' && 'bg-slate-100'}`} onClick={() => setCurrentPath('localization')}>
                                      <Earth  className="w-5 h-5" />
                                    <span className="ms-3">{t("menu.localization")}</span>
                                </LocalizedLink>
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