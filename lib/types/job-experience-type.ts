export type JobExperience = {
    id: Number;
    name?: string;
}

export type JobExperienceData = {
    id?: Number;
    name?: Record<string, string>;
}

export type FilteredJobExperience = {
    items: JobExperience[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilteredJobExperienceResponse = { success: boolean; message: string, data: FilteredJobExperience };
export type JobExperienceResponse = { success: boolean; message: string, data: JobExperience };

export type FilterJobExperienceData = {
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};