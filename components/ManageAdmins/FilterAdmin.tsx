"use client";

import { useFilterAdmins } from "@/lib/react-query/queries/admins/admins";
import { useEffect, useState } from "react";
import InviteAdmins from "./InviteAdmins";
import AdminHeader from "./AdminHeader";
import AdminPagination from "./AdminPagination";
import AdminTable from "./AdminTable";
import { useT } from "@/app/[locale]/layout";
import HeaderSkeleton from "../ui/skeleton/HeaderSkeleton";
import TableSkeleton from "../ui/skeleton/TableSkeleton";
const MIN_LOADING_MS = 350;

const FilterAdmins = () => {
  const t = useT("admins");

  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [verified, setVerified] = useState(null);
  const [active, setActive] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

  const filterAdmins = useFilterAdmins();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const start = Date.now();

    setLoading(true);
    filterAdmins.mutate(
      {
        page: page,
        page_size: pageSize,
        verified,
        active,
        deleted,
      },
      {
        onSuccess: (data) => {
          if (!mounted) return;
          const elapsed = Date.now() - start;
          const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
          setTimeout(() => {
            if (!mounted) return;
            setAdmins(data?.data?.admins?.items);
            setPage(data?.data?.admins?.page);
            setPageSize(data?.data?.admins?.page_size);
            setTotalItems(data?.data?.admins?.total_items);
            setTotalPages(data?.data?.admins?.total_pages);
            setLoading(false);
          }, remaining);
        },
        onError: (error) => {
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
  }, [page, pageSize, verified, active, deleted, inviteAdminModelOpen]);

  return (
    <>
      <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">
        {/* Admin header */}
        {loading ? (
          <HeaderSkeleton />
        ) : (
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
        )}
        {/* Admin Table */}
        {loading ? (
          <TableSkeleton rows={8} columns={9} />
        ) : (
          <AdminTable admins={admins} t={t} setAdmins={setAdmins} />
        )}

        {/* Pagination */}
        <AdminPagination
          page={page}
          totalPages={totalPages}
          t={t}
          setPage={setPage}
        />
      </div>

      <InviteAdmins
        isOpen={inviteAdminModelOpen}
        setIsOpen={setInviteAdminModelOpen}
        t={t}
      />
    </>
  );
};

export default FilterAdmins;
