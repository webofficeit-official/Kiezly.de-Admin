export type JobCategories = {
    id: Number;
    name?: string;
    slug?: String;
}

export type JobCategoriesData = {
    id?: Number;
    name?: Record<string, string>;
    slug?: String;
}

export type FilteredJobCategories = {
    items: JobCategories[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilteredJobCategoriesResponse = { success: boolean; message: string, data: FilteredJobCategories };
export type JobCategoriesResponse = { success: boolean; message: string, data: JobCategories };

export type FilterJobCategoriesData = {
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};