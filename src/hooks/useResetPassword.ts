import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordApi,
  ForgotPasswordResponse,
  ForgotPasswordPayload,
  resetPasswordApi,
} from "@/api/authApi";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const useResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  //   const token = useAuthStore.getState().token;
  //   console.log({ token });
  const location = useLocation();

  // Extract the token from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // Get token from URL (e.g., /resetPassword?token=abc123)

  return useMutation({
    mutationFn: (payload: any) => resetPasswordApi(token, payload),
    onSuccess: (data) => {
      toast({
        title: "Password Changed",
        description:
          data.message ||
          "Password updated successfully. Please login with new password",
      });
      navigate("/success-popup");
    },
    onError: (error: any) => {
      console.log({ error }, "error");
      const errorMessage =
        error?.response?.data?.message || "An error occurred.";
      toast({
        title: "Error updating password",
        variant: "destructive",
        description: errorMessage,
      });
    },
  });
};
