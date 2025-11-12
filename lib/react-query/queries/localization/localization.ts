import apiClient from "@/lib/config/axios-client";
import { FilterLocalizationResponse } from "@/lib/types/localization-type";
import { useQuery } from "@tanstack/react-query";

export const useLocalization = () => {
    return useQuery({
        queryKey: ["localization"],
        queryFn: async () => {
            const res = await apiClient.get("/localization");
            return res.data as FilterLocalizationResponse;
        },
    });
};