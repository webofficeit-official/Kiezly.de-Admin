import apiClient from "@/lib/config/axios-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export interface FilterReviewData {
  job_id?: string;
  reviewer_id?: string;
  reviewee_id?: string;
  visibility?: boolean;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  page_size?: number;
  sort_by?: "created_at" | "rating";
  sort_order?: "ASC" | "DESC";
}

export const useFilterReviews = (): UseMutationResult<
  any,
  Error,
  FilterReviewData
> => {
  return useMutation({
    mutationFn: async ({
      job_id,
      reviewer_id,
      reviewee_id,
      visibility,
      min_rating,
      max_rating,
      page,
      page_size,
      sort_by,
      sort_order,
    }) => {

      const res = await apiClient.get("/reviews/manage", {
        params: {
          job_id,
          reviewer_id,
          reviewee_id,
          visibility,
          min_rating,
          max_rating,
          page,
          page_size,
          sort_by,
          sort_order,
        },
      });

      return res.data;
    },
  });
};
