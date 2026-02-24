"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterJobReviews from "@/components/ManageJobReviews/FilterJobReviews";
export default function Page() {
    const t = useT("jobs-review");

    const breadcrumb = [
        {
            title: t("subtitle"),
            link: '/jobs-review',
            isLast: false
        },
        {
            title: t("title"),
            link: '/jobs-review',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
           <FilterJobReviews />
        </div>
    );
}
