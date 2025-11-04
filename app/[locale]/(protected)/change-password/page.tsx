"use client";
 import ChangePassword from "@/components/change-password/ChangePassword";
import React from "react";
import { useT } from "../../layout";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";

export default function Page() {
    const t = useT("changePassword");
  
    const breadcrumb = [
      {
        title: t("title"),
        link: "/change-password",
        isLast: true,
      },
    ];
  return (   <div className="p-4 mt-14">
      <Breadcrumb items={breadcrumb} /> 
       <ChangePassword />;
      </div>)
 
}
