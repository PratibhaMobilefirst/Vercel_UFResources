import {
  createDocumentApi,
  CreateDocumentPayload,
  fetchTemplates,
  getTemplateCardsByRoleAndCategory,
} from "@/api/uploadTemplate";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useTemplates(submitType: "Draft" | "Submitted", page: number) {
  return useQuery({
    queryKey: ["templates", submitType, page],
    queryFn: () => fetchTemplates({ submitType, page }),
    staleTime: 1000 * 60 * 5,
  });
}

export const useTemplateCardsByRoleAndCategory = (
  roleId: string,
  categoryId: string
) => {
  return useQuery({
    queryKey: ["templateCards", roleId, categoryId],
    queryFn: () => getTemplateCardsByRoleAndCategory(roleId, categoryId),
    // staleTime: 1000 * 60 * 5,
    enabled: Boolean(roleId && categoryId),
    retry: 1,
  });
};

export function useCreateDocument() {
  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => createDocumentApi(payload),
  });
}
