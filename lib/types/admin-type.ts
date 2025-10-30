export type Admins = {
    id: string;
    email: string;
    active?: boolean;
    super?: boolean;
    verified?: boolean;
    deleted?: boolean;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

export type FilteredAdmins = {
    admins: {
        items: Admins[]
        page: number
        page_size: number
        total_items: number
        total_pages: number
    }
}

export type FilterAdminResponse = { success: boolean; message: string, data: FilteredAdmins };

export type FilterAdminData = {
  page?: number | 1;
  page_size?: number | 10 
  verified?: boolean | null
  active?: boolean | null
  deleted?: boolean | null
};