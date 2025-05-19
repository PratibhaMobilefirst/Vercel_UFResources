import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleRoleStatus } from "@/api/roleApi";
import { toggleUserStatus } from "@/api/userApi";
import { useToast } from "@/components/ui/use-toast";

export const useToggleRoleStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRoleStatus,
    onSuccess: (response) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "Role status updated successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to update role status",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
};

export const useToggleUserStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: (response) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "User status updated successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to update user status",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
}; 