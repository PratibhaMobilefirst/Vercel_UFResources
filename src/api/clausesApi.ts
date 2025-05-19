import axiosInstance from "./axiosInstance";
import axiosWithToken from "./axiosWithToken";

export interface ClauseItem {
  id: string;
  clauseName: string;
  templateCategory: {
    templateName: string;
  };
  state: {
    stateName: string;
  };
  status: boolean;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClausesResponse {
  status: boolean;
  message: string;
  data: {
    data: ClauseItem[];
    meta: {
      total: number;
      page: string;
      totalPages: number;
    };
  };
}

export interface ToggleClauseStatusResponse {
  status: boolean;
  message: string;
  data: ClauseItem;
}

export const getClauses = async (
  page: number = 1,
  limit: number = 10,
  status?: boolean
): Promise<ClausesResponse> => {
  let url = `/clauses/fetch-all-clauses?page=${page}&limit=${limit}`;

  if (status !== undefined) {
    url += `&status=${status}`;
  }

  const response = await axiosWithToken.get<ClausesResponse>(url);
  return response.data;
};

export const toggleClauseStatus = async (
  clauseId: string
): Promise<ToggleClauseStatusResponse> => {
  const response = await axiosWithToken.put<ToggleClauseStatusResponse>(
    `/clauses/activeInactiveClause?clauseId=${clauseId}`
  );
  return response.data;
};

export interface UpdateClausePayload {
  clauseId: string;
  clauseName: string;
  templateCategoryId: string;
  stateId: string;
  clauseContent: string;
}

export const updateClause = async (
  data: UpdateClausePayload
): Promise<ToggleClauseStatusResponse> => {
  const response = await axiosWithToken.put<ToggleClauseStatusResponse>(
    `/clauses/updateClause`,
    data
  );
  return response.data;
};

export interface ClauseDetailResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    clauseName: string;
    clauseContent: string;
    createdAt: string;
    updatedAt: string;
    modifiedBy: {
      firstName: string;
      lastName: string;
    };
  };
}

export const getClauseById = async (clauseId: string): Promise<ClauseDetailResponse> => {
  const response = await axiosWithToken.get<ClauseDetailResponse>(`/clauses/fetchClauseById?clauseId=${clauseId}`);
  return response.data;
};
