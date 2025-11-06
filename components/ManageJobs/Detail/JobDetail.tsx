"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Job } from "@/lib/types/job-type";
import React, { Suspense } from "react";
import JobHeader from "./JobHeader";
import JobDescription from "./JobDescription";
import { Separator } from "@/components/ui/separator";

export default function JobDetail({ t, job }: { t: any, job: Job }) {

    return (
        <div className="max-w-6xl p-4 mt-14">
            {/* Top section */}
            <section className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
                {/* Left: main content */}
                <div>
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <JobHeader key={job.id} job={job} t={t} />
                        </CardHeader>

                        <Separator />

                        <CardContent className="prose prose-sm max-w-none py-6">
                            <JobDescription key={job.id} job={job} t={t} />
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
