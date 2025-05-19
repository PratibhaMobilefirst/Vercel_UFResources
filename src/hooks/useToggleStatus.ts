import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleStateStatus } from "@/api/statesApi";
import { toggleCategoryStatus } from "@/api/categoryApi";
import { useToast } from "@/components/ui/use-toast";

interface ToggleResponse {
  status: boolean;
  message: string;
  data: any;
}

export const useToggleStateStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleStateStatus,
    onSuccess: (response: ToggleResponse) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "State status updated successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["states"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to update state status",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
};

export const useToggleCategoryStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCategoryStatus,
    onSuccess: (response: ToggleResponse) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "Category status updated successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to update category status",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
}; 