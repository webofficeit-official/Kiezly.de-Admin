"use client";

import { Card } from "@/components/ui/card";
import { useJobReportStatusUpdate } from "@/lib/react-query/queries/job-reports/job-reports";
import { JobReport } from "@/lib/types/job-report-types";
import { Listbox } from "@headlessui/react";
import { Check, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface UserModelProps {
    isOpen: boolean;
    onClose: (id: number, status: string) => void;
    report: JobReport;
    t: any
}

export default function StatusModel({ isOpen, onClose, report, t }: UserModelProps) {
    const [status, setStatus] = useState<string | null>(null)

    const updateMutate = useJobReportStatusUpdate();
    const handleSubmit = (id: number, status: string) => {
        updateMutate.mutate({
            id,
            status
        }, {
            onSuccess: (d) => {
                toast.success(t(`update-model.success`))
                onClose(id, status)
            }, 
            onError: (e) => {
                toast.success(t(`update-model.error`))
                console.log(e)
            }
        })
    }  

    return (
        <>
            {report ? (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop overlay */}
                        <div
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={() => onClose(report.id, report.status)}
                        ></div>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* 2. Modal Panel (The actual content box) */}
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-xl lg:max-w-lg xl:max-w-lg sm:w-full">
                            <div className="space-y-2">
                                <Card className="space-y-6">
                                    <div className="">
                                        <div className="p-6">
                                            {/* --- Header --- */}
                                            <div className="flex justify-between">
                                                <h2 className="text-lg font-bold text-gray-900">
                                                    {t(`update-model.title`)}
                                                </h2>
                                                <button data-dialog-close="true" onClick={(s) => onClose(report.id, report.status)}>
                                                    <X className="h-6 w-6 text-black-300 border border-gray-200 cursor-pointer rounded-lg" />
                                                </button>
                                            </div>

                                            <Select
                                                label={t("update-model.status.label")}
                                                value={status}
                                                onChange={(s) => setStatus(s)}
                                                options={[
                                                    { value: "reviewed", name: t("update-model.status.options.reviewed") },
                                                    { value: "rejected", name: t("update-model.status.options.rejected") },
                                                    { value: "resolved", name: t("update-model.status.options.resolved") },
                                                ]}
                                            />

                                            <div className="flex justify-between mt-4">
                                                <p className="text-lg font-bold text-gray-900 mt-1">
                                                    <span className="text-sm font-normal text-gray-900">{t(`update-model.reason.label`)} :</span> {t(`update-model.reason.options.${report.reason}`)}
                                                </p>
                                            </div>

                                            {/* --- Bio --- */}
                                            {report.description && report.description.trim() && (
                                                <div className="mt-4">
                                                    <span className="text-sm font-normal text-gray-900">{t(`update-model.description.label`)} :</span>
                                                    <div className="text-sm text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: report.description }} />
                                                </div>
                                            )}
                                            <hr className="mt-4 mb-4" />
                                            <div className="text-end space-x-2">
                                                <button
                                                    onClick={() => handleSubmit(report.id, status)}
                                                    className="w-32 mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                                    type="button"
                                                    data-dialog-close="true">
                                                    {t(`update-model.button.change`)}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
    placeholder = "Select"
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: {
        value: string
        name: string
    }[];
    placeholder?: string
}) {
    return (
        <div className="text-sm mt-5 w-full">
            <span className="mb-1 block text-gray-700">{label}</span>

            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black">
                        {value || placeholder}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
                        {options.map((o) => (
                            <Listbox.Option
                                key={o.value}
                                value={o.value}
                                className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 ui-active:bg-gray-100"
                            >
                                {({ selected }) => (
                                    <>
                                        <button className="flex items-center justify-between">
                                            <span>{o.name}</span>
                                            {selected && <Check className="h-4 w-4 text-gray-600" />}
                                        </button>
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}