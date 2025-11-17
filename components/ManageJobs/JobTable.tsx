import { Check, Eye, Facebook, Globe, Instagram, Linkedin, X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Job } from "@/lib/types/job-type";
import { useState } from "react";
import LocalizedLink from "@/lib/localizedLink";
import UserModel from "../ManageUsers/UserModel";
dayjs.extend(relativeTime);

const JobTable = ({ jobs, t, setJobs, page, pageSize }) => {
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
        <div className="p-0 overflow-scroll">
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
                                {t("list.table.title")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.client")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.category")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.location")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.type-experience")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.date")}
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
                        jobs.length > 0 ?
                            jobs?.map((j: Job, i) => (
                                <tr key={j.id} className="cursor-pointer">
                                    <td className="border-b border-slate-200 text-center">
                                        <div className="flex flex-col">
                                            {i + ((page - 1) * pageSize) + 1}
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200 w-64">
                                        <div className="flex items-center gap-3">
                                            <LocalizedLink href={`/job/${j.slug}`}>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        {j.title}
                                                    </p>
                                                    <p
                                                        className="text-sm text-slate-500">
                                                        {j.subtitle}
                                                    </p>
                                                </div>
                                            </LocalizedLink>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700" onClick={() => openUserModal(j.client.id)}>
                                                {j.client.org_name}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">
                                                {(j.contact_method == "direct_email" || j.contact_method == "email_relay") && j.contact_email}
                                                {(j.contact_method == "external_link") && <>
                                                    <a href={j.contact_link} target="__blank">{t("list.table.external_link")}</a>
                                                </>}
                                                {(j.contact_method == "phone") && j.contact_phone}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {j.category_name}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">
                                                {j.price_type == "fixed" ? j.price_value : `${j.price_min} - ${j.price_max}`} / {j.currency}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {j.street} {j.postal_code}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">
                                                {j.state}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <div className="w-max flex gap-2">
                                            <p
                                                className="text-sm font-semibold text-slate-700">
                                                {j.job_types?.join(", ")}
                                            </p>
                                        </div>
                                        <div className="w-max flex gap-2">
                                            <p
                                                className="text-sm text-slate-500">
                                                {j.job_experiences?.join(", ")}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="text-sm text-slate-500">
                                            {j.starts_at && dayjs(j?.starts_at).format("MMM D, YYYY")} - {j.ends_at && dayjs(j?.ends_at).format("MMM D, YYYY")}
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <p className="text-sm text-slate-500">
                                            <span className={getStatusClasses(j.status)}>
                                                {t(`filter.form.status.options.${j.status}`)}
                                            </span>
                                        </p>
                                    </td>
                                    <td className="p-4 border-b border-slate-200">
                                        <LocalizedLink href={`/job/${j.slug}`}>
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
        </div>
    )
}

function getStatusClasses(status: string) {
    switch (status.toLowerCase()) {
        case "published":
            return "px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300";
        case "closed":
            return "px-3 py-1 rounded-xl bg-slate-100 text-slate-700 ring-1 ring-slate-300";
        case "rejected":
            return "px-3 py-1 rounded-xl bg-red-100 text-red-700 ring-1 ring-red-300";
        case "open":
            return "px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300";
        case "in_progress":
            return "px-3 py-1 rounded-xl bg-blue-100 text-blue-700 ring-1 ring-blue-300";
        case "expired":
            return "px-3 py-1 rounded-xl bg-orange-100 text-orange-700 ring-1 ring-orange-300";
        case "draft":
            return "px-3 py-1 rounded-xl bg-gray-100 text-gray-600 ring-1 ring-gray-300";
        case "completed":
            return "px-3 py-1 rounded-xl bg-green-100 text-green-700 ring-1 ring-green-300";
        case "cancelled":
            return "px-3 py-1 rounded-xl bg-rose-100 text-rose-700 ring-1 ring-rose-300";
        case "pending_review":
            return "px-3 py-1 rounded-xl bg-gray-100 text-gray-700 ring-1 ring-gray-300";
        default:
            return "px-3 py-1 rounded-xl bg-gray-100 text-gray-600";
    }
}


export default JobTable;