import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { FilterJobInput } from "../Form/FilterJobInput";
import { FilterJobMultiSelect } from "../Form/FilterJobMultiSelect";
import { FilterJobSelect } from "../Form/FilterJobSelect";
import { FilterJobMultiSelectArray } from "../Form/FilterJobMultiSelectArray";
import { FilterJobSelectClient } from "../Form/FilterJobSelectClient";
import { FilterJobDateInput } from "../Form/FilterJobDateInput";
import { useJobReportFilterCollection } from "@/lib/react-query/queries/job-reports/job-reports";
import { FilterJobSelectHelper } from "../Form/FilterJobSelectHelper";

const ReportFilterModel = ({ isOpen, setIsOpen, t, filter, setFilter }) => {
    const [jobs, setJobs] = useState([]);
    const [helpers, setHelpers] = useState([]);

    const collection = useJobReportFilterCollection()
    useEffect(() => {
        collection.mutate({}, {
            onSuccess: (d) => {
                setJobs(d?.data?.jobs)
                setHelpers(d?.data?.helpers)
            },
            onError: (e) => {
                console.log(e);
            }
        })
    }, [isOpen])

    const STATUS = [
        { value: "", label: t("filter.form.status.options.all") },
        { value: "resolved", label: t("filter.form.status.options.resolved") },
        { value: "pending", label: t("filter.form.status.options.pending") },
        { value: "reviewed", label: t("filter.form.status.options.reviewed") },
        { value: "rejected", label: t("filter.form.status.options.rejected") },
    ]

    const SORT = [
        { value: "asc", label: t("filter.form.sort.options.asc") },
        { value: "desc", label: t("filter.form.sort.options.desc") },
    ]

    const PAGE = [
        { value: "10", label: "10" },
        { value: "25", label: "25" },
        { value: "50", label: "50" },
        { value: "100", label: "100" },
    ]

    return (
        isOpen &&
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 max-w-[50rem] mx-auto">
                {/* Backdrop overlay */}
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={() => setIsOpen(!isOpen)}
                ></div>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                {/* 2. Modal Panel (The actual content box) */}
                <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl sm:w-full">
                    <div className="space-y-2">
                        <div className="flex flex-col p-6">
                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {t("filter.title")}
                                </h2>
                                <X className="h-6 w-6 text-black-300 border border-gray-200 cursor-pointer rounded-lg" onClick={() => setIsOpen(!isOpen)} />
                            </div>
                            <p className="mb-3 mt-1 text-slate-400 text-sm">
                                {t("filter.description")}
                            </p>

                            <div className="flex flex-col md:flex-row space-y-5 md:space-y-4 md:space-x-5">
                                <FilterJobSelectHelper
                                    label={t("filter.form.jobs.label")}
                                    value={filter.job_ids}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            job_ids: v
                                        })
                                    }}
                                    options={jobs.map(j => {
                                        return {
                                            id: j.id,
                                            display_name: j.title
                                        }
                                    })}
                                    placeholder={t("filter.form.jobs.placeholder")}
                                />

                                <FilterJobSelectHelper
                                    label={t("filter.form.helpers.label")}
                                    value={filter.user_ids}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            user_ids: v
                                        })
                                    }}
                                    options={helpers.map(h => {
                                        return {
                                           id: h.id,
                                           display_name:  h.display_name || `${h.first_name} ${h.last_name}`
                                        }
                                    })}
                                    placeholder={t("filter.form.helpers.placeholder")}
                                />
                            </div>

                            <div className="flex flex-col md:flex-row space-y-5 md:space-y-4 md:space-x-5">
                                <FilterJobSelect
                                    label={t("filter.form.status.label")}
                                    value={filter.status}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            status: v
                                        })
                                    }}
                                    options={STATUS}
                                    placeholder={t("filter.form.status.placeholder")}
                                />

                                <FilterJobSelect
                                    label={t("filter.form.sort.label")}
                                    value={filter.sort}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            sort: v
                                        })
                                    }}
                                    options={SORT}
                                    placeholder={t("filter.form.sort.placeholder")}
                                />

                                <FilterJobSelect
                                    label={t("filter.form.pageSize.label")}
                                    value={filter.pageSize}
                                    onChange={(v) => {
                                        setFilter({
                                            ...filter,
                                            pageSize: v
                                        })
                                    }}
                                    options={PAGE}
                                    placeholder={t("filter.form.pageSize.placeholder")}
                                />
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="text-end space-x-2">
                                <button
                                    className="w-32 mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-dialog-close="true"
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {t("filter.form.button.cancel")}
                                </button>

                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="w-32 mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="button"
                                    data-dialog-close="true">
                                    {t("filter.form.button.filter")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ReportFilterModel