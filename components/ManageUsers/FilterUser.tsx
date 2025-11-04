"use client"

import { useEffect, useState } from "react";
import InviteAdmins from "./InviteUsers";
import { useT } from "@/app/[locale]/layout";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserPagination from "./UserPagination";
import { useFilterUsers } from "@/lib/react-query/queries/user/users";

const FilterUser = () => {
    const t = useT("users");

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [verified, setVerified] = useState(null);
    const [active, setActive] = useState(null);
    const [deleted, setDeleted] = useState(false);

    const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

    const filterUsers = useFilterUsers();

    useEffect(() => {
        filterUsers.mutate({
            page: page,
            page_size: pageSize,
            verified,
            active,
            deleted
        }, {
            onSuccess: (data) => {
                setUsers(data?.data?.items)
                setPage(data?.data?.page)
                setPageSize(data?.data?.page_size)
                setTotalItems(data?.data?.total_items)
                setTotalPages(data?.data?.total_pages)
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }, [page, pageSize, verified, active, deleted, inviteAdminModelOpen])

    return (
        <>
            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">

                {/* User header */}
                <UserHeader
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

                {/* User Table */}
                <UserTable users={users} t={t} setUsers={setUsers} />

                {/* Pagination */}
                <UserPagination page={page} totalPages={totalPages} t={t} setPage={setPage} />
            </div>

            <InviteAdmins isOpen={inviteAdminModelOpen} setIsOpen={setInviteAdminModelOpen} t={t} />
        </>
    )
}

export default FilterUser