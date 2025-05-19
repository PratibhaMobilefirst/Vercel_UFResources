import axiosInstance from "./axiosInstance";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role: {
    id: string;
    name: string;
  };
}

export interface UsersResponse {
  status: boolean;
  message: string;
  data: {
    data: User[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export interface ToggleUserResponse {
  status: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponse {
  status: boolean;
  message: string;
}

export interface UserDetailsResponse {
  status: boolean;
  message: string;
  data: {
    data: {
      id: string;
      firstName: string;
      lastName: string;
      middleName: string;
      email: string;
      mobileNumber: string;
      isActive: boolean;
      isDeleted: boolean;
      role: {
        id: string;
        name: string;
      };
      verifiedUser: boolean;
    };
  };
}

export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  SearchText: string = "",
  activeState: string = ""
): Promise<UsersResponse> => {
  const response = await axiosInstance.get<UsersResponse>(
    `/auth/fetchAllUserListWithPagination?page=${page}&limit=${limit}&search=${SearchText}&ActiveOrInactive=${activeState}`
  );
  return response.data;
};

export const toggleUserStatus = async (
  userId: string
): Promise<ToggleUserResponse> => {
  const response = await axiosInstance.post<ToggleUserResponse>(
    `/permission/activeDeactivateUserStatus?userId=${userId}`
  );
  return response.data;
};

export const deleteUser = async (
  userId: string
): Promise<DeleteUserResponse> => {
  const response = await axiosInstance.post<DeleteUserResponse>(
    `/permission/delete-user?userId=${userId}`
  );
  return response.data;
};

export const getUserById = async (
  userId: string
): Promise<UserDetailsResponse> => {
  const response = await axiosInstance.get<UserDetailsResponse>(
    `/auth/fetchUserIdWiseDetails?userId=${userId}`
  );
  return response.data;
};
