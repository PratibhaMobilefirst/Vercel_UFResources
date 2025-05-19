import { Search } from "lucide-react";
import { act } from "react";
import axiosInstance from "./axiosInstance";

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
}

export interface RolesResponse {
  status: boolean;
  message: string;
  data: {
    data: Role[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export interface ToggleRoleResponse {
  status: boolean;
  message: string;
  data: Role;
}

export const getRoles = async (
  page: number = 1,
  limit: number = 10,
  SearchText: string = "",
  activeState: string = ""
): Promise<RolesResponse> => {
  const response = await axiosInstance.get<RolesResponse>(
    `/permission/fetchAllRoleListWithPagination?page=${page}&limit=${limit}&ActiveOrInactive=${activeState}&searchTerm=${SearchText}`
  );
  return response.data;
};

export const toggleRoleStatus = async (
  roleId: string
): Promise<ToggleRoleResponse> => {
  const response = await axiosInstance.post<ToggleRoleResponse>(
    `/permission/activeDeactivateRoleStatus?roleId=${roleId}`
  );
  return response.data;
};
