
import { Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Tooltip from "../ui/ToolTip/ToolTip";
import { useMemo } from "react";
import { JobTags } from "@/lib/types/job-tags";
import { Localization } from "@/lib/types/localization-type";
import { useT } from "@/app/[locale]/layout";

type Sort = "id_desc" | "name_asc" | "name_desc";

type Props = {
  localization: Localization[];
  dataList: JobTags[];
  page: number;
  pageSize: number;
  loading?: boolean;
  onEdit?: (cat: JobTags) => void;

  sort?: Sort; // "id_desc" | "name_asc" | "name_desc"
  onSortChange?: (value: Sort) => void;
};

const JobTagTable = ({
  dataList = [],
  localization = [],
  page,
  pageSize,
  loading = false,
  onEdit,
  sort = "id_desc",
  onSortChange
}: Props) => {
  const isEmpty = !loading && dataList.length === 0;
  const t = useT("job-tags");

  const nameSortIcon = useMemo(() => {
    if (sort === "name_asc") return <ArrowUp className="w-4 h-4" />;
    if (sort === "name_desc") return <ArrowDown className="w-4 h-4" />;
    return <ArrowUpDown className="w-4 h-4 opacity-60" />;
  }, [sort]);


  const toggleSort = () => {
    if (!onSortChange) return;
    if (sort === "id_desc") onSortChange("name_asc");
    else if (sort === "name_asc") onSortChange("name_desc");
    else onSortChange("id_desc");
  };

  return (
    <div className="p-0 overflow-x-auto md:overflow-x-visible">
      <table className="w-full mt-4 text-left table-auto min-w-[560px] md:min-w-0 border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr className="whitespace-nowrap">
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 w-16 text-left">
              {t("list.table.sl")}
            </th>
            {
              localization.map(l => {
                return (
                  <th
                    key={l.id}
                    className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 cursor-pointer select-none"
                    onClick={toggleSort}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{t("list.table.name", { locale: t(l.code)})}</span>
                      {nameSortIcon}
                    </div>
                  </th>
                )
              })
            }

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
                {
                  localization.map(l => {
                    return (
                      <td className="border-b border-slate-200 px-4 py-3">
                        <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                      </td>
                    )
                  })
                }
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
            dataList.map((u: JobTags, i) => (
              <tr
                key={`${u.id}-${i}`}
                className="cursor-pointer whitespace-nowrap transition"
              >
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  {i + (page - 1) * pageSize + 1}
                </td>
                {
                  localization.map(l => {
                    return (
                      <td key={l.id} className="border-b border-slate-200 px-4 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {u.name[l.code]}
                        </p>
                      </td>
                    )
                  })
                }
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.slug}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  <div className="flex justify-center">
                    <Tooltip content={t("common.edit")}>
                      <button
                        onClick={() => onEdit?.(u)}
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

export default JobTagTable;
