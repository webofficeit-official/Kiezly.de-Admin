import React, { useState } from "react";
import {
    Briefcase,
    MapPin,
    Clock,
    Bookmark,
    Building2,
    CheckCircle2,
    CheckCircle,
    Ban,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useT } from "@/app/[locale]/layout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/types/job-type";
import { useJobApproval } from "@/lib/react-query/queries/job/jobs";
import toast from "react-hot-toast";
// Extend dayjs with the plugin
dayjs.extend(relativeTime);


export default function JobHeader({ job, t }: { job: Job, t: any }) {
    const [jobDetails, setJobDetails] = useState(job);

    const jobAproval = useJobApproval()

    const handleAproval = (id: string, status: string) => {
        jobAproval.mutate({
            id,
            status
        }, {
            onSuccess: (d) => {
                setJobDetails({
                    ...job,
                    status
                })
                status == "published" ? toast.success(t(`approve.success.${status}`)) : toast.error(t(`approve.success.${status}`))
            }, onError: (e) => {
                console.log(e)
                toast.error(t("approve.failed"))
            }
        })
    }

    return (
        <>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex justify-between">
                        <h1 data-testid="job-title" className="text-2xl font-semibold tracking-tight">{jobDetails?.title}</h1>
                        {
                            jobDetails.status == "pending_review" &&
                            <div className="space-x-2">
                                <button className="inline-flex items-center justify-center rounded-2xl text-sm font-medium px-3 py-2 transition-colors disabled:opacity-50 border rounded-xl bg-green-100 text-green-900 border-green-200" onClick={() => handleAproval(jobDetails.id, "published")}><CheckCircle className="mr-2 h-4 w-4" /> {t("detail.header.accept")}</button>
                                <button className="inline-flex items-center justify-center rounded-2xl text-sm font-medium px-3 py-2 transition-colors disabled:opacity-50 border rounded-xl bg-red-100 text-red-700 border-red-200" onClick={() => handleAproval(jobDetails.id, "rejected")}><Ban className="mr-2 h-4 w-4" /> {t("detail.header.decline")}</button>
                            </div>
                        }
                    </div>
                    {jobDetails?.subtitle && (
                        <h2 className="text-sm text-muted-foreground mt-1">
                            {jobDetails.subtitle}
                        </h2>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {jobDetails?.client && (<span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" />{jobDetails?.client?.org_name}</span>)}
                        {(jobDetails?.street || jobDetails?.city || jobDetails?.state || jobDetails?.postal_code || jobDetails?.country) && (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {[
                                    jobDetails?.street,
                                    jobDetails?.city,
                                    jobDetails?.state,
                                    jobDetails?.postal_code,
                                    jobDetails?.country
                                ].filter(Boolean).join(", ")}
                            </span>
                        )}

                        {jobDetails?.job_type && (<span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" /> {jobDetails?.job_type.join(", ")} {jobDetails?.job_experience ? `. ${jobDetails?.job_experience}` : ""}</span>)}
                        <span className="inline-flex items-center">
                            {jobDetails?.price_type === "range" && jobDetails?.price_min && jobDetails?.price_max
                                ? `${jobDetails?.currency} ${jobDetails?.price_min}–${jobDetails?.price_max}`
                                : jobDetails?.price_value
                                    ? `${jobDetails?.currency} ${jobDetails?.price_value}`
                                    : t("detail.header.not-specified")}
                        </span>
                        {jobDetails?.price_type && <span className="inline-flex items-center">/ {jobDetails?.price_type}</span>}
                        <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{t("detail.header.posted")} {dayjs(jobDetails?.created_at).fromNow()}</span>

                        {jobDetails?.category_name && (
                            <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" /> {jobDetails.category_name}
                            </span>
                        )}

                        {jobDetails?.starts_at && (
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {t("detail.header.start")}: {dayjs(jobDetails.starts_at).format("MMM D, YYYY")}
                            </span>
                        )}

                        {jobDetails?.ends_at && (
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {t("detail.header.end")}: {dayjs(jobDetails.ends_at).format("MMM D, YYYY")}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {jobDetails.tags?.length > 0 && jobDetails.tags.map((t, index) => (

                    <Badge key={index} variant="secondary" className="rounded-full px-3 py-1">
                        {t?.name}
                    </Badge>

                ))}
            </div>
        </>
    );
}
