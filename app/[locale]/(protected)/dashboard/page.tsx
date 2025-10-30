"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import { useAuth } from "@/lib/context/auth-context";
import LocalizedLink from "@/lib/localizedLink";
import { LayoutDashboard, Users } from "lucide-react";
import React, { Suspense } from "react";

const dashboard = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Admins",
    count: 253,
    link: "/admins"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Users",
    count: 253,
    link: "/admins"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Admins",
    count: 253,
    link: "/admins"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Admins",
    count: 253,
    link: "/admins"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Admins",
    count: 253,
    link: "/admins"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Admins",
    count: 253,
    link: "/admins"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Total Admins",
    count: 253,
    link: "/admins"
  }
]

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

export default function Page() {
  return (
    <div className="p-4 mt-14">
      <Breadcrumb items={breadcrumb} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6 mt-6">
        {dashboard?.map((d, i) => (
          <LocalizedLink
            key={i}
            href={d.link}
            className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg p-6 items-center justify-center hover:bg-gray-50 transition"
          >
            <div className="p-4">{d.icon}</div>
            <h4 className="mb-2 text-3xl font-extrabold">{d.count}</h4>
            <p className="text-gray-500">{d.title}</p>
          </LocalizedLink>
        ))}
      </div>
    </div>
  );
}
