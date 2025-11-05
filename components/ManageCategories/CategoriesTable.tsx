import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { JobCategories } from "@/lib/types/job-categories";
dayjs.extend(relativeTime);

const CategoriesTable = ({ categories, t, page, pageSize }) => {
  const isEmpty = !categories || categories.length === 0;

  return (
    <div className="p-0 overflow-scroll">
      <table className="w-full mt-4 text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="text-left transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                {t("list.table.sl")}
              </p>
            </th>
            <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                {t("list.table.name")}
              </p>
            </th>
            <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                {t("list.table.slug")}
              </p>
            </th>

            <th className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
              <p className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                {t("list.table.actions")}
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          {isEmpty ? (
            <tr>
              <td
                colSpan={4}
                className="py-10 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                {t("list.empty")}
              </td>
            </tr>
          ) : (
            categories?.map((u: JobCategories, i) => (
              <tr key={`${u.id}-${i}`} className="cursor-pointer">
                <td className="border-b border-slate-200 text-center">
                  <div className="flex flex-col">
                    {i + (page - 1) * pageSize + 1}
                  </div>
                </td>

                <td className="p-4 border-b border-slate-200">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-700">
                      {u.name}
                    </p>
                  </div>
                </td>
                <td className="p-4 border-b border-slate-200">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-slate-700">
                      {u.slug}
                    </p>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
