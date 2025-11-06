"use client";

import { Search } from "lucide-react";

const PAGE_SIZE_OPTIONS = [5,10, 20, 50, 100];

const CategoriesControls = ({
  q,
  pageSize,
  onQueryChange,
  onPageSizeChange,
  t,
}) => {
  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-sm">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            {t("list.search_label")}
          </label>
          <div className="relative">
            <input
              value={q}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t("list.search_placeholder")}
              aria-label={t("list.search_aria")}
              className="w-full h-10 rounded border border-slate-300 bg-white px-9 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400"
              type="text"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            {q ? (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700"
                aria-label={t("list.clearSearch") }
              >
                {t("common.clear")}
              </button>
            ) : null}
          </div>
        </div>

        {/* Page size */}
        <div className="w-full sm:w-44">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            {t("list.per_page")}
          </label>
          <select
            className="h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label={t("list.per_page")}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoriesControls;
