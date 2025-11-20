"use client";

import { useEffect, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import JobPagination from "./JobPagination";
import HeaderSkeleton from "../ui/skeleton/HeaderSkeleton";
import TableSkeleton from "../ui/skeleton/TableSkeleton";
import { useFilterJobReports } from "@/lib/react-query/queries/job-reports/job-reports";
import ReportTable from "./Report/ReportTable";
import ReportHeader from "./Report/ReportHeader";
import ReportFilterModel from "./Report/ReportFilterModel";
import Pagination from "../ui/pagination/pagination";
const MIN_LOADING_MS = 350;

const ReportedJobs = () => {
  const t = useT("reported-jobs");

  const [jobReports, setJobReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [filter, setFilter] = useState({
    job_ids: "",
    user_ids: "",
    status: "pending",
    sort: "asc",
    pageSize: 10,
  });

  const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

  const filterJobReports = useFilterJobReports();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();
    setLoading(true);
    filterJobReports.mutate(
      {
        job_ids: filter.job_ids,
        user_ids: filter.user_ids,
        sort: filter.sort,
        status: filter.status,
        page_size: filter.pageSize,
        page,
      },
      {
        onSuccess: (data) => {
          if (!mounted) return;
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setJobReports(data?.data?.jobReports);
            setPage(data?.data?.page);
            setFilter({
              ...filter,
              pageSize: data?.data?.page_size,
            });
            setTotalItems(data?.data?.total_items);
            setTotalPages(data?.data?.total_pages);
            setLoading(false);
          }, remaining);
        },
        onError: (error) => {
          console.log(error);
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
  }, [page, inviteAdminModelOpen]);

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        {/* Job header */}
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <ReportHeader
            totalItems={totalItems}
            setInviteAdminModelOpen={setInviteAdminModelOpen}
            inviteAdminModelOpen={inviteAdminModelOpen}
            t={t}
          />
        )}

        {/* Job Table */}
        {loading ? (
          <TableSkeleton rows={8} columns={9} />
        ) : (
          <ReportTable
            jobReports={jobReports}
            t={t}
            setJobReports={setJobReports}
            page={page}
            pageSize={filter.pageSize}
          />
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={setPage}
        />
        {/* <JobPagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={setPage}
        /> */}
      </div>

      <ReportFilterModel
        isOpen={inviteAdminModelOpen}
        setIsOpen={setInviteAdminModelOpen}
        t={t}
        filter={filter}
        setFilter={setFilter}
      />
    </>
  );
};

export default ReportedJobs;
