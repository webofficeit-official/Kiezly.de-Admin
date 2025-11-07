import { Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import Tooltip from "../ui/ToolTip/ToolTip";
import { useMemo } from "react";
import { Zipcode } from "@/lib/types/postal-codes-type";

type Sort = "id_desc" | "name_asc" | "name_desc";

type Props = {
  dataList: Zipcode[];
  t: (k: string, vars?: any) => string;
  page: number;
  pageSize: number;
  loading?: boolean;
  onEdit?: (cat: Zipcode) => void;

  sort?: Sort;
  onSortChange?: (value: Sort) => void;
};

const PostalCodeTable = ({
  dataList = [],
  t,
  page,
  pageSize,
  loading = false,
  onEdit,
  sort = "id_desc",
  onSortChange,
}: Props) => {
  const isEmpty = !loading && dataList.length === 0;

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
      <table className="w-full mt-4 text-left table-auto min-w-[900px] md:min-w-0 border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr className="whitespace-nowrap">
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 w-16 text-center">
              {t("list.table.sl")}
            </th>

            <th
              className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 cursor-pointer select-none text-left"
              // onClick={toggleSort}
            >
              <div className="flex items-center justify-between w-full">
                <span>{t("list.table.zipcode")}</span>
                {/* {nameSortIcon} */}
              </div>
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-32">
              {t("list.table.country")}
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-40">
              {t("list.table.street")}
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-32">
              {t("list.table.city")}
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-32">
              {t("list.table.state")}
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-32">
              {t("list.table.latitude")}
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-left w-32">
              {t("list.table.longitude")}
            </th>

            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 text-center w-20">
              {t("list.table.actions")}
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Loading Skeleton */}
          {loading &&
            Array.from({ length: Math.min(pageSize, 5) }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="whitespace-nowrap">
                {Array.from({ length: 9 }).map((__, colIdx) => (
                  <td
                    key={`skeleton-cell-${colIdx}`}
                    className="border-b border-slate-200 px-4 py-3 text-center"
                  >
                    <div className="mx-auto h-3 w-16 animate-pulse rounded bg-slate-200" />
                  </td>
                ))}
              </tr>
            ))}

          {/* Empty State */}
          {!loading && isEmpty && (
            <tr>
              <td
                colSpan={9}
                className="py-10 text-center text-sm text-slate-500"
              >
                {t("list.empty")}
              </td>
            </tr>
          )}

          {/* Data Rows */}
          {!loading &&
            !isEmpty &&
            dataList.map((u: Zipcode, i) => (
              <tr
                key={`${u.id}-${i}`}
                className="cursor-pointer whitespace-nowrap transition"
              >
                <td className="border-b border-slate-200 px-4 py-4 text-center">
                  {i + (page - 1) * pageSize + 1}
                </td>
             
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.zipcode}
                  </p>
                </td>
                   <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.country_name}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.street}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.city}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.state}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.latitude}
                  </p>
                </td>
                <td className="border-b border-slate-200 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-700">
                    {u.longitude}
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

export default PostalCodeTable;
