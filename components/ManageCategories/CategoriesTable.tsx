import { JobCategories } from "@/lib/types/job-categories";

type Props = {
  categories: JobCategories[];
  t: (k: string, vars?: any) => string;
  page: number;
  pageSize: number;
  loading?: boolean;
};

const ROW_HEIGHT = "h-14";

const CategoriesTable = ({
  categories = [],
  t,
  page,
  pageSize,
  loading = false,
}: Props) => {
  const isEmpty = !loading && (!categories || categories.length === 0);
  const visible = categories ?? [];
  const missing = Math.max(pageSize - visible.length, 0);

  return (
    <div className="p-0 overflow-x-auto md:overflow-x-visible">
      <table className="w-full mt-4 text-left table-auto min-w-[560px] md:min-w-0 border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr className="whitespace-nowrap">
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-16">
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
          {/* Skeleton Loading */}
          {loading &&
            Array.from({ length: pageSize }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className={`${ROW_HEIGHT} whitespace-nowrap`}>
                <td className="border-b border-slate-200 px-4 text-center">
                  <div className="mx-auto h-3 w-8 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-b border-slate-200 px-4">
                  <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-b border-slate-200 px-4">
                  <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="border-b border-slate-200 px-4 text-center">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                </td>
              </tr>
            ))}

          {/* Empty State */}
          {!loading && isEmpty && (
            <tr className={ROW_HEIGHT}>
              <td colSpan={4} className="py-10 text-center text-sm text-slate-500">
                {t("list.empty")}
              </td>
            </tr>
          )}

          {/* Data Rows */}
          {!loading &&
            !isEmpty &&
            visible.map((u: JobCategories, i) => (
              <tr
                key={`${u.id}-${i}`}
                className={`cursor-pointer ${ROW_HEIGHT} whitespace-nowrap hover:bg-slate-50 transition`}
              >
                <td className="border-b border-slate-200 px-4 text-center">
                  {i + (page - 1) * pageSize + 1}
                </td>
                <td className="border-b border-slate-200 px-4">
                  <p className="text-sm font-semibold text-slate-700">{u.name}</p>
                </td>
                <td className="border-b border-slate-200 px-4">
                  <p className="text-sm text-slate-700">{u.slug}</p>
                </td>
                <td className="border-b border-slate-200 px-4 text-center">
                  {/* actions slot (e.g. edit/delete buttons) */}
                </td>
              </tr>
            ))}

          {/* Placeholder Rows (for stable height) */}
          {!loading &&
            !isEmpty &&
            missing > 0 &&
            Array.from({ length: missing }).map((_, idx) => (
              <tr key={`placeholder-${idx}`} className={`${ROW_HEIGHT}`}>
                <td className="border-b border-slate-200 px-4" />
                <td className="border-b border-slate-200 px-4" />
                <td className="border-b border-slate-200 px-4" />
                <td className="border-b border-slate-200 px-4" />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
