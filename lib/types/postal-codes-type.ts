export type Zipcode = {
  id: number;
  country_id: number;
  zipcode: string;
  street: string;
  city: string;
  state: string;
  latitude: string; 
  longitude: string;
  country_name?: string;
};


export type ZipcodeData = {
  country_id: number;
  zipcode: string;
  street: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
};

export type FilteredZipcodes = {
  items: Zipcode[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
};

export type FilteredZipcodesResponse = {
  success: boolean;
  message: string;
  data: FilteredZipcodes;
};

export type ZipcodeResponse = {
  success: boolean;
  message: string;
  data: Zipcode;
};

export type FilterZipcodesData = {
  q?: string; 
  country_id?: number;
  page?: number;
  page_size?: number;
  sort?: string;
};

export type UpdateZipcodePayload = {
  id: number | string;
  country_id?: number | string;
  zipcode?: string;
  street?: string;
  city?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
};
