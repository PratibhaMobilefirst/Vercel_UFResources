import axios from "axios";
import { AttorneysResponse } from "@/types/attorney";
import axiosInstance from "./axiosInstance";

export const fetchAttorneys = async ({
  queryKey,
}: {
  queryKey: [
    string,
    number,
    number,
    string,
    string,
    string,
    string,
    string,
    string
  ];
}): Promise<AttorneysResponse> => {
  const [
    _key,
    page,
    limit,
    searchTerm,
    state,
    city,
    role,
    statusValue,
    privateAttorneyValue,
  ] = queryKey;

  const response = await axiosInstance.get("/attorney", {
    params: {
      page,
      limit,
      attorneyName: searchTerm,
      state,
      city,
      role,
      status: statusValue,
      privateAttorney: privateAttorneyValue,
    },
  });

  return response.data;
};

export const updateStatus = async (attorneyId: string, status: boolean) => {
  const response = await axiosInstance.put(`/attorney/${attorneyId}/status`, {
    status,
  });
  return response.data;
};

export const updatePrivateAttorney = async (
  attorneyId: string,
  privateAttorney: boolean
) => {
  const response = await axiosInstance.put(
    `/attorney/${attorneyId}/private-attorney`,
    { privateAttorney }
  );
  return response.data;
};
export const updateAttorneyRole = async (attorneyId: string, role: string) => {
  const response = await axiosInstance.put(
    `/attorney/${attorneyId}/role?roleId=${role}`
  );
  return response.data;
};

export const getAttorneyDetails = async (attorneyId: string) => {
  const response = await axiosInstance.get("/attorney/details", {
    params: { attorneyId },
  });
  return response.data.data; // return only the `data` object
};

export const getCaseDetails = async ({
  attorneyId,
  caseId,
}: {
  attorneyId: string;
  caseId: string;
}) => {
  const response = await axiosInstance.get(`/attorney/case-details`, {
    params: { attorneyId, caseId },
  });
  return response.data.data; // adjust if response shape differs
};
