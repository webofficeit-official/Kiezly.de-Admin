import apiClient from "@/lib/config/axios-client";
import { FilteredJobTAgsResponse, FilterJobTagsData, JobTagsData, JobTagsResponse } from "@/lib/types/job-tags";
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";


export const useFilteredJobTags = (filters: FilterJobTagsData) =>
  useQuery({
    queryKey: ["job-tags", filters],
    queryFn: async () => {
      const res = await apiClient.get("/job-tags", { params: filters });
      return res.data as FilteredJobTAgsResponse;
    },
  });


 export const useAddJobTags = (): UseMutationResult<
  JobTagsResponse,
  Error,
  JobTagsData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, slug }) => {
      const res = await apiClient.post(`/job-tags`, { name, slug });
      return res.data as JobTagsResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["job-tags"], exact: false });
    },
  });
};

export function useGenerateJobTagsSlug() {
  const queryClient = useQueryClient();

  return useMutation<{ slug: string }, Error, string>({
    mutationFn: async (name: string) => {
      const res = await apiClient.post("/job-tags/generate-slug", { name });
      return { slug: res.data.slug };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-tags"] });
    },
  });
}

export function useUpdateJobTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string | number; name: string; slug: string }) => {
      const res = await apiClient.patch(`/job-tags/${payload.id}`, {
        name: payload.name,
        slug: payload.slug,
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["job-tags"] });
    },
  });
}
