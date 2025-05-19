import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/api/categoryApi";
import { toast } from "sonner";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      toast.success(response.message || "Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
}; 