import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { loginApi, LoginPayload } from "@/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "@/utils/permission";
const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    featureName: "Dashboard",
  },
  {
    label: "Attorney Management",
    href: "/attorney-management",
    featureName: "Attorney Management",
  },
  {
    label: "Campaign Management",
    href: "/campaign-management",
    featureName: "Campaign Management",
  },
  {
    label: "Clause Management",
    href: "/clause-management",
    featureName: "Clause Management",
  },
  {
    label: "Upload Templates",
    href: "/upload-template",
    featureName: "Templates",
  },
  {
    label: "Approve Templates",
    href: "/approve-template",
    featureName: "Approve Templates",
  },
  {
    label: "Template Management",
    href: "/template-management",
    featureName: "Template Management",
  },
  { label: "Report", href: "/report", featureName: "Report" },
  {
    label: "Content Management System",
    href: "/content-management",
    featureName: "CMS ",
  },
  {
    label: "User Access Management",
    href: "/user-management",
    featureName: "User Access Management",
  },
];

export const useLogin = (): UseMutationResult<
  any,
  any,
  LoginPayload,
  unknown
> => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data: any) => {
      setAuth(
        {
          id: data.id,
          email: data.email,
          role: data.role,
          permissions: data.permissions,
        },
        data.token
      );
      toast({
        title: "Login attempt",
        description: data.message || "Welcome back! You are logged in.",
        duration: 2000,
      });

      if (!data.permissions.length) {
        navigate("/not-authorized");
        return;
      }
      // for (let i = 0; i < menuItems.length; i++) {
      //   const menuItem = menuItems[i];
      //   if (hasPermission(data.permissions, menuItem.featureName)) {
      //     // Navigate to the first feature the user has access to
      //     navigate(menuItem.href);
      //     break; // Stop once we find the first accessible feature
      //   } else {
      //     navigate("/not-authorized");
      //     break;
      //   }
      // }
      const filteredMenuItems = menuItems.filter((menuItem) =>
        hasPermission(data.permissions, menuItem.featureName)
      );

      // Navigate to the first accessible feature
      if (filteredMenuItems.length > 0) {
        navigate(filteredMenuItems[0].href);
      } else {
        navigate("/not-authorized");
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Invalid email or password";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 2000,
      });
    },
  });
};
