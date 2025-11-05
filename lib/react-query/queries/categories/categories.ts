import apiClient from "@/lib/config/axios-client";
import { FilteredJobCategoriesResponse, FilterJobCategoriesData } from "@/lib/types/job-categories";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export const useFilterUsers = (): UseMutationResult<
  FilteredJobCategoriesResponse,
  Error,
  FilterJobCategoriesData
> => {
  return useMutation({
    mutationFn: async ({ page, page_size, q}) => {
      const res = await apiClient.get(
        `/categories`,
        { params: { page, page_size, q, location } },  // body
      );
      return res.data as FilteredJobCategoriesResponse;
    },
  });
};