import { Check, Facebook, Globe, Instagram, Linkedin, X } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { User } from "@/lib/types/user-type";
import { useState } from "react";
import UserModel from "./UserModel";
import DraggableScroll from "../ui/DragableScrollbar/DragableScrollBar";
dayjs.extend(relativeTime);

const UserTable = ({ users, t, setUsers, page, pageSize }) => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUserId(null);
    };
    const openUserModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsUserModalOpen(true);
    };

    return (
       <DraggableScroll className="p-0" horizontalOnly={true}>
            <table className="w-full mt-4 text-left table-auto min-w-max">
                <thead>
                    <tr>
                        <th
                            className="text-left transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                                {t("list.table.sl")}
                            </p>
                        </th>
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
                                {t("list.table.role")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                {t("list.table.contact-details")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.location")}
                            </p>
                        </th>
                        <th
                            className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                            <p
                                className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                {t("list.table.skills")}
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
                        users?.map((u: User, i) => (
                            <tr key={u.id} onClick={() => openUserModal(u.id)} className="cursor-pointer">
                                <td className="border-b border-slate-200 text-center">
                                    <div className="flex flex-col">
                                        {i + ((page - 1) * pageSize) + 1}
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200" onClick={() => openUserModal(u.id)}>
                                    <div className="flex items-center gap-3">
                                        {
                                            u.avatar_url ?
                                                <img src={u.avatar_url}
                                                    alt={u.first_name} className="relative inline-block h-9 w-9 !rounded-full object-cover object-center" />
                                                : <span className="text-sm font-semibold text-gray-700 bg-gray-200 p-2 border rounded-3xl border-gray-100">
                                                    {(`${u?.first_name ?? ""}` || "U")[0].toUpperCase()}
                                                    {(`${u?.last_name ?? ""}` || "U")[0].toUpperCase()}
                                                </span>
                                        }

                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {u.first_name} {u.last_name}
                                            </p>
                                            <p
                                                className="text-sm text-slate-500">
                                                {u.role == "client" ? u.org_name : u.display_name}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            {u.role}
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            {u.gender}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            {u.email}
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            {u.phone}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 w-0">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold text-slate-700">
                                            {u.street} {u.postal_code}
                                        </p>
                                        <p
                                            className="text-sm text-slate-500">
                                            {u.state}, {u.countrydetails.name}
                                        </p>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200 w-0">
                                    <div className="w-max flex gap-2">
                                        <div
                                            className="text-sm text-slate-500">
                                            {u.skills.map((s, i) => (
                                                <div key={i}>
                                                    {s.name} <br />
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 border-b border-slate-200">
                                    <p className="text-sm text-slate-500">
                                        {dayjs(u?.created_at).format("MMM D, YYYY")}
                                    </p>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {isUserModalOpen && (
                <UserModel
                    isOpen={isUserModalOpen}
                    onClose={closeUserModal}
                    userId={selectedUserId}
                />
            )}
        </DraggableScroll>
    )
}

export default UserTable;