import { Localization } from "@/lib/types/localization-type";
import { useT } from "@/app/[locale]/layout";
import DraggableScroll from "../ui/DragableScrollbar/DragableScrollBar";

type Props = {
  dataList: Localization[];
  page: number;
  pageSize: number;
  loading?: boolean;
  onEdit?: (cat: Localization) => void;
};

const LocalizationTable = ({
  dataList = [],
  page,
  pageSize,
  loading = false,
  onEdit,
}: Props) => {
  const isEmpty = !loading && dataList.length === 0;
  const t = useT("localization");

  return (
    <DraggableScroll className="p-0" horizontalOnly={true}>
      <table className="w-full mt-4 text-left table-auto min-w-[560px] md:min-w-0 border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10">
          <tr className="whitespace-nowrap">
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 w-16 text-left">
              {t("list.table.sl")}
            </th>
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 w-16 text-left">
              {t("list.table.code")}
            </th>
            <th className="border-y border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 w-16 text-left">
              {t("list.table.name")}
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
                {dataList.map((l) => {
                  return (
                    <td key={l.id} className="border-b border-slate-200 px-4 py-3">
                      <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
                    </td>
                  );
                })}

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
            dataList.map((u: Localization, i) => (
              <tr
                key={`${u.id}-${i}`}
                className="cursor-pointer whitespace-nowrap transition"
              >
                <td className="border-b border-slate-200 px-4 py-4 text-left">
                  {i + (page - 1) * pageSize + 1}
                </td>

                <td className="border-b border-slate-200 px-4 py-4 text-left">
                  {u?.code}
                </td>
                <td className="border-b border-slate-200 px-4 py-4 text-left">
                  {u?.name}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </DraggableScroll>
  );
};

export default LocalizationTable;
