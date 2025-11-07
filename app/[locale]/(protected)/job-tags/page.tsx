"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterJobTag from "@/components/ManageJobTag/FilterJobTags";

export default function Page() {
    const t = useT("job-tags");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/job-tags',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterJobTag />
        </div>
    );
}
