import apiClient from "@/lib/config/axios-client";
import { FilteredJobCategoriesResponse, FilterJobCategoriesData, JobCategoriesData, JobCategoriesResponse } from "@/lib/types/job-categories";
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";

// Filter Job Categories
export const useFilteredCategories = (filters: FilterJobCategoriesData) =>
  useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const res = await apiClient.get("/categories", { params: filters });
      return res.data as FilteredJobCategoriesResponse;
    },
  });


  export const useAddCategories = (): UseMutationResult<
  JobCategoriesResponse,
  Error,
  JobCategoriesData
> => {
  return useMutation({
    mutationFn: async ({ name, slug }) => {
      const res = await apiClient.post(
        `/categories`,
        { name,slug },  
        { params: {} }         
      );
      return res.data as JobCategoriesResponse;
    },
  });
};