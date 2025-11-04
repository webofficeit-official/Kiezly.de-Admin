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
    mutationFn: async ({ page, page_size, q, location, role, sort, police_verified, has_first_aid }) => {
      const res = await apiClient.get(
        `/users`,
        { params: { page, page_size, q, location, role, sort, police_verified, has_first_aid } },  // body
      );
      return res.data as FilterUserResponse;
    },
  });
};