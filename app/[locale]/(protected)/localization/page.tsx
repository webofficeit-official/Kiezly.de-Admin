"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React from "react";
import { useT } from "../../layout";

export default function Page() {
    const t = useT("localization");

    const breadcrumb = [
        {
            title: t("title"),
            link: '/localization',
            isLast: true
        }
    ]
    return (
        <div className="p-4 mt-14">
            <Breadcrumb items={breadcrumb} />
        </div>
    );
}
