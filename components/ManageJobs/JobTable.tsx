import { Check, Facebook, Globe, Instagram, Linkedin, X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Job } from "@/lib/types/job-type";
import { useState } from "react";
import JobModel from "./JobModel";
dayjs.extend(relativeTime);

const JobTable = ({ jobs, t, setJobs, page, pageSize }) => {
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const closeJobModal = () => {
        setIsJobModalOpen(false);
        setSelectedJobId(null);
    };
    const openJobModal = (jobId: string) => {
        setSelectedJobId(jobId);
        setIsJobModalOpen(true);
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
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.location")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
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
                    </tr>
                </thead>
                <tbody>
                    {
                        jobs?.map((j: Job, i) => (
                            <tr key={j.id} onClick={() => openJobModal(j.id)} className="cursor-pointer">
                                <td className="border-b border-slate-200 text-center">
                                    <div className="flex flex-col">
                                        {i + ((page - 1) * pageSize) + 1}
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 w-64" onClick={() => openJobModal(j.id)}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {j.title}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">
                                                {j.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
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
                                <td className="p-4 border-b border-slate-200 w-0">
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
                                <td className="p-4 border-b border-slate-200 w-0">
                                    <div className="w-max flex gap-2">
                                        <p
                                            className="text-sm font-semibold text-slate-700">
                                                {j.job_type.join(", ")}
                                        </p>
                                    </div>
                                    <div className="w-max flex gap-2">
                                        <p
                                            className="text-sm text-slate-500">
                                                {j.job_experience.join(", ")}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        {j.starts_at && dayjs(j?.starts_at).format("MMM D, YYYY")} - {j.ends_at && dayjs(j?.ends_at).format("MMM D, YYYY")}
                                    </p>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {isJobModalOpen && (
                <JobModel
                    isOpen={isJobModalOpen}
                    onClose={closeJobModal}
                    jobId={selectedJobId}
                />
            )}
        </div>
    )
}

export default JobTable;