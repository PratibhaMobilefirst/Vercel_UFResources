import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { LoginPayload } from "@/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { createUser, CreateUserParams } from "@/api/useCreateUser";

export const useCreateUser = (): UseMutationResult<
  any,
  any,
  CreateUserParams,
  unknown
> => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: any) => createUser(payload),
    onSuccess: (data: any) => {
      toast({
        title: "create user",

        description: data.message || "user is created successfully",
      });
      navigate("/user-management");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "something went wrong";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
