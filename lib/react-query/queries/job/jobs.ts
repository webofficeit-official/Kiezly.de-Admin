import apiClient from "@/lib/config/axios-client";
import { FilterJobData, FilterJobResponse, JobProfileData, jobProfileResponse } from "@/lib/types/job-type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Filter Jobs 
export const useFilterJobs = (): UseMutationResult<
  FilterJobResponse,
  Error,
  FilterJobData
> => {
  return useMutation({
    mutationFn: async ({ page, page_size, q, location, role, sort, police_verified, has_first_aid }) => {
      const res = await apiClient.get(
        `/manage-jobs`,
        { params: { page, page_size, q, location, role, sort, police_verified, has_first_aid } },  // body
      );
      return res.data as FilterJobResponse;
    },
  });
};

// Job Profile 
export const useJobProfile = (): UseMutationResult<
  jobProfileResponse,
  Error,
  JobProfileData
> => {
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await apiClient.get(
        `/jobs/${id}`,
      );
      return res.data as jobProfileResponse;
    },
  });
};