import { useQuery } from "@tanstack/react-query";
import { getUsers, UsersResponse } from "@/api/userApi";

export const useUsers = (
  page: number = 1,
  limit: number = 10,
  SearchText: string = "",
  activeState: string = ""
) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", page, limit, SearchText, activeState],
    queryFn: () => getUsers(page, limit, SearchText, activeState),
  });
};
