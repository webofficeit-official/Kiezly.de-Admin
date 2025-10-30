import { useT } from "@/app/[locale]/layout";
import LocalizedLink from "@/lib/localizedLink";
import { BriefcaseBusiness, ChevronDown, ChevronRight, ChevronUp, FolderCheck, FolderCode, Globe, Home, Languages, LayoutDashboard, ScrollText, ShieldPlus, Users } from "lucide-react";
import { useState } from "react";

const Breadcrumb = ({ items }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const t = useT('sidebar');

    return (
        <>
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <Home className="w-4 h-4" />
                            <span className="ms-2">Home</span>
                        </a>
                    </li>
                    {
                        items.map((i) => (
                            <li>
                                <div className="flex items-center">
                                    <ChevronRight className="w-4 h-4" />
                                    <LocalizedLink
                                        key={i}
                                        href={i.link}
                                        className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        {
                                            i.isLast ? 
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{i.title}</span>
                                             : <span>{i.title}</span>
                                        }
                                    </LocalizedLink>
                                </div>
                            </li>
                        ))
                    }
                </ol>
            </nav>

        </>
    )
}

export default Breadcrumb