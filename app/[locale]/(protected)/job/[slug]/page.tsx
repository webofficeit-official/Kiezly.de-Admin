"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense, useEffect, useState } from "react";
import { useT } from "../../../layout";
import JobDetail from "@/components/ManageJobs/Detail/JobDetail";
import { useParams } from "next/navigation";
import { useJobDetails, useJobDetailsBySlug } from "@/lib/react-query/queries/job/jobs";

export default function Page() {
    const t = useT("jobs");
    const { slug } = useParams();
    const [job, setJob] = useState(null)

    const breadcrumb = [
        {
            title: t("subtitle"),
            link: '/jobs',
            isLast: false
        },
        {
            title: t("title"),
            link: '/jobs',
            isLast: false
        },
        {
            title: job?.title,
            link: '/jobs',
            isLast: true
        }
    ]

    const jobDetails = useJobDetailsBySlug()

    useEffect(() => {
        jobDetails.mutate({
            slug: slug as string
        }, {
            onSuccess: (d) => {
                setJob(d.job)
            },
            onError: (e) => {
                console.log(e)
            }
        })
    }, [ slug ])

    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            {
                job &&
                <JobDetail t={t} job={job} />
            }
        </div>
    );
}
