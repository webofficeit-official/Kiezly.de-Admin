import apiClient from "@/lib/config/axios-client";
import { FilterLocalizationData, FilterLocalizationResponse, LocalizationData } from "@/lib/types/localization-type";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

export const useLocalization = (filters: FilterLocalizationData) => {
    return useQuery({
        queryKey: ["localization",filters],
        queryFn: async () => {
            const res = await apiClient.get("/localization",{ params: filters });
            return res.data as FilterLocalizationResponse;
        },
    });
};

 export const useAddLocalization = (): UseMutationResult<
  FilterLocalizationResponse,
  Error,
  LocalizationData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ code,name }) => {
      const res = await apiClient.post(`/localization`, { code,name});
      return res.data as FilterLocalizationResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["localization"], exact: false });
    },
  });
};