import apiClient from "@/lib/config/axios-client";
import {
  ZipcodeResponse,
  ZipcodeData,
  FilterZipcodesData,
  FilteredZipcodesResponse,
  UpdateZipcodePayload,
} from "@/lib/types/postal-codes-type"; 
import { useMutation, UseMutationResult, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFilteredZipcodes = (filters: FilterZipcodesData) =>
  useQuery({
    queryKey: ["zipcodes", filters],
    queryFn: async () => {
      const res = await apiClient.get("/zipcodes", { params: filters });
      return res.data as FilteredZipcodesResponse;
    },
  });

export const useAddZipcode = (): UseMutationResult<
  ZipcodeResponse,
  Error,
  ZipcodeData
> => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ZipcodeData) => {
      const body: ZipcodeData = {
        country_id: Number(payload.country_id),
        zipcode: String(payload.zipcode).trim(),
        street: String(payload.street).trim(),
        city: String(payload.city).trim(),
        state: String(payload.state).trim(),
        latitude: String(payload.latitude).trim(),
        longitude: String(payload.longitude).trim(),
      };
      const res = await apiClient.post("/zipcodes", body);
      return res.data as ZipcodeResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["zipcodes"], exact: false });
    },
  });
};


const compact = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;

export function useUpdateZipcode() {
  const qc = useQueryClient();

  return useMutation<any, Error, UpdateZipcodePayload>({
    mutationFn: async ({
      id,
      country_id,
      zipcode,
      street,
      city,
      state,
      latitude,
      longitude,
    }) => {
      const body = compact({
        country_id:
          typeof country_id === "string" ? country_id.trim() : undefined,
        zipcode: typeof zipcode === "string" ? zipcode.trim() : undefined,
        street: typeof street === "string" ? street.trim() : undefined,
        city: typeof city === "string" ? city.trim() : undefined,
        state: typeof state === "string" ? state.trim() : undefined,
        latitude: typeof latitude === "string" ? latitude.trim() : undefined,
        longitude: typeof longitude === "string" ? longitude.trim() : undefined,
      });

      if (Object.keys(body).length === 0) {
        throw new Error("No fields provided to update");
      }

      const res = await apiClient.patch(`/zipcodes/${id}`, body);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["zipcodes"], exact: false });
    },
  });
}
