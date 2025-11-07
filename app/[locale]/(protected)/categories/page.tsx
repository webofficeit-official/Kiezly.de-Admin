"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterCategories from "@/components/ManageCategories/FilterCategories";

export default function Page() {
    const t = useT("categories");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/categories',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterCategories/>
        </div>
    );
}
