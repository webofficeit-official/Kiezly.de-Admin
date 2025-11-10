"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Placeholder for your Button component
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useT } from "@/app/[locale]/layout";
import { Job } from "@/lib/types/job-type";
import { useJobApplicants } from "@/lib/react-query/queries/job/jobs";
import UserModel from "@/components/ManageUsers/UserModel";
import UserPagination from "@/components/ManageUsers/UserPagination";

interface ApplicantsPanelProps {
    job: Job;
    t: any;
}

const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
        case 'accepted':
            return 'bg-gray-800 text-white border border-gray-900'; // Darkest for success
        case 'shortlisted':
            return 'bg-gray-300 text-gray-800 border border-gray-400'; // Medium for in-progress
        case 'rejected':
            return 'bg-red-300 text-grey-700 border border-red-400'; // Border for negative
        case 'withdrawn':
            return 'bg-gray-50 text-gray-500 border border-gray-100'; // Lightest for inactive
        case 'applied':
        default:
            return 'bg-gray-100 text-gray-600 border border-gray-200'; // Default
    }
}


export default function ApplicantList({ job, t }: ApplicantsPanelProps) {
    if (!job) return null;
    const jobApplicants = useJobApplicants();
    const [applicants, setApplicants] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUserId(null);
    };
    const openUserModal = (userId: string) => {
        console.log(userId);

        setSelectedUserId(userId);
        setIsUserModalOpen(true);
    };

    useEffect(() => {
        jobApplicants.mutate({
            id: job.id,
            page,
            page_size: 12
        }, {
            onSuccess: (d) => {
                console.log(d);
                setApplicants(d.data.applicants)
                setTotalItems(d.data.total_items)
                setTotalPages(d.data.total_pages)
                setPage(d.data.page)
            },
            onError: (e) => {
                console.log(e);
            }
        })
    }, [job, page])

    return (
        <>
            <aside className="lg:sticky lg:top-6">
                <Card className="shadow-lg border-gray-100 bg-white">
                    <CardHeader className="border-b border-gray-100 p-4 sm:p-5">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            {t("applicants.title")} ({totalItems})
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6 p-4 sm:p-5">

                        {/* Job Cards Grid */}
                        {/* Increased gap and ensured equal size on different screens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Map over your actual similarJobs array here */}
                            {applicants && applicants?.map((app) => (
                                <div
                                    key={app.id}
                                    className="flex flex-col rounded-xl cursor-pointer border border-gray-200 p-4 transition-all duration-200 
                                       hover:border-gray-400 hover:shadow-md bg-white min-h-[160px]"
                                >
                                    <div className="flex items-start justify-between" onClick={() => openUserModal(app.user.id)}>
                                        {/* Header: Category & Title */}
                                        <div className="flex flex-col mb-2 flex-1">
                                            {/* Job Title */}
                                            <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                {app.user.first_name} {app.user.last_name}
                                            </h4>
                                            {/* Category/Pill */}
                                            <span className="text-xs text-gray-600 tracking-wider mb-1">
                                                {app.user.email}
                                            </span>
                                        </div>
                                        {/* Current Status Badge */}
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(app.status)}`}
                                        >
                                            {app.status}
                                        </span>
                                    </div>

                                    {/* Description/Snippet (Moved below title for better hierarchy) */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-800">
                                            {t("applicants.rate")} <span className="font-bold text-gray-900">{app.proposed_rate} €</span>
                                        </div>
                                    </div>
                                    {app.cover_note && (
                                        <div className="rounded-lg text-gray-700">
                                            <span className="font-semibold text-gray-800 block mb-1">{t("applicants.cover-note")}</span>
                                            <div
                                                className="text-sm line-clamp-3"
                                                dangerouslySetInnerHTML={{ __html: app.cover_note || "" }}
                                            />
                                        </div>
                                    )}

                                    {/* Footer: Rate (Highlighted) */}
                                    <div className="flex justify-between items-center pt-1">
                                        <div className="text-xs text-gray-500">
                                            {t("applicants.applied")} {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <UserPagination page={page} totalPages={totalPages} t={t} setPage={setPage} />
                </Card>
            </aside>

            {isUserModalOpen && (
                <UserModel
                    isOpen={isUserModalOpen}
                    onClose={closeUserModal}
                    userId={selectedUserId}
                />
            )}
        </>
    );
}
