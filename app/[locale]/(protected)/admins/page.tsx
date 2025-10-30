"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import FilterAdmins from "@/components/ManageAdmins/FilterAdmin";
import React, { Suspense } from "react";

const breadcrumb = [
  {
    title: "Manage Admins",
    link: '/admins',
    isLast: true
  }
]

export default function Page() {
  return (
    <div className="p-4 mt-14">
      <Breadcrumb items={breadcrumb} />
      <FilterAdmins />
    </div>
  );
}
