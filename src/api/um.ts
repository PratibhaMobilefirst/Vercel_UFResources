import axiosInstance from "./axiosInstance";

// Define the API fetch function
export const fetchPermissions = async () => {
  const response = await axiosInstance.get(
    "/permission/fetchPermissionAndCapabilities"
  );
  return response.data.data;
};

export const fetchPermissionsList = async (userId: string) => {
  const response = await axiosInstance.get(
    `/permission/fetchUserWisePermissions?roleId=${userId}`
  );
  return response.data.data;
};
