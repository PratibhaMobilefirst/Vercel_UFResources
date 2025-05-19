import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/userApi";

export const useUserDetails = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return getUserById(userId);
    },
    enabled: !!userId,
  });
}; 