import { Country } from "./country-type";
import { JobCategories } from "./job-categories";
import { JobTags } from "./job-tags";
import { User } from "./user-type";

export type Job = {
    id: string;
    client_id: string;
    title?: string;
    description?: string;
    category_id?: number;
    price_type?: "range" | "fixed";
    price_value?: string;
    currency?: string;
    status?: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    street?: string;
    lat?: string;
    lng?: string;
    starts_at?: string;
    ends_at?: string;
    created_at?: string;
    updated_at?: string;
    geom?: string;
    subtitle?: string;
    price_min?: string;
    price_max?: string;
    job_type?: string[];
    job_experience?: string[];
    first_aid_verified?: boolean;
    police_verified?: boolean;
    verified?: boolean;
    slug?: string;
    tasks?: string;
    requirements?: string;
    work_mode?: string;
    rate_hourly?: string;
    budget_fixed?: boolean;
    rrule?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_link?: string;
    contact_method?: string;
    views_count?: number;
    saves_count?: number;
    reports_count?: number;
    applicants_count?: number;
    published_at?: string;
    expires_at?: string;
    category_name?: string;
    countries?: Country;
    client?: User;
    tags?: JobTags[];
}

export type FilteredJobs = {
    items: Job[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilterJobResponse = { success: boolean; message: string, data: FilteredJobs };

export type FilterJobData = {
    category_id?: string;
    city?: string;
    min_price?: string;
    max_price?: string;
    status?: string;
    sort?: string;
    page?: number;
    page_size?: number;
    job_tags?: string;
    job_experience?: string;
    job_type?: string;
    starts_at?: string;
    ends_at?: string;
    posted?: string;
    client_id?: string;
    q?: string;
};

export type JobFilterCollectionData = {};

export type JobFilterCollectionResponse = { success: boolean; message: string, data: FilterCollection };

export type FilterCollection = {
    jobCategories: JobCategories[];
    jobTags: JobTags[];
    clients: User[];
    jobExperience: Enum[];
    jobType: Enum[];
}

export type Enum = {
    label: string
}

export type JobDetailResponse = { success: boolean; message: string, job: Job };

export type JobDetailData = {
    id?: string
    slug?: string
};

export type JobAprovalResponse = { success: boolean; message: string, job: Job };

export type JobAprovalData = {
    id?: string
    status?: string
};

export type FilteredApplicants = {
    applicants: Application[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export interface Application {
  id: string;
  job_id: string;
  helper_id: string;
  cover_note: string;
  proposed_rate: string;
  status: string; // 'applied' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn'
  created_at: string;
  updated_at: string;
  user: User;
}

export type JobApplicantsResponse = { success: boolean; message: string, data: FilteredApplicants };

export type JobApplicantsData = {
    id?: string
    status?: string
    page?: number
    page_size?: number
    sort?: string
};