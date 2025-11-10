"use client";
import Dashboard from "@/components/Dashboard/Dashboard";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import { useAuth } from "@/lib/context/auth-context";
import LocalizedLink from "@/lib/localizedLink";
import { LayoutDashboard, Users } from "lucide-react";
import React, { Suspense } from "react";
import { useT } from "../../layout";

export default function Page() {
  const t = useT("dashboard");

  const breadcrumb = [
    {
      title: "User",
      link: '/user',
      isLast: false
    },
    {
      title: "Dashboard",
      link: '/dashboard',
      isLast: true
    }
  ]

  return (
    <div className="p-4 mt-14">
      <Breadcrumb items={breadcrumb} />
      <Dashboard t={t} />
    </div>
  );
}
