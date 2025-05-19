import { useQuery } from "@tanstack/react-query";
import { getRoles, RolesResponse } from "@/api/roleApi";

export const useRoles = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  activeState: string = ""
) => {
  return useQuery<RolesResponse>({
    queryKey: ["roles", page, limit, search, activeState],
    queryFn: () => getRoles(page, limit, search, activeState),
  });
};
