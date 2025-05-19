import { useQuery } from "@tanstack/react-query";
import { getCategories, CategoriesResponse } from "@/api/categoryApi";

export const useCategories = (
  page: number = 1,
  limit: number = 10,
  searchText: string = "",
  activeState: string = ""
) => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories", page, limit, searchText, activeState],
    queryFn: () => getCategories(page, limit, searchText, activeState),
  });
};
