import apiClient from "@/lib/config/axios-client";
import { FilteredLangugesResponse, FilterLanguagesData, Languages, LanguagesData, LanguagesResponse } from "@/lib/types/languages";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFilteredLanguages = (filters: FilterLanguagesData) =>
  useQuery({
    queryKey: ["languages", filters],
    queryFn: async () => {
      const res = await apiClient.get("/languages", { params: filters });
      return res.data as FilteredLangugesResponse;
    },
  });


 export const useAddLanguages = (): UseMutationResult<
  LanguagesResponse,
  Error,
  LanguagesData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }) => {
      const res = await apiClient.post(`/languages`, { name });
      return res.data as LanguagesResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["languages"], exact: false });
    },
  });
};



export function useUpdateLanguages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string | number; name: Record<string, string>}) => {
      const res = await apiClient.patch(`/languages/${payload.id}`, {
        name: payload.name,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["languages"] });
    },
  });
}


export const useLanguageDetailsById = (): UseMutationResult<
  LanguagesResponse,
  Error,
  Languages
> => {
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await apiClient.get(
        `/languages/${id}`,
      );
      return res.data as LanguagesResponse;
    },
  });
};