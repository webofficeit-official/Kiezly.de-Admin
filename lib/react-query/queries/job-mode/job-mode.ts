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



const compact = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;

export function useUpdateJobMode() {
  const qc = useQueryClient();

  return useMutation<any, Error, JobMode>({
    mutationFn: async ({ id, name}) => {
      const body = compact({
        name: typeof name === "string" ? name.trim() : undefined,
      });

      if (Object.keys(body).length === 0) {
        throw new Error("No fields provided to update");
      }

      const res = await apiClient.patch(`/job-type/${id}`, body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-type"], exact: false });
    },
  });
}