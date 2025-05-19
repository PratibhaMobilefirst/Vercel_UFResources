import { fetchRoles } from "@/api/role";
import { useQuery } from "@tanstack/react-query";

export const useRoles = () => {
  return useQuery<any>({
    queryKey: ["roles"], // Unique query key for React Query
    queryFn: fetchRoles, // Fetch data from the API
    // Optional: Add settings like refetchInterval, error handling etc.
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
