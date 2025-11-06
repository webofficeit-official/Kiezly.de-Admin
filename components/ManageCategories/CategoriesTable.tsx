import { JobCategories } from "@/lib/types/job-categories";
import { Edit } from "lucide-react";
import Tooltip from "../ui/ToolTip/ToolTip";

type Props = {
  categories: JobCategories[];
  t: (k: string, vars?: any) => string;
  page: number;
  pageSize: number;
  loading?: boolean;
};

const CategoriesTable = ({
  categories = [],
  t,
  page,
  pageSize,
  loading = false,
}: Props) => {
  const isEmpty = !loading && categories.length === 0;

  return (
    <div className="p-0 overflow-x-auto md:overflow-x-visible">
      <table className="w-full mt-4 text-left table-auto min-w-[560px] md:min-w-0 border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr className="whitespace-nowrap">
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 w-16 text-left">
              {t("list.table.sl")}
            </th>
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500">
              {t("list.table.name")}
            </th>
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500">
              {t("list.table.slug")}
            </th>
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-center w-32">
              {t("list.table.actions")}
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Loading Skeleton */}
          {loading &&
            Array.from({ length: Math.min(pageSize, 5) }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="whitespace-nowrap">
                <td className="border-b border-slate-200 px-4 py-3 text-center">
                  <div className="mx-auto h-3 w-8 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-b border-slate-200 px-4 py-3">
                  <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-b border-slate-200 px-4 py-3">
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-b border-slate-200 px-4 py-3 text-center">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                </td>
              </tr>
            ))}

          {/* Empty State */}
          {!loading && isEmpty && (
            <tr>
              <td
                colSpan={4}
                className="py-10 text-center text-sm text-slate-500"
              >
                {t("list.empty")}
              </td>
            </tr>
          )}

          {/* Data Rows */}
          {!loading &&
            !isEmpty &&
            categories.map((u: JobCategories, i) => (
              <tr
                key={`${u.id}-${i}`}
                className="cursor-pointer whitespace-nowrap  transition"
              >
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  {i + (page - 1) * pageSize + 1}
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.name}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.slug}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  {/* actions slot (edit/delete buttons etc.) */}
                  <div className="flex justify-center">
                    <Tooltip content="Edit category">
                      <button
                        onClick={() => console.log("Edit:", u.id)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-100 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
