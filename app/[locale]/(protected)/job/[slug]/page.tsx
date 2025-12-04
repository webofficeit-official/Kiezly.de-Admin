"use client";
import Breadcrumb from "@/components/layout/private/Breadcrumbs";
import React, { Suspense, useEffect, useState } from "react";
import { useT } from "../../../layout";
import JobDetail from "@/components/ManageJobs/Detail/JobDetail";
import { useParams } from "next/navigation";
import {
  useJobDetails,
  useJobDetailsBySlug,
} from "@/lib/react-query/queries/job/jobs";
import JobDetailSkeleton from "@/components/ui/skeleton/JobDetailSkeleton";
const MIN_LOADING_MS = 350;

export default function Page() {
  const t = useT("jobs");
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const breadcrumb = [
    {
      title: t("subtitle"),
      link: "/jobs",
      isLast: false,
    },
    {
      title: t("title"),
      link: "/jobs",
      isLast: false,
    },
    {
      title: job?.title,
      link: "/jobs",
      isLast: true,
    },
  ];

  const jobDetails = useJobDetailsBySlug();

  useEffect(() => {
    let mounted = true;
    const start = Date.now();

    setLoading(true);
    jobDetails.mutate(
      {
        slug: slug as string,
      },
      {
        onSuccess: (d) => {
          if (!mounted) return;
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setJob(d.job);
            setLoading(false);
          }, remaining);
        },
        onError: (e) => {
          console.log(e);
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setLoading(false);
          }, remaining);
        },
      }
    );
     return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <div className="p-4 mt-14">
      <Breadcrumb items={breadcrumb} />
            {loading && <JobDetailSkeleton />}
      {!loading && job && <JobDetail t={t} job={job} />}
    </div>
  );
}
