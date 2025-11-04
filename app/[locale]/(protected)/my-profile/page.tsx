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
      <div className="rounded-2xl   p-2 mt-2 lg:p-2">
        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-5">
          {t("profile.main_title")}
        </h3>
        <div className="space-y-2">
          {/* <UserMetaCard /> */}
          <UserInfoCard />
        </div>
      </div>
    </div>
  );
}
