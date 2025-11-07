import apiClient from "@/lib/config/axios-client";
import { CountriesResponse, CountryData, FilterCountriesData, FilteredCountriesResponse } from "@/lib/types/country-type";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { Code, Currency } from "lucide-react";


export const useFilteredCountries = (filters: FilterCountriesData) =>
  useQuery({
    queryKey: ["countries", filters],
    queryFn: async () => {
      const res = await apiClient.get("/countries", { params: filters });
      return res.data as FilteredCountriesResponse;
    },
  });


 export const useAddCountries = (): UseMutationResult<
  CountriesResponse,
  Error,
  CountryData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ code,name,currency  }) => {
      const res = await apiClient.post(`/countries`, { code,name,currency });
      return res.data as CountriesResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["countries"], exact: false });
    },
  });
};



export function useUpdateCountry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string | number;code:string; name: string,currency:string}) => {
      const res = await apiClient.patch(`/countries/${payload.id}`, {
        code: payload.code,
        name: payload.name,
        currency: payload.currency
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["countries"] });
    },
  });
}
