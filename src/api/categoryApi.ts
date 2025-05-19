import axiosInstance from "./axiosInstance";

export interface CreateCategoryPayload {
  templateName: string;
}

export interface UpdateCategoryPayload {
  updatedName: string;
  categoryId: string;
}

export interface CreateCategoryResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    templateName: string;
    // Add other fields if they come in the response
  };
}

export interface Category {
  id: string;
  templateName: string;
  addedDate: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: {
    data: Category[];
    meta: {
      total: number;
      page: number;
      totalPages: number;
    };
  };
}

export interface ToggleCategoryResponse {
  status: boolean;
  message: string;
  data: Category;
}

export interface DeleteCategoryResponse {
  status: boolean;
  message: string;
  data: Category;
}

export const createCategory = async (
  payload: CreateCategoryPayload
): Promise<CreateCategoryResponse> => {
  const response = await axiosInstance.post<CreateCategoryResponse>(
    "/cms/create",
    payload
  );
  return response.data;
};

export const updateCategory = async (
  payload: UpdateCategoryPayload
): Promise<void> => {
  await axiosInstance.put("/cms/update-category", payload);
};

export const getCategories = async (
  page: number = 1,
  limit: number = 10,
  searchText: string,
  activeState: string = ""
): Promise<CategoriesResponse> => {
  const response = await axiosInstance.get<CategoriesResponse>(
    `/cms/categories?limit=${limit}&page=${page}&searchText=${searchText}&ActiveOrInactive=${activeState}`
  );

  return response.data;
};

export const toggleCategoryStatus = async (
  categoryId: string
): Promise<ToggleCategoryResponse> => {
  const response = await axiosInstance.put<ToggleCategoryResponse>(
    `/cms/toggle-status-category`,
    { categoryId }
  );
  return response.data;
};

export const deleteCategory = async (
  categoryId: string
): Promise<DeleteCategoryResponse> => {
  const response = await axiosInstance.delete<DeleteCategoryResponse>(
    `/cms/delete-template-category/${categoryId}`
  );
  return response.data;
};
