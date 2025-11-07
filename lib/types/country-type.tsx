export type Country = {
    id: Number;
    code?: String;
    name?: String;
    currency?: String;
}

export type CountryData = {
    code?: String;
    name?: String;
    currency?: String;
}

export type FilteredCountries = {
    items: Country[]
    page: number
    page_size: number
    total_items: number
    total_pages: number
}

export type FilteredCountriesResponse = { success: boolean; message: string, data: FilteredCountries };
export type CountriesResponse = { success: boolean; message: string, data: Country };

export type FilterCountriesData = {
    q?: string;   
    page?: number;
    page_size?: number;
    sort?: string;
};