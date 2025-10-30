"use client"

import { useFilterAdmins } from "@/lib/react-query/queries/admins/admins"
import { useEffect, useState } from "react";
import InviteAdmins from "./InviteAdmins";
import AdminHeader from "./AdminHeader";
import AdminPagination from "./AdminPagination";
import AdminTable from "./AdminTable";
import { useT } from "@/app/[locale]/layout";

const FilterAdmins = () => {
    const t = useT("admins");

    const [admins, setAdmins] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [verified, setVerified] = useState(null);
    const [active, setActive] = useState(null);
    const [deleted, setDeleted] = useState(null);

    const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

    const filterAdmins = useFilterAdmins();

    useEffect(() => {
        filterAdmins.mutate({
            page: page,
            page_size: pageSize,
            verified,
            active,
            deleted
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
    }, [page, pageSize, verified, active, deleted])

    return (
        <>
            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">

                {/* Admin header */}
                <AdminHeader 
                    totalItems={totalItems} 
                    setInviteAdminModelOpen={setInviteAdminModelOpen} 
                    inviteAdminModelOpen={inviteAdminModelOpen} 
                    t={t} 
                    verified={verified}
                    setVerified={setVerified}
                    active={active}
                    setActive={setActive}
                    deleted={deleted}
                    setDeleted={setDeleted}
                />

                {/* Admin Table */}
                <AdminTable admins={admins} t={t} />

                {/* Pagination */}
                <AdminPagination page={page} totalPages={totalPages} t={t} setPage={setPage} />
            </div>

            <InviteAdmins isOpen={inviteAdminModelOpen} setIsOpen={setInviteAdminModelOpen} t={t} />
        </>
    )
}

export default FilterAdmins