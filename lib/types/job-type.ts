import { Country } from "./country-type";
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
    published_at?: string;
    expires_at?: string;
    category_name?: string;
    countries?: Country;
    client?: User;
    tags?: JobTags;
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
    q?: string;
    location?: string;
    has_first_aid?: string | boolean;
    police_verified?: string | boolean;
    role?: string;
    sort?: string;
    page?: number;
    page_size?: number;
};

export type JobProfileData = {
    id: string
};

export type jobProfileResponse = { success: boolean; message: string, data: Job };