"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterPostalCode from "@/components/ManagePostalCode/FilterPostalCode";

export default function Page() {
    const t = useT("postal-codes");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/postal-codes',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterPostalCode />
        </div>
    );
}
