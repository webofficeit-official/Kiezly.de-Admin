"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import ReportedJobs from "@/components/ManageJobs/ReportedJobs";

export default function Page() {
    const t = useT("reported-jobs");

    const breadcrumb = [
        {
            title: t("subtitle"),
            link: '/reported-jobs',
            isLast: false
        },
        {
            title: t("title"),
            link: '/reported-jobs',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <ReportedJobs />
        </div>
    );
}
