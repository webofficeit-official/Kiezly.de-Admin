"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterJobExperience from "@/components/ManageJobExperience/FilterJobExperience";

export default function Page() {
    const t = useT("job-experience");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/job-experience',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterJobExperience/>
        </div>
    );
}
