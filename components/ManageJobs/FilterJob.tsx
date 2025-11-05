"use client"

import { useEffect, useState } from "react";
import { useT } from "@/app/[locale]/layout";
import JobHeader from "./JobHeader";
import JobTable from "./JobTable";
import JobPagination from "./JobPagination";
import { useFilterJobs } from "@/lib/react-query/queries/job/jobs";
import FilterModel from "./FilterModel";

export type FilterOption = {
    name?: string
    location?: string
    firstAid?: boolean
    policeVerified?: boolean
    role?: "client" | "helper"
    sort?: "new" | "oldest" | "name_asc" | "name_desc"
} 

const FilterJob = () => {
    const t = useT("jobs");

    const [jobs, setJobs] = useState([]);
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
    })

    const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

    const filterJobs = useFilterJobs();

    useEffect(() => {
        filterJobs.mutate({
            page: page,
            page_size: filter.pageSize,
            q: filter?.q,
            location: filter?.location,
            role: filter?.role,
            sort: filter?.sort,
            police_verified: filter?.policeVerified,
            has_first_aid: filter?.firstAid,
        }, {
            onSuccess: (data) => {
                setJobs(data?.data?.items)
                setPage(data?.data?.page)
                setFilter({
                    ...filter,
                    pageSize: data?.data?.page_size
                })
                setTotalItems(data?.data?.total_items)
                setTotalPages(data?.data?.total_pages)
            },
            onError: (error) => {
                console.log(error);
            }
        })
    }, [page, inviteAdminModelOpen])

    return (
        <>
            <div className="relative flex flex-col w-full h-full text-slate-700 bg-white shadow-md rounded-xl bg-clip-border mt-10  ">

                {/* Job header */}
                <JobHeader
                    totalItems={totalItems} 
                    setInviteAdminModelOpen={setInviteAdminModelOpen} 
                    inviteAdminModelOpen={inviteAdminModelOpen} 
                    t={t}
                />

                {/* Job Table */}
                <JobTable jobs={jobs} t={t} setJobs={setJobs} page={page} pageSize={filter.pageSize} />

                {/* Pagination */}
                <JobPagination page={page} totalPages={totalPages} t={t} setPage={setPage} />
            </div>

            <FilterModel 
                isOpen={inviteAdminModelOpen} 
                setIsOpen={setInviteAdminModelOpen} 
                t={t}
                filter={filter}
                setFilter={setFilter} 
            />
        </>
    )
}

export default FilterJob