import { useMutation } from "@tanstack/react-query";
import {
  forgotPasswordApi,
  ForgotPasswordResponse,
  ForgotPasswordPayload,
} from "@/api/authApi";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordApi(payload),
    onSuccess: (data) => {
      toast({
        title: "Password Reset Link Sent",
        description:
          data.message || "Please check your email for the reset link.",
        duration: 2000,
      });
      navigate("/success-popup-email");
    },
    onError: (error: any) => {
      console.log({ error }, "error");
      const errorMessage =
        error?.response?.data?.message || "An error occurred.";
      toast({
        title: "Error Sending Reset Link",
        variant: "destructive",
        description: errorMessage,
        duration: 2000,
      });
    },
  });
};
