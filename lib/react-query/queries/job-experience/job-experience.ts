import apiClient from "@/lib/config/axios-client";
import {
  FilteredJobExperienceResponse,
  FilterJobExperienceData,
  JobExperience,
  JobExperienceData,
  JobExperienceResponse,
} from "@/lib/types/job-experience-type";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useFilteredJobExperience = (filters: FilterJobExperienceData) =>
  useQuery({
    queryKey: ["job-experience", filters],
    queryFn: async () => {
      const res = await apiClient.get("/job-experience", { params: filters });
      return res.data as FilteredJobExperienceResponse;
    },
  });

export const useAddJobExperience = (): UseMutationResult<
  JobExperienceResponse,
  Error,
  JobExperienceData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }) => {
      const res = await apiClient.post(`/job-experience`, { name });
      return res.data as JobExperienceResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ["job-experience"],
        exact: false,
      });
    },
  });
};

const compact = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;

export function useUpdateJobExperience() {
  const qc = useQueryClient();

  return useMutation<any, Error, JobExperience>({
    mutationFn: async ({ id, name }) => {
      const body = compact({
        name: typeof name === "string" ? name.trim() : undefined,
      });

      if (Object.keys(body).length === 0) {
        throw new Error("No fields provided to update");
      }

      const res = await apiClient.patch(`/job-experience/${id}`, body);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-experience"], exact: false });
    },
  });
}

export const useJobExperienceDetailsById = (): UseMutationResult<
  JobExperienceResponse,
  Error,
  JobExperience
> => {
  return useMutation({
    mutationFn: async ({ id }) => {
      const res = await apiClient.get(`/job-experience/${id}`);
      return res.data as JobExperienceResponse;
    },
  });
};
