import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosWithToken from "@/api/axiosWithToken";
import { getClauses, ClausesResponse, toggleClauseStatus, updateClause, UpdateClausePayload, getClauseById, ClauseDetailResponse } from "@/api/clausesApi";
import { useToast } from "@/components/ui/use-toast";

interface CreateClausePayload {
  clauseName: string;
  templateCategoryId: string;
  stateId: string;
  status: boolean;
  clauseContent: string;
}

export const useCreateClause = () => {
  return useMutation({
    mutationFn: (data: CreateClausePayload) =>
        axiosWithToken.post("/clauses/createClause", data),
  });
};

export const useClauses = (page: number = 1, limit: number = 10, status?: boolean) => {
  return useQuery<ClausesResponse>({
    queryKey: ["clauses", page, limit, status],
    queryFn: () => getClauses(page, limit, status),
  });
};

export const useToggleClauseStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleClauseStatus,
    onSuccess: (response) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "Clause status updated successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["clauses"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to update clause status",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
};

export const useUpdateClause = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateClausePayload) => updateClause(data),
    onSuccess: (response) => {
      toast({
        title: response?.status ? "Success" : "Warning",
        description: response?.message || "Clause updated successfully",
        duration: 2000,
        variant: response?.status ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["clauses"] });
    },
    onError: (error: any) => {
      const errorResponse = error?.response?.data;
      toast({
        title: "Error",
        description: errorResponse?.message || "Failed to update clause",
        variant: "destructive",
        duration: 2000,
      });
    },
  });
};

export const useClauseById = (clauseId: string | undefined) => {
  return useQuery<ClauseDetailResponse>({
    queryKey: ["clause", clauseId],
    queryFn: () => {
      if (!clauseId) throw new Error("Clause ID is required");
      return getClauseById(clauseId);
    },
    enabled: !!clauseId,
  });
}; 