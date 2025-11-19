import { Check, Eye, Facebook, Globe, Instagram, Linkedin, X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Job } from "@/lib/types/job-type";
import { useState } from "react";
import LocalizedLink from "@/lib/localizedLink";
import DraggableScroll from "@/components/ui/DragableScrollbar/DragableScrollBar";
import UserModel from "@/components/ManageUsers/UserModel";
import { JobReport } from "@/lib/types/job-report-types";
dayjs.extend(relativeTime);

const ReportTable = ({ jobReports, t, setJobReports, page, pageSize }) => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUserId(null);
    };
    const openUserModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsUserModalOpen(true);
    };

    return (
        <DraggableScroll className="p-0" horizontalOnly={true}>
            <table className="w-full mt-4 text-left table-auto min-w-max">
                <thead>
                    <tr>
                        <th
                            className="text-left transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                                {t("list.table.sl")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                                {t("list.table.job-title")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.reason")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.description")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.user")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.status")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        jobReports.length > 0 ?
                            jobReports?.map((j: JobReport, i) => (
                                <tr key={j.id} className="cursor-pointer">
                                    <td className="border-b border-slate-200 text-center">
                                        <div className="flex flex-col">
                                            {i + ((page - 1) * pageSize) + 1}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 w-64">
                                        <div className="flex items-center gap-3">
                                            <LocalizedLink href={`/job/${j.job.slug}`}>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {j.job.title}
                                                    </p>
                                                    <p
                                                        className="text-sm text-slate-500">
                                                        {j.job.subtitle}
                                                    </p>
                                                </div>
                                            </LocalizedLink>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {j.reason}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <p
                                                className="text-sm text-slate-500"
                                                dangerouslySetInnerHTML={{ __html: j.description || "" }} />
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {j.user.first_name} {j.user.last_name}
                                            </p>
                                            <p className="text-sm text-slate-700">
                                                {j.user.email} / {j.user.phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="text-sm text-slate-500">
                                            <span className={getStatusClasses(j.status)}>
                                                {t(`filter.form.status.options.${j.status}`)}
                                            </span>
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <LocalizedLink href={`/job/${j.job.slug}`}>
                                            <Eye className="w-5 h-5 text-black" />
                                        </LocalizedLink>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-6 font-semibold text-lg text-gray-700">{t("list.empty")}</td>
                                </tr>
                            )
                    }
                </tbody>
            </table>

            {isUserModalOpen && (
                <UserModel
                    isOpen={isUserModalOpen}
                    onClose={closeUserModal}
                    userId={selectedUserId}
                />
            )}
        </DraggableScroll>
    )
}

function getStatusClasses(status: string) {
    switch (status.toLowerCase()) {
        case "resolved":
            return "px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300";
        case "pending":
            return "px-3 py-1 rounded-xl bg-amber-100 text-amber-700 ring-1 ring-amber-300";
        case "reviewed":
            return "px-3 py-1 rounded-xl bg-blue-100 text-blue-700 ring-1 ring-blue-300";
        case "rejected":
            return "px-3 py-1 rounded-xl bg-red-100 text-red-700 ring-1 ring-red-300";
        default:
            return "px-3 py-1 rounded-xl bg-gray-100 text-gray-600";
    }
}


export default ReportTable;