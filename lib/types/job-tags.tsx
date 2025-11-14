export type JobTags = {
    id: Number;
    name?: string;
    slug?: String;
}

export type JobTagsData = {
    id?: number;
    name?: Record<string, string>;
    slug?: String;
}

export type FilteredJobTags = {
    items: JobTags[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilteredJobTAgsResponse = { success: boolean; message: string, data: FilteredJobTags };
export type JobTagsResponse = { success: boolean; message: string, data: JobTags };

export type FilterJobTagsData = {
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};