import { fetchPermissions, fetchPermissionsList } from "@/api/um";
import { useQuery } from "@tanstack/react-query";

export const usePermissions = () => {
  return useQuery<any>({
    queryKey: ["permissions"], // Unique query key for React Query
    queryFn: fetchPermissions, // Fetch data from the API
    // Optional: Add settings like refetchInterval, error handling etc.
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const usePermissionsList = (userId: string) => {
  return useQuery<any>({
    queryKey: ["permissions", userId], // Unique query key for React Query
    queryFn: () => fetchPermissionsList(userId), // Pass userId to fetch user-specific permissions
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
