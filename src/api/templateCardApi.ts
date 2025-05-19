import axiosWithToken from "./axiosWithToken";

export interface TemplateCardResponse {
  status: boolean;
  message: string;
  data: {
    templateCards: TemplateCard[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface TemplateCard {
  id: string;
  templateCardName: string;
  attorneyType: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    email: string;
  };
  categories: {
    category: {
      id: string;
      templateName: string;
      addedDate: string;
      status: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt: null | string;
      isDeleted: null | boolean;
    };
    categoryId: string;
  }[];
  roles: {
    role: {
      id: string;
      name: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    roleId: string;
  }[];
}

export interface Document {
  id: string;
  documentName: string;
  url: string;
  approvalStatus: string;
  submitType: string;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  templateCardId: string;
  stateId: string;
  version: number;
  userId: string;
  state: {
    id: string;
    stateCode: string;
    stateName: string;
    addedDate: string;
    status: boolean;
  };
}

export interface FetchDocumentsResponse {
  status: boolean;
  message: string;
  data: {
    data: Document[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export const fetchTemplateCards = async (
  attorneyType: string,
  page = 1,
  limit = 10,
  stateId: string,
  categoryId: string,
  search: string
): Promise<TemplateCardResponse> => {
  const response = await axiosWithToken.get<TemplateCardResponse>(
    // `/template-management/template-list?attorneyType=${attorneyType}&page=${page}&limit=${limit}`
    `/template-management/template-list?attorneyType=${attorneyType}&page=${page}&limit=${limit}&stateId=${stateId}&category=${categoryId}&search=${search}`
  );
  return response.data;
};
export const fetchStatesTemplate = async (
  templateCardId,
  page = 1,
  limit = 10,
  state
) => {
  const response = await axiosWithToken.post(
    "/template-management/get-all-states-by-cardid",
    {
      templateCardId,
      page,
      limit,
      state,
    }
  );
  return response.data.data;
};

export const fetchDocumentsByState = async (
  templateCardId: string,
  stateId: string,
  page: number = 1,
  limit: number = 10
): Promise<FetchDocumentsResponse> => {
  const response = await axiosWithToken.get<FetchDocumentsResponse>(
    `/template-management/get-all-docs-by-states?templateCardId=${templateCardId}&stateId=${stateId}&page=${page}&limit=${limit}`
  );
  return response.data;
};
