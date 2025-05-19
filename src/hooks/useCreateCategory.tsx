import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/api/categoryApi";
import { useToast } from "@/components/ui/use-toast";

export const useCreateCategory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateName: string) => createCategory({ templateName }),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Category created successfully",
        duration: 2000,
      });
      // Invalidate and refetch categories list if you have one
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
}; 