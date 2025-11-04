"use client";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React from "react";
import { useT } from "../../layout";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";

export default function Profile() {
   const t = useT("profile");

  const breadcrumb = [
    {
      title: t("profile.breadcrumb.profile"),
      link: "/my-profile",
      isLast: true,
    },
  ];

  return (
    <div className="p-4 mt-14">
      <Breadcrumb items={breadcrumb} /> 
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] mt-10 lg:p-4">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          {t("profile.main_title")}
        </h3>
        <div className="space-y-2">
          <UserMetaCard />
          <UserInfoCard />
        </div>
      </div>
    </div>
  );
}
