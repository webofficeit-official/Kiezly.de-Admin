export type Localization = {
    id: string;
    code: string;
    name: string
}

export type FilterLocalizationResponse = {
    success: boolean
    message: string
    data: FilterLocalizationResponseData
};

export type FilterLocalizationResponseData = {
    items?: Localization[]
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};