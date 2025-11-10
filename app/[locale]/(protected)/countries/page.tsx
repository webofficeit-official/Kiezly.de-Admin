"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterCountries from "@/components/ManageCountries/FilterCountries";

export default function Page() {
    const t = useT("countries");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/countries',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterCountries/>
        </div>
    );
}
