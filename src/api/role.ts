import axiosInstance from "./axiosInstance";

// Define the structure for the roles
interface Role {
  id: string;
  name: string;
  isActive: boolean;
}

interface RoleResponse {
  data: Role[];
}

export const fetchRoles = async (): Promise<RoleResponse> => {
  const response = await axiosInstance.get("/permission/fetchAllRoleList");
  return response.data;
};
