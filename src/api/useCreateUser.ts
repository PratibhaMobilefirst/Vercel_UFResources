import axiosInstance from "./axiosInstance";

export interface CreateUserParams {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: string;
}

export interface UpdateUserParams {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  roleId: string;
}

export const createUser = async (user: CreateUserParams) => {
  const response = await axiosInstance.post("/auth/createUser", user);
  return response.data; // Adjust according to your API response
};
