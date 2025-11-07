import apiClient from "@/lib/config/axios-client";
import { CountriesResponse, CountryData, FilterCountriesData, FilteredCountriesResponse, UpdateCountryPayload } from "@/lib/types/country-type";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";


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



const compact = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;

export function useUpdateCountry() {
  const qc = useQueryClient();

  return useMutation<any, Error, UpdateCountryPayload>({
    mutationFn: async ({ id, name, code, currency }) => {
      const body = compact({
        name: typeof name === "string" ? name.trim() : undefined,
        code: typeof code === "string" ? code.trim().toUpperCase() : undefined,
        currency: typeof currency === "string" ? currency.trim().toUpperCase() : undefined,
      });

      if (Object.keys(body).length === 0) {
        throw new Error("No fields provided to update");
      }

      const res = await apiClient.patch(`/countries/${id}`, body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["countries"], exact: false });
    },
  });
}