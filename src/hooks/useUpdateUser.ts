import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { UpdateUserParams } from "@/api/useCreateUser";

const updateUser = async (payload: UpdateUserParams) => {
  const response = await axiosInstance.put("/auth/updateUser", payload);
  return response.data;
};

export const useUpdateUser = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "User updated successfully",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/user-management");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update user";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 2000,
      });
    },
  });
}; 