"use client";

import { useEffect, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import HeaderSkeleton from "../ui/skeleton/HeaderSkeleton";
import TableSkeleton from "../ui/skeleton/TableSkeleton";
import Pagination from "../ui/pagination/pagination";
import JobReviewHeader from "./JobReviewHeader";
import { useFilterReviews } from "@/lib/react-query/queries/jobs-review/jobs-review";
import ReviewTable from "./ReviewTable";
import ReviewFilterModel from "./ReviewFilterModel";
const MIN_LOADING_MS = 350;
type ReviewSortBy = "created_at" | "rating";
type ReviewSortOrder = "ASC" | "DESC";

interface ReviewFilter {
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  visibility?: boolean;
  min_rating?: number;
  max_rating?: number;
  sort_by: ReviewSortBy;
  sort_order: ReviewSortOrder;
  pageSize: number;
}
const defaultFilter: ReviewFilter = {
  job_id: "",
  reviewer_id: "",
  reviewee_id: "",
  visibility: undefined,
  min_rating: undefined,
  max_rating: undefined,
  sort_by: "created_at",
  sort_order: "DESC",
  pageSize: 10,
};

const FilterJobReviews = () => {
  const t = useT("jobs-review");

  const [jobReviews, setJobReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [filter, setFilter] = useState(defaultFilter);
  const [appliedFilter, setAppliedFilter] = useState(defaultFilter);

  const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

  const filterJobReviews = useFilterReviews();
  const [loading, setLoading] = useState(false);

  const applyFilter = () => {
    setAppliedFilter({ ...filter });
    setPage(1);
  };

  useEffect(() => {
    let mounted = true;
    const start = Date.now();
    setLoading(true);

    filterJobReviews.mutate(
      {
        job_id: appliedFilter.job_id || undefined,
        reviewer_id: appliedFilter.reviewer_id || undefined,
        reviewee_id: appliedFilter.reviewee_id || undefined,
        visibility: appliedFilter.visibility,
        min_rating: appliedFilter.min_rating,
        max_rating: appliedFilter.max_rating,
        sort_by: appliedFilter.sort_by,
        sort_order: appliedFilter.sort_order,
        page,
        page_size: appliedFilter.pageSize,
      },
      {
        onSuccess: (data) => {
          if (!mounted) return;

          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

          setTimeout(() => {
            if (!mounted) return;

            setJobReviews(data?.data?.items || []);
            setTotalPages(data?.data?.total_pages);
            setTotalItems(data?.data?.total_items);
            setLoading(false);
          }, remaining);
        },
        onError: () => {
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

          setTimeout(() => {
            if (!mounted) return;
            setLoading(false);
          }, remaining);
        },
      },
    );

    return () => {
      mounted = false;
    };
  }, [page, appliedFilter]);

  const clearFilter = () => {
    setFilter(defaultFilter);
    setAppliedFilter(defaultFilter);
    setPage(1);
  };

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        {/* Job header */}
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <JobReviewHeader
            totalItems={totalItems}
            setInviteAdminModelOpen={setInviteAdminModelOpen}
            inviteAdminModelOpen={inviteAdminModelOpen}
            t={t}
            onClearFilter={clearFilter}
          />
        )}

        {/* Job Table */}
        {loading ? (
          <TableSkeleton rows={8} columns={9} />
        ) : (
          <ReviewTable
            jobReviews={jobReviews}
            t={t}
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

      <ReviewFilterModel
        isOpen={inviteAdminModelOpen}
        setIsOpen={setInviteAdminModelOpen}
        t={t}
        filter={filter}
        setFilter={setFilter}
        applyFilter={applyFilter}
      />
    </>
  );
};

export default FilterJobReviews;
