import apiClient from "@/lib/config/axios-client";
import { FilteredJobCategoriesResponse, FilterJobCategoriesData } from "@/lib/types/job-categories";
import { useQuery } from "@tanstack/react-query";

// Filter Job Categories
export const useFilteredCategories = (filters: FilterJobCategoriesData) =>
  useQuery({
    queryKey: ["categories", filters],
    queryFn: async () => {
      const res = await apiClient.get("/categories", { params: filters });
      return res.data as FilteredJobCategoriesResponse;
    },
  });