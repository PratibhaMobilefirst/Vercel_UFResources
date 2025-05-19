import axiosWithToken from "./axiosWithToken";

interface FetchTemplatesParams {
  submitType: "Draft" | "Submitted";
  page: number;
}

export const fetchTemplates = async ({
  submitType,
  page,
}: FetchTemplatesParams): Promise<any> => {
  const response = await axiosWithToken.get(
    `/upload-documents/get-all-template-docs`,
    {
      params: { submitType, page },
    }
  );
  return response.data.data;
};

export const getTemplateCardsByRoleAndCategory = async (
  roleId: string,
  categoryId: string
): Promise<any> => {
  const response = await axiosWithToken.get(
    `/template-management/get-cards-by-category-and-role`,
    {
      params: { roleId, categoryId },
    }
  );
  return response.data;
};

export interface CreateDocumentPayload {
  docName: string;
  url: string;
  submitType: string;
  templateCardId: string;
  stateIds: string[];
  categoryId: string;
  roleId: string;
  shallUpdate: string;
}

export async function createDocumentApi(payload: CreateDocumentPayload) {
  const response = await axiosWithToken.post(
    "/upload-documents/create-document",
    payload
  );
  return response.data;
}
