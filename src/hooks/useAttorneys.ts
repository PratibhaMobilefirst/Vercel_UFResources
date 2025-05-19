import {
  useMutation,
  UseMutationResult,
  useQuery,
} from "@tanstack/react-query";
import {
  fetchAttorneys,
  getAttorneyDetails,
  getCaseDetails,
  updateAttorneyRole,
  updatePrivateAttorney,
  updateStatus,
} from "@/api/Attorneys";
import { AttorneysResponse } from "@/types/attorney";

interface UseAttorneysProps {
  page: number;
  limit: number;
  searchTerm: string;
  state: string;
  city: string;
  role: string;
  statusValue: string;
  privateAttorneyValue: string;
}

export const useAttorneys = ({
  page,
  limit,
  searchTerm,
  state,
  city,
  role,
  statusValue,
  privateAttorneyValue,
}: UseAttorneysProps) => {
  return useQuery<AttorneysResponse>({
    queryKey: [
      "attorneys",
      page,
      limit,
      searchTerm,
      state,
      city,
      role,
      statusValue,
      privateAttorneyValue,
    ],
    queryFn: fetchAttorneys,
    keepPreviousData: true,
    staleTime: 10000, // Adjust for your needs
  });
};

interface UpdateStatusParams {
  attorneyId: string; // Assuming attorneyId is a string
  status: boolean;
}

interface UpdatePrivateAttorneyParams {
  attorneyId: string; // Assuming attorneyId is a string
  privateAttorney: boolean;
}

// Mutation hook for updating the status of an attorney
export const useUpdateStatus = (): UseMutationResult<
  any,
  Error,
  UpdateStatusParams
> => {
  return useMutation({
    mutationFn: ({ attorneyId, status }: any) =>
      updateStatus(attorneyId, status), // Ensure this matches the signature of `useMutation`
  });
};

// Mutation hook for updating the private attorney flag
export const useUpdatePrivateAttorney = (): UseMutationResult<
  any,
  Error,
  UpdatePrivateAttorneyParams
> => {
  return useMutation({
    mutationFn: ({ attorneyId, privateAttorney }: any) =>
      updatePrivateAttorney(attorneyId, privateAttorney), // Ensure this matches the signature of `useMutation`
  });
};

export const useUpdateAttorneyRole = (): UseMutationResult<any, Error> => {
  return useMutation({
    mutationFn: ({ attorneyId, role }: any) =>
      updateAttorneyRole(attorneyId, role), // Ensure this matches the signature of `useMutation`
  });
};

export const useAttorneyDetails = (attorneyId: string) => {
  return useQuery({
    queryKey: ["attorney-details", attorneyId],
    queryFn: () => getAttorneyDetails(attorneyId),
    enabled: !!attorneyId, // ensures it only runs when ID is present
  });
};

export const useCaseDetails = (attorneyId: string, caseId: string) => {
  return useQuery({
    queryKey: ["case-details", attorneyId, caseId],
    queryFn: () => getCaseDetails({ attorneyId, caseId }),
    enabled: !!attorneyId && !!caseId,
  });
};
