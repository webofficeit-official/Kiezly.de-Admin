"use client"

import { useFilterAdmins } from "@/lib/react-query/queries/admins/admins"
import { Admins } from "@/lib/types/admin-type";
import dayjs from "dayjs";
import { Check, Trash2, UserPlus, X } from "lucide-react"
import { useEffect, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const FilterAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(null);
    const [totalPages, setTotalPages] = useState(null);

    const filterAdmins = useFilterAdmins();

    useEffect(() => {
        filterAdmins.mutate({
            page: 1,
            page_size: 10
        }, {
            onSuccess: (data) => {
                setAdmins(data?.data?.admins?.items)
                setPage(data?.data?.admins?.page)
                setPageSize(data?.data?.admins?.page_size)
                setTotalItems(data?.data?.admins?.total_items)
                setTotalPages(data?.data?.admins?.total_pages)
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }, [])

    return (
        <>
            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
                <div className="relative mx-4 mt-4 overflow-hidden text-slate-700 bg-white rounded-none bg-clip-border">
                    <div className="flex items-center justify-between ">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Admin List</h3>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
                            <button
                                className="flex select-none items-center gap-2 rounded bg-slate-800 py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                <UserPlus className="w-4 h-4" />
                                Invite Admin
                            </button>
                        </div>
                    </div>

                </div>
                <div className="p-0 overflow-scroll">
                    <table className="w-full mt-4 text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500 pl-11">
                                        Full Name
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                        Email
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm font-normal leading-none text-slate-500">
                                        Phone
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                        Super
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                        Verified
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100 w-0">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                        Active
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                        Deleted
                                    </p>
                                </th>
                                <th
                                    className="p-4 transition-colors cursor-pointer border-y border-slate-200 bg-slate-50 hover:bg-slate-100">
                                    <p
                                        className="flex items-center justify-between gap-2 font-sans text-sm  font-normal leading-none text-slate-500">
                                        Since
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
                <div className="flex items-center justify-between p-3">
                    <p className="block text-sm text-slate-500">
                        Page 1 of 10
                    </p>
                    <div className="flex gap-1">
                        <button
                            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            Previous
                        </button>
                        <button
                            className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div data-dialog-backdrop="dialog" data-dialog-backdrop-close="true" className="absolute hidden left-0 top-0 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                <div data-dialog="dialog"
                    className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-slate-700 shadow-md">
                    <div className="flex flex-col p-6">
                        <h4
                            className="text-2xl mb-1 font-semibold text-slate-700">
                            Edit Member Details
                        </h4>
                        <p className="mb-3 mt-1 text-slate-400">
                            Enter or reset each information for the member access.
                        </p>

                        <div className="w-full max-w-sm min-w-[200px] mt-4">
                            <label className="block mb-1 text-sm text-slate-700">
                                Member Name
                            </label>
                            <input
                                type="text"
                                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Enter your text" />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px] mt-4">
                            <label className="block mb-1 text-sm text-slate-700">
                                Member Email
                            </label>
                            <input
                                type="text"
                                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Enter the email" />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px] mt-4">
                            <label className="block mb-1 text-sm text-slate-700">
                                Job
                            </label>
                            <input
                                type="text"
                                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Enter the job" />
                        </div>
                        <div className="w-full max-w-sm min-w-[200px] mt-4">
                            <label className="block mb-1 text-sm text-slate-700">
                                Active Status
                            </label>
                            <input
                                type="text"
                                className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                                placeholder="Offline/Online" />
                        </div>

                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex space-x-2">
                            <button
                                className="w-full mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                                data-dialog-close="true">
                                Cancel
                            </button>

                            <button
                                className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                                data-dialog-close="true">
                                Save
                            </button>
                        </div>
                        <p className="flex justify-center mt-4 font-sans text-sm text-slate-500">
                            Looking for more details? Contact
                            <a href="#admin"
                                className="ml-1 text-sm font-bold leading-normal text-slate-500">
                                Admin.
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default FilterAdmins