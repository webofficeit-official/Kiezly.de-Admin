"use client";
import { Job } from "@/lib/types/job-type";
import React, { Suspense } from "react";

export default function JobDetail({ t, job }: { t: any, job: Job}) {
    
    return (
        <div className="p-4 mt-14">
            {job.title}
        </div>
    );
}
