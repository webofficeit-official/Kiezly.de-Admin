
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DraggableScroll from "@/components/ui/DragableScrollbar/DragableScrollBar";

dayjs.extend(relativeTime);

interface Review {
  id: number;
  job_id: string;
  rating: number;
  comment: string;
  visibility: boolean;
  created_at: string;
  updated_at: string;
  job_title: string;
  reviewer_name: string;
  reviewee_name: string;
}

interface Props {
  jobReviews: Review[];
  t: any;
  page: number;
  pageSize: number;
}

const ReviewTable = ({ jobReviews, t, page, pageSize }: Props) => {
  return (
    <DraggableScroll className="p-0" horizontalOnly={true}>
      <table className="w-full mt-4 text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
              {t("list.table.sl")}
            </th>

            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
              {t("list.table.job-title")}
            </th>

            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
              {t("list.table.reviewer")}
            </th>

            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
              {t("list.table.reviewee")}
            </th>

            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
               {t("list.table.rating")}
            </th>

            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
              {t("list.table.comment")}
            </th>

            <th className="p-4 border-y bg-slate-50 text-sm text-slate-500">
              {t("list.table.visibility")}
            </th>

          </tr>
        </thead>

        <tbody>
          {jobReviews.length > 0 ? (
            jobReviews.map((j, i) => (
              <tr key={j.id} className="hover:bg-slate-50">
                {/* SL */}
                <td className="p-4 border-b text-center">
                  {i + (page - 1) * pageSize + 1}
                </td>

                {/* Job Title */}
                <td className="p-4 border-b font-semibold text-slate-700">
                  {j.job_title}
                </td>

                {/* Reviewer */}
                <td className="p-4 border-b text-slate-700">
                  {j.reviewer_name}
                </td>

                {/* Reviewee */}
                <td className="p-4 border-b text-slate-700">
                  {j.reviewee_name}
                </td>

                {/* Rating */}
                <td className="p-4 border-b">
                  <div className="flex items-center gap-1 text-yellow-500">
                    {"★".repeat(j.rating)}
                    {"☆".repeat(5 - j.rating)}
                  </div>
                </td>

                {/* Comment */}
                <td className="p-4 border-b text-slate-600 max-w-xs truncate">
                  {j.comment}
                </td>

                {/* Visibility */}
                <td className="p-4 border-b">
                  <span
                    className={
                      j.visibility
                        ? "px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
                        : "px-3 py-1 rounded-xl bg-gray-100 text-gray-600 ring-1 ring-gray-300"
                    }
                  >
                    {j.visibility ? "Visible" : "Hidden"}
                  </span>
                </td>

               
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={8}
                className="text-center p-6 font-semibold text-lg text-gray-700"
              >
                {t("list.empty")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </DraggableScroll>
  );
};

export default ReviewTable;
