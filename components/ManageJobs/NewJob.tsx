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

const NewJob = () => {
    const t = useT("jobs");

    const [jobs, setJobs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(null);
    const [totalPages, setTotalPages] = useState(null);
    const [filter, setFilter] = useState({
        q: "",
        location: "",
        categories: [],
        client: null,
        tags: [],
        minPrice: null,
        maxPrice: null,
        experience: [],
        type: [],
        posted: null,
        start: null,
        end: null,
        sort: null,
        page: 1,
        pageSize: 10,
    })

    const [inviteAdminModelOpen, setInviteAdminModelOpen] = useState(false);

    const filterJobs = useFilterJobs();

    useEffect(() => {
        filterJobs.mutate({
            q: filter.q,
            ends_at: filter.end,
            page: filter.page,
            page_size: filter.pageSize,
            posted: filter.posted, 
            job_experience: filter.experience.join(","),
            job_tags: filter.tags.join(","),
            job_type: filter.type.join(","),
            sort: filter.sort,
            starts_at: filter.start,
            status: "pending_review",
            category_id: filter.categories.join(","),
            city: filter.location,
            client_id: filter.client,
            max_price: filter.maxPrice,
            min_price: filter.minPrice
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
                    filter={false}
                />

                {/* Job Table */}
                <JobTable jobs={jobs} t={t} setJobs={setJobs} page={page} pageSize={filter.pageSize} />

                {/* Pagination */}
                <JobPagination page={page} totalPages={totalPages} t={t} setPage={setPage} />
            </div>
        </>
    )
}

export default NewJob