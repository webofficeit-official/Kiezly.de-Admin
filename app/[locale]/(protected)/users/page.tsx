"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense } from "react";
import { useT } from "../../layout";
import FilterUser from "@/components/ManageUsers/FilterUser";

export default function Page() {
    const t = useT("users");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/users',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
            <FilterUser />
        </div>
    );
}
