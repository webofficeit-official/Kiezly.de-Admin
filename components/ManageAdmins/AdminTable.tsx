import { Admins } from "@/lib/types/admin-type";
import { Check, Trash2, X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const AdminTable = ({ admins, t }) => {
    return (
        <div className="p-0 overflow-scroll">
            <table className="w-full mt-4 text-left table-auto min-w-max">
                <thead>
                    <tr>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                                {t("list.table.full-name")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.email")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.phone")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.super")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.verified")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.active")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.deleted")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.since")} 
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        admins?.map((a: Admins) => (
                            <tr key={a.id}>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="flex items-center gap-3">
                                        {
                                            a.avatar_url ?
                                                <img src={a.avatar_url}
                                                    alt={a.first_name} className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                                : <span className="text-sm font-semibold text-gray-700 bg-gray-200 p-2 border rounded-3xl border-gray-100">
                                                    {(`${a?.first_name ?? ""}` || "U")[0].toUpperCase()}
                                                    {(`${a?.last_name ?? ""}` || "U")[0].toUpperCase()}
                                                </span>
                                        }

                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {a.first_name} {a.last_name}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">

                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            {a.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="flex flex-col">
                                        <p
                                            className="text-sm text-slate-500">
                                            {a.phone || '-'}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 w-0">
                                    <div className="w-max flex gap-2">
                                        {a.super ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 w-0">
                                    <div className="w-max flex gap-2">
                                        {a.verified ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 w-0">
                                    <div className="w-max flex gap-2">
                                        {a.active ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="w-max flex gap-2">
                                        {a.deleted ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        {dayjs(a?.created_at).format("MMM D, YYYY")}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <button
                                        className="relative p-2 max-h-[40px] max-w-[40px] items-center select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-slate-900 transition-all hover:bg-slate-900/10 active:bg-slate-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        type="button">
                                        <Trash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable;