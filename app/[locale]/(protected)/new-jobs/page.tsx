"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import NewJob from "@/components/ManageJobs/NewJob";

export default function Page() {
    const t = useT("jobs");

    const breadcrumb = [
        {
            title: t("subtitle"),
            link: '/jobs',
            isLast: false
        },
        {
            title: t("basetitle"),
            link: '/jobs',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <NewJob />
        </div>
    );
}
