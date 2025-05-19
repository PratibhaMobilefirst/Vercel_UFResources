import { useQuery } from "@tanstack/react-query";
import {
  fetchDocumentsByState,
  FetchDocumentsResponse,
  fetchStatesTemplate,
  fetchTemplateCards,
} from "@/api/templateCardApi";

export const useTemplateCards = (
  attorneyType: string,
  page = 1,
  limit = 10,
  stateId: string,
  categoryId: string,
  search: string
) => {
  return useQuery({
    queryKey: [
      "templateCards",
      attorneyType,
      page,
      limit,
      stateId,
      categoryId,
      search,
    ],
    queryFn: () =>
      fetchTemplateCards(
        attorneyType,
        page,
        limit,
        stateId,
        categoryId,
        search
      ),
    enabled: !!attorneyType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFetchStatesTemplate = (templateCardId, page, limit, state) => {
  return useQuery({
    queryKey: ["states", templateCardId, page, state],
    queryFn: () => fetchStatesTemplate(templateCardId, page, limit, state),
    enabled: !!templateCardId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFetchDocuments = (
  templateCardId: string,
  stateId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<FetchDocumentsResponse, Error>({
    queryKey: ["documents", templateCardId, stateId, page, limit],
    queryFn: () => fetchDocumentsByState(templateCardId, stateId, page, limit),
    enabled: !!templateCardId && !!stateId, // Ensure the query runs only if templateCardId and stateId are available
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    // keepPreviousData: true, // Keep previous data while loading new data
  });
};
