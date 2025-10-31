import apiClient from "@/lib/config/axios-client";
import { FilterAdminData, FilterAdminResponse, InviteAdminData, InviteAdminResponse } from "@/lib/types/admin-type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Filter Admins 
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

// Invite Admin 
export const useInviteAdmins = (): UseMutationResult<
  InviteAdminResponse,
  Error,
  InviteAdminData
> => {
  return useMutation({
    mutationFn: async ({ first_name, last_name, email }) => {
      const res = await apiClient.post(
        `/invite`,
        { first_name, last_name, email },  // body
        { params: {} }          // query ?token=...
      );
      return res.data as InviteAdminResponse;
    },
  });
};