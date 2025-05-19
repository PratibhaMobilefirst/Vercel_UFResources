import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    role: string;
    token: string;
    permissions: string[];
  };
}

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse["data"]> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/loginUser",
    payload
  );
  return response.data.data;
};

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
  data: unknown;
}

// Update the function to return the correct response
export const forgotPasswordApi = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  const response = await axiosInstance.post("/auth/forgotPassword", payload);
  return response.data; // Returning the response with 'message' and 'status'
};

export interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
}
export interface ResetPasswordResponse {
  status: boolean;
  message: string;
  data: unknown;
}
export const resetPasswordApi = async (
  token: string,
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>(
    `/auth/resetPassword?token=${token}`, // URL with the token query parameter
    payload
  );
  return response.data; // Returning the response with 'status', 'message', and 'data'
};
