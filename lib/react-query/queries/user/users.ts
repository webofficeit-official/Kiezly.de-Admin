import apiClient from "@/lib/config/axios-client";
import { FilterUserData, FilterUserResponse } from "@/lib/types/user-type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Filter Users 
export const useFilterUsers = (): UseMutationResult<
  FilterUserResponse,
  Error,
  FilterUserData
> => {
  return useMutation({
    mutationFn: async ({ page, page_size, verified, active, deleted }) => {
      const res = await apiClient.get(
        `/users`,
        {  },  // body
      );
      return res.data as FilterUserResponse;
    },
  });
};