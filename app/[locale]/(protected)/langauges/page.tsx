"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterLanguages from "@/components/ManageLanguages/FilterLanguages";

export default function Page() {
    const t = useT("languages");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/languages',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterLanguages />
        </div>
    );
}
