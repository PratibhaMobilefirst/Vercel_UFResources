import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

// Define the structure of the payload for creating a role
interface Permission {
  permissionId: string;
  status: boolean;
}

interface PermissionList {
  featureId: string;
  permission: Permission[];
}

interface CreateRoleParams {
  roleName: string;
  permissionList: PermissionList[];
}

// Function to call the API for creating a role
const createRoleApi = async (payload: CreateRoleParams) => {
  const response = await axiosInstance.post("/permission/createRole", payload);
  return response.data; // Adjust according to your API response
};

// Custom hook to handle creating a role
export const useCreateRole = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: CreateRoleParams) => createRoleApi(payload),
    onSuccess: (data) => {
      // Show success toast
      toast({
        title: "Role Created",
        description: data.message || "The role has been successfully created.",
      });
      navigate("/user-management");
    },

    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create role.";
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive", // Error variant for toast
      });
    },
  });
};
