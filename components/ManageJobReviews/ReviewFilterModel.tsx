import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { FilterJobSelectHelper } from "../ManageJobs/Form/FilterJobSelectHelper";
import { FilterJobSelect } from "../ManageJobs/Form/FilterJobSelect";
import { useFilterJobs } from "@/lib/react-query/queries/job/jobs";
import { useFilterUsers } from "@/lib/react-query/queries/user/users";

const ReviewFilterModel = ({
  isOpen,
  setIsOpen,
  t,
  filter,
  setFilter,
  applyFilter,
}) => {
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobSearch, setJobSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const filterJobs = useFilterJobs();
  const filterUsers = useFilterUsers();

  // Load initial data
  useEffect(() => {
    if (!isOpen) return;

    filterJobs.mutate(
      { page: 1, page_size: 10 },
      { onSuccess: (d) => setJobs(d?.data?.items || []) }
    );

    filterUsers.mutate(
      { page: 1, page_size: 10 },
      { onSuccess: (d) => setUsers(d?.data?.items || []) }
    );
  }, [isOpen]);

  // Job search
  useEffect(() => {
    if (!isOpen) return;

    const delay = setTimeout(() => {
      filterJobs.mutate(
        { q: jobSearch, page: 1, page_size: 10 },
        { onSuccess: (d) => setJobs(d?.data?.items || []) }
      );
    }, 400);

    return () => clearTimeout(delay);
  }, [jobSearch]);

  // User search
  useEffect(() => {
    if (!isOpen) return;

    const delay = setTimeout(() => {
      filterUsers.mutate(
        { q: userSearch, page: 1, page_size: 10 },
        { onSuccess: (d) => setUsers(d?.data?.items || []) }
      );
    }, 400);

    return () => clearTimeout(delay);
  }, [userSearch]);

  const VISIBILITY = [
    { value: "", label: t("filter.form.visibility.options.all") },
    { value: "true", label: t("filter.form.visibility.options.visible") },
    { value: "false", label: t("filter.form.visibility.options.hidden") },
  ];

  const SORT_BY = [
    { value: "created_at", label: t("filter.form.sortBy.options.created_at") },
    { value: "rating", label: t("filter.form.sortBy.options.rating") },
  ];

  const SORT_ORDER = [
    { value: "ASC", label: t("filter.form.sort.options.asc") },
    { value: "DESC", label: t("filter.form.sort.options.desc") },
  ];

  const PAGE = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75"
          onClick={() => setIsOpen(false)}
        />

        <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 relative">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              {t("filter.title")}
            </h2>
            <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
          </div>

          <p className="text-sm text-gray-400 mb-5">
            {t("filter.description")}
          </p>

          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <FilterJobSelectHelper
              label={t("filter.form.jobs.label")}
              value={filter.job_id}
              enableSearch
              onSearchChange={setJobSearch}
              onChange={(v) =>
                setFilter({ ...filter, job_id: v })
              }
              options={jobs.map((j) => ({
                id: j.id,
                display_name: j.title,
              }))}
              placeholder={t("filter.form.jobs.placeholder")}
            />

            <FilterJobSelectHelper
              label={t("filter.form.reviewer.label")}
              value={filter.reviewer_id}
              enableSearch
              onSearchChange={setUserSearch}
              onChange={(v) =>
                setFilter({ ...filter, reviewer_id: v })
              }
              options={users.map((u) => ({
                id: u.id,
                display_name:
                  u.display_name || `${u.first_name} ${u.last_name}`,
              }))}
              placeholder={t("filter.form.reviewer.placeholder")}
            />
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <FilterJobSelectHelper
              label={t("filter.form.reviewee.label")}
              value={filter.reviewee_id}
              enableSearch
              onSearchChange={setUserSearch}
              onChange={(v) =>
                setFilter({ ...filter, reviewee_id: v })
              }
              options={users.map((u) => ({
                id: u.id,
                display_name:
                  u.display_name || `${u.first_name} ${u.last_name}`,
              }))}
              placeholder={t("filter.form.reviewee.placeholder")}
            />

            <FilterJobSelect
              label={t("filter.form.visibility.label")}
              value={
                filter.visibility === undefined
                  ? ""
                  : String(filter.visibility)
              }
              onChange={(v) =>
                setFilter({
                  ...filter,
                  visibility:
                    v === "" ? undefined : v === "true",
                })
              }
              options={VISIBILITY}
              placeholder={t("filter.form.visibility.placeholder")}
            />
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            <FilterJobSelect
              label={t("filter.form.sortBy.label")}
              value={filter.sort_by}
              onChange={(v) =>
                setFilter({ ...filter, sort_by: v })
              }
              options={SORT_BY}
            />

            <FilterJobSelect
              label={t("filter.form.sort.label")}
              value={filter.sort_order}
              onChange={(v) =>
                setFilter({ ...filter, sort_order: v })
              }
              options={SORT_ORDER}
            />

            <FilterJobSelect
              label={t("filter.form.pageSize.label")}
              value={String(filter.pageSize)}
              onChange={(v) =>
                setFilter({ ...filter, pageSize: Number(v) })
              }
              options={PAGE}
            />
          </div>

          <div className="text-end space-x-2">
            <button
              className="border border-red-600 text-red-600 px-4 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              {t("filter.form.button.cancel")}
            </button>

            <button
              className="bg-slate-800 text-white px-4 py-2 rounded"
              onClick={() => {
                applyFilter();
                setIsOpen(false);
              }}
            >
              {t("filter.form.button.filter")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewFilterModel;
