export type Languages = {
    id: Number;
    name?: Record<string, string>;
}

export type LanguagesData = {
    name?: Record<string, string>;
}

export type FilteredLanguages = {
    items: Languages[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilteredLangugesResponse = { success: boolean; message: string, data: FilteredLanguages };
export type LanguagesResponse = { success: boolean; message: string, data: Languages };

export type FilterLanguagesData = {
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};