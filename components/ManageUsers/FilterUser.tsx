"use client";

import { useEffect, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserPagination from "./UserPagination";
import { useFilterUsers } from "@/lib/react-query/queries/user/users";
import FilterModel from "./FilterModel";
import HeaderSkeleton from "../ui/skeleton/HeaderSkeleton";
import TableSkeleton from "../ui/skeleton/TableSkeleton";
import Pagination from "../ui/pagination/pagination";
const MIN_LOADING_MS = 350;

export type FilterOption = {
  name?: string;
  location?: string;
  firstAid?: boolean;
  policeVerified?: boolean;
  role?: "client" | "helper";
  sort?: "new" | "oldest" | "name_asc" | "name_desc";
};

const FilterUser = () => {
  const t = useT("users");

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [filter, setFilter] = useState({
    q: "",
    location: "",
    firstAid: null,
    policeVerified: null,
    role: "",
    sort: "",
    pageSize: 10,
  });

  const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filterUsers = useFilterUsers();

  useEffect(() => {
    let mounted = true;
    const start = Date.now();

    setLoading(true);
    filterUsers.mutate(
      {
        page: page,
        page_size: filter.pageSize,
        q: filter?.q,
        location: filter?.location,
        role: filter?.role,
        sort: filter?.sort,
        police_verified: filter?.policeVerified,
        has_first_aid: filter?.firstAid,
      },
      {
        onSuccess: (data) => {
          if (!mounted) return;
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setUsers(data?.data?.items);
            setPage(data?.data?.page);
            setFilter({
              ...filter,
              pageSize: data?.data?.page_size,
            });
            setTotalItems(data?.data?.total_items);
            setTotalPages(data?.data?.total_pages);
            setLoading(false);
          }, remaining);
        },
        onError: (error) => {
          console.log(error);
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setLoading(false);
          }, remaining);
        },
      }
    );
    return () => {
      mounted = false;
    };
  }, [page, inviteAdminModelOpen]);

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        {/* User header */}
        {loading ? (
          <HeaderSkeleton />
        ) : (
          <UserHeader
            totalItems={totalItems}
            setInviteAdminModelOpen={setInviteAdminModelOpen}
            inviteAdminModelOpen={inviteAdminModelOpen}
            t={t}
          />
        )}

        {/* User Table */}
        {loading ? (
          <TableSkeleton rows={8} columns={9} />
        ) : (
          <UserTable
            users={users}
            t={t}
            setUsers={setUsers}
            page={page}
            pageSize={filter.pageSize}
          />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={setPage}
        />

        {/* Pagination */}
        {/* <UserPagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={setPage}
        /> */}
      </div>

      <FilterModel
        isOpen={inviteAdminModelOpen}
        setIsOpen={setInviteAdminModelOpen}
        t={t}
        filter={filter}
        setFilter={setFilter}
      />
    </>
  );
};

export default FilterUser;
