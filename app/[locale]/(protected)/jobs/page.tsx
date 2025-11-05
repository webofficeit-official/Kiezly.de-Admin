"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterJob from "@/components/ManageJobs/FilterJob";

export default function Page() {
    const t = useT("jobs");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/jobs',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterJob />
        </div>
    );
}
