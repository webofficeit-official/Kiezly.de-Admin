import apiClient from "@/lib/config/axios-client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export interface DashboardResponse {
    success: boolean;
    message: string;
    data: {
        count: Count
    };
}

export interface Count {
    user: {
        total: number
        clients: number
        helper: number
        admin: number
    },
    jobs: {
        total: number
        open: number
        in_progress: number
        completed: number
        cancelled: number
        draft: number
        pending_review: number
        published: number
        closed: number
        rejected: number
        expired: number
    }
}

export interface DashboardData {
}

export const useDashboard = (): UseMutationResult<
  DashboardResponse,
  Error
> => {
  return useMutation({
    mutationFn: () =>
      apiClient.get("/dashboard").then(res => res.data),
  });
};