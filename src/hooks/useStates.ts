import { act } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStates, StatesResponse } from "@/api/statesApi";

export const useStates = (
  page: number = 1,
  limit: number = 10,
  searchText: string = "",
  activeState: string = ""
) => {
  return useQuery<StatesResponse>({
    queryKey: ["states", page, limit, searchText, activeState],
    queryFn: () => getStates(page, limit, searchText, activeState),
  });
};
