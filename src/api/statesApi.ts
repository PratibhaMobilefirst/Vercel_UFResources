import axiosInstance from "./axiosInstance";

export interface State {
  id: string;
  stateCode: string;
  stateName: string;
  addedDate: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StatesResponse {
  status: boolean;
  message: string;
  data: {
    data: State[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export const getStates = async (
  page: number = 1,
  limit: number = 10,
  searchText: string,
  activeState: string
): Promise<StatesResponse> => {
  const response = await axiosInstance.get<StatesResponse>(
    `/cms/states?limit=${limit}&page=${page}&searchText=${searchText}&ActiveOrInactive=${activeState}`
  );
  return response.data;
};

export interface ToggleStateResponse {
  status: boolean;
  message: string;
  data: State;
}

export const toggleStateStatus = async (
  id: string
): Promise<ToggleStateResponse> => {
  const response = await axiosInstance.put<ToggleStateResponse>(
    `/cms/toggle-status-state?id=${id}`
  );
  return response.data;
};
