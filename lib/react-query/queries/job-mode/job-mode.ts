import apiClient from "@/lib/config/axios-client";
import { FilteredJobModeResponse, FilterJobModeData, JobMode, JobModeData, JobModeResponse } from "@/lib/types/job-mode-type";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFilteredJobType = (filters: FilterJobModeData) =>
  useQuery({
    queryKey: ["job-type", filters],
    queryFn: async () => {
      const res = await apiClient.get("/job-type", { params: filters });
      return res.data as FilteredJobModeResponse;
    },
  });


 export const useAddJobMode = (): UseMutationResult<
  JobModeResponse,
  Error,
  JobModeData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }) => {
      const res = await apiClient.post(`/job-type`, { name });
      return res.data as JobModeResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["job-type"], exact: false });
    },
  });
};



export function useUpdateJobMode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string | number; name: Record<string, string>}) => {
      const res = await apiClient.patch(`/job-type/${payload.id}`, {
        name: payload.name,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-type"] });
    },
  });
}

export const useJobModeDetailsById = (): UseMutationResult<
  JobModeResponse,
  Error,
  JobMode
> => {
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await apiClient.get(
        `/job-type/${id}`,
      );
      return res.data as JobModeResponse;
    },
  });
};