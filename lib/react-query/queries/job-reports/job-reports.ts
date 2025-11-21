import apiClient from "@/lib/config/axios-client";
import { FilterJobReportData, FilterJobReportResponse, JobReportFilterCollectionData, JobReportFilterCollectionResponse, UpdateJobReportData, UpdateJobReportResponse } from "@/lib/types/job-report-types";
import { useMutation, UseMutationResult } from "@tanstack/react-query";


// Filter Job Reports
export const useFilterJobReports = (): UseMutationResult<
    FilterJobReportResponse,
    Error,
    FilterJobReportData
> => {
    return useMutation({
        mutationFn: async ({ user_ids, page, page_size, sort, status, job_ids }) => {
            const res = await apiClient.get(
                `/manage-jobs/reports`,
                { params: { user_ids, page, page_size, sort, status, job_ids } },  // body
            );
            return res.data as FilterJobReportResponse;
        },
    });
};

// Job report filter collection 
export const useJobReportFilterCollection = (): UseMutationResult<
    JobReportFilterCollectionResponse,
    Error,
    JobReportFilterCollectionData
> => {
    return useMutation({
        mutationFn: async ({ }) => {
            const res = await apiClient.get(
                `/filter/job-reports`,
            );
            return res.data as JobReportFilterCollectionResponse;
        },
    });
};

// Update job report status 
export const useJobReportStatusUpdate = (): UseMutationResult<
    UpdateJobReportResponse,
    Error,
    UpdateJobReportData
> => {
    return useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await apiClient.patch(
                `/manage-jobs/reports/${id}`,
                { status },
            );
            return res.data as UpdateJobReportResponse;
        },
    });
};