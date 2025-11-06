import apiClient from "@/lib/config/axios-client";
import { FilterJobData, FilterJobResponse, JobDetailData, JobDetailResponse, JobFilterCollectionData, JobFilterCollectionResponse } from "@/lib/types/job-type";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Filter Jobs 
export const useFilterJobs = (): UseMutationResult<
  FilterJobResponse,
  Error,
  FilterJobData
> => {
  return useMutation({
    mutationFn: async ({ q, ends_at, page, page_size, posted, job_experience, job_tags, job_type, sort, starts_at, status, category_id, city, client_id, max_price, min_price }) => {
      const res = await apiClient.get(
        `/manage-jobs`,
        { params: { q, ends_at, page, page_size, posted, job_experience, job_tags, job_type, sort, starts_at, status, category_id, city, client_id, max_price, min_price } },  // body
      );
      return res.data as FilterJobResponse;
    },
  });
};

// Job Profile 
export const useJobFilterCollection = (): UseMutationResult<
  JobFilterCollectionResponse,
  Error,
  JobFilterCollectionData
> => {
  return useMutation({
    mutationFn: async ({}) => {
      const res = await apiClient.get(
        `/filter`,
      );
      return res.data as JobFilterCollectionResponse;
    },
  });
};

// Job Profile 
export const useJobDetails = (): UseMutationResult<
  JobDetailResponse,
  Error,
  JobDetailData
> => {
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await apiClient.get(
        `/manage-jobs/job/job-id/${id}`,
      );
      return res.data as JobDetailResponse;
    },
  });
};

// Job Profile 
export const useJobDetailsBySlug = (): UseMutationResult<
  JobDetailResponse,
  Error,
  JobDetailData
> => {
  return useMutation({
    mutationFn: async ({ slug }) => {
      const res = await apiClient.get(
        `/manage-jobs/job/${slug}`,
      );
      return res.data as JobDetailResponse;
    },
  });
};