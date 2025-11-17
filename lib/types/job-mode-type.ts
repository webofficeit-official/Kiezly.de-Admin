export type JobMode = {
    id: Number;
    name?: string;
}

export type JobModeData = {
    id?: Number;
    name?: Record<string, string>;
}

export type FilteredJobMode = {
    items: JobMode[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilteredJobModeResponse = { success: boolean; message: string, data: FilteredJobMode };
export type JobModeResponse = { success: boolean; message: string, data: JobMode };

export type FilterJobModeData = {
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};