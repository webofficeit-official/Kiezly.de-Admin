import { Country } from "./country-type";
import { JobCategories } from "./job-categories";
import { Languages } from "./languages";
import { SocialLinks } from "./social-links";

export type Job = {
    id: string;
    email: string;
    role?: string;
    is_active?: boolean;
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    postal_code?: string;
    street?: string;
    lat?: string;
    lng?: string;
    has_first_aid?: boolean;
    education_level?: boolean;
    police_verified?: boolean;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
    org_name?: string;
    rate?: string;
    website?: string;
    display_name?: string;
    gender?: string;
    district?: string;
    fixed_price?: boolean;
    min_hours?: string;
    work_permit?: boolean;
    issue_invoice?: boolean;
    experience?: string;
    certificates?: boolean;
    radius?: string;
    weekdays?: [];
    time_windows?: [];
    countrydetails?: Country;
    skills?: JobCategories[];
    languages?: Languages[];
    social_links?: SocialLinks[];
    first_aid_summary?: boolean;
    police_certificate_summary?: boolean;
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