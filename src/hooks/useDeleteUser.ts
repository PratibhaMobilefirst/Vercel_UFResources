import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/api/userApi";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (response) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "User deleted successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to delete user",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
}; 