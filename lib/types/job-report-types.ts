import { Job } from "./job-type";
import { User } from "./user-type";

export type FilterJobReportResponse = { success: boolean; message: string, data: FilteredJobReports };

export type FilteredJobReports = {
    jobReports: JobReport[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export interface JobReport {
    id: number
    job_id: string
    user_id: string
    reason?: string
    description?: string
    status?: 'pending' | 'reviewed' | 'rejected' | 'resolved'
    admin_id?: string
    created_at?: Date
    updated_at?: Date
    job?: Job;
    user?: User;
}

export type FilterJobReportData = {
    job_ids?: string;
    user_ids?: string;
    status?: string;
    sort?: string;
    page?: number;
    page_size?: number;
};

export type JobReportFilterCollectionResponse = { success: boolean; message: string, data: JobReportFilterCollection };

export type JobReportFilterCollectionData = {};

export type JobReportFilterCollection = {
    jobs: Job[];
    helpers: User[];
}
