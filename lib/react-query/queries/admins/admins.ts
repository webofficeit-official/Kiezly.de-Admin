import apiClient from "@/lib/config/axios-client";
import { FilterAdminData, FilterAdminResponse } from "@/lib/types/admin-type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Reset password 
export const useFilterAdmins = (): UseMutationResult<
  FilterAdminResponse,
  Error,
  FilterAdminData
> => {
  return useMutation({
    mutationFn: async ({ page, page_size, verified, active, deleted }) => {
      const res = await apiClient.post(
        `/all`,
        { page, page_size, verified, active, deleted },  // body
        { params: {} }          // query ?token=...
      );
      return res.data as FilterAdminResponse;
    },
  });
};