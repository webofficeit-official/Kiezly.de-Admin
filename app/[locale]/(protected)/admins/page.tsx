"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import FilterAdmins from "@/components/ManageAdmins/FilterAdmin";
import React, { Suspense } from "react";
import { useT } from "../../layout";

export default function Page() {
    const t = useT("admins");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/admins',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterAdmins />
        </div>
    );
}
