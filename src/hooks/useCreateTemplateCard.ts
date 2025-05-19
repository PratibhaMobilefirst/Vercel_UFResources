import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosWithToken from "@/api/axiosWithToken";

export interface CreateTemplateCardDto {
  templateCardName: string;
  attorneyType: "NetworkAttorney" | "Campaign" | "AttorneySpecific";
  categoryIds: string[];
  roleIds: string[];
}

export const useCreateTemplateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateCardDto) => 
      axiosWithToken.post("/template-management/create", data),
    onSuccess: () => {
      // Invalidate queries to refetch template cards data
      queryClient.invalidateQueries({ queryKey: ["templateCards"] });
    }
  });
}; 