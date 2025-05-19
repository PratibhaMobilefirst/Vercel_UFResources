import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Eye,
  Loader2,
  Loader,
} from "lucide-react";
import {
  useAttorneys,
  useUpdateAttorneyRole,
  useUpdatePrivateAttorney,
  useUpdateStatus,
} from "../hooks/useAttorneys";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { useToast } from "@/hooks/use-toast";

import EditRole from "../assets/img/Notification.svg";
import EyeImg from "../assets/img/eye.svg";
import Vector from "../assets/img/Group 37878.svg";
// Add interface for attorney data
interface Attorney {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
  status: boolean;
  isPrivateAttorney: boolean;
  role: {
    name: string;
  };
}

// Add interface for API response
interface AttorneysResponse {
  data: Attorney[];
  meta: {
    totalPages: number;
  };
}

const ITEMS_PER_PAGE = 10;

const AttorneyTable = ({
  searchTerm,
  state,
  city,
  role,
  limitRow,
  statusValue,
  privateAttorneyValue,
}: {
  searchTerm: string;
  state: string;
  city: string;
  role: string;
  limitRow: number;
  statusValue: string;
  privateAttorneyValue;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useAttorneys({
    page: currentPage,
    limit: limitRow,
    searchTerm,
    state,
    city,
    role,
    statusValue,
    privateAttorneyValue,
  }) as {
    data: AttorneysResponse;
    isLoading: boolean;
    isError: boolean;
    error: Error;
    refetch: () => void;
  };

  console.log({ data });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAttorney, setSelectedAttorney] = useState<any>(null);

  const [newRole, setNewRole] = useState<string>("");
  // console.log({ newRole });
  const navigate = useNavigate();
  const limit = 1000000;
  const [rolesPage, setRolesPage] = useState(1);
  const { toast } = useToast();
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, state, city, role, limit]);

  const { mutate: updateStatusMutation } = useUpdateStatus();
  const { mutate: updatePrivateAttorneyMutation } = useUpdatePrivateAttorney();
  const updateRoleMutation = useUpdateAttorneyRole();
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useRoles(rolesPage, limit);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  if (isError) return <div>Error: {error?.message}</div>;

  const totalPages = (data as any)?.data?.meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditRole = (attorney: any) => {
    setSelectedAttorney(attorney);
    // Find the role ID that matches the attorney's role name
    const roleId = rolesData?.data?.data?.find(
      (role) => role.name === attorney.role?.name
    )?.id;
    setNewRole(roleId || ""); // Set the role ID instead of role name
    setEditDialogOpen(true);
  };

  const handleViewProfile = (attorney: any) => {
    navigate(`/attorney-detail/${attorney.id}`, { state: { attorney } });
  };

  const handleStatusChange = (attorneyId: string, status: boolean) => {
    console.log({ attorneyId, status });
    updateStatusMutation(
      { attorneyId, status },
      {
        onSuccess: (data: any) => {
          // Refetch the attorneys after updating private attorney flag
          toast({
            title: "Success",
            description: data.message || "Attorney status updated successfully", // API message
            variant: "default",
            duration: 2000,
          });
          refetch();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message || "Failed to update status";
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
            duration: 2000,
          });
        },
      }
    );
  };

  const handlePrivateAttorneyChange = (
    attorneyId: string,
    privateAttorney: boolean
  ) => {
    updatePrivateAttorneyMutation(
      { attorneyId, privateAttorney },
      {
        onSuccess: (data: any) => {
          // Refetch the attorneys after updating private attorney flag
          toast({
            title: "Success",
            description:
              data.message || "Private attorney flag updated successfully", // API message
            variant: "default",
            duration: 2000,
          });
          refetch();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Failed to update private attorney status";
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
            duration: 2000,
          });
        },
      }
    );
  };

  const handleSaveRole = () => {
    if (selectedAttorney && newRole) {
      updateRoleMutation.mutate(
        { attorneyId: selectedAttorney.id, role: newRole },
        {
          onSuccess: () => {
            setEditDialogOpen(false);
            refetch(); // Refresh the list of attorneys
          },
        }
      );
    }
  };

  return (
    <>
      {(data as any)?.data?.data?.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <h1 className="text-2xl font-semibold text-gray-500">
            No Attorneys Found
          </h1>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col min-h-[500px]">
            <div className="flex-grow">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F2FAFF]">
                    <TableHead className="text-[#035C98] font-medium text-left px-2 py-3">
                      S.no
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-left text-nowrap px-2 py-3 ">
                      Attorney Name
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-left px-2 py-3">
                      Email
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-left px-2 py-3">
                      State
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-left px-2 py-3">
                      Role
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-nowrap text-left px-2 py-3">
                      Edit Role
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-left px-2 py-3">
                      Status
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium  text-nowrap text-left px-2 py-3">
                      Private Attorney
                    </TableHead>
                    <TableHead className="text-[#035C98] font-medium text-left text-nowrap px-2 py-3">
                      View Profile
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data as any)?.data?.data?.map((attorney, index) => (
                    <TableRow key={attorney.id}>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        {attorney.firstName} {attorney.lastName}
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        {attorney.email}
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        {attorney.state?.stateName || "N/A"}
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        {attorney.role?.name || "N/A"}
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 p-0"
                            onClick={() => handleEditRole(attorney)}
                          >
                            {/* <Edit className="h-4 w-4" /> */}
                            <img src={EditRole} alt="EditRole" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        <div className="flex justify-center">
                          <Switch
                            checked={attorney.status}
                            onCheckedChange={() =>
                              handleStatusChange(attorney.id, !attorney.status)
                            }
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        <div className="flex justify-center">
                          <Switch
                            checked={attorney.isPrivateAttorney}
                            onCheckedChange={() =>
                              handlePrivateAttorneyChange(
                                attorney.id,
                                !attorney.isPrivateAttorney
                              )
                            }
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-[#374151] text-left px-2 py-3">
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 p-0"
                            onClick={() => handleViewProfile(attorney)}
                          >
                            <img src={EyeImg} alt="Eye" />
                            {/* <Eye className="h-4 w-4" /> */}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t border-[#E5E7EB] w-full">
              <div className="flex justify-between items-center w-full px-4 py-3">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border border-[#D1D5DB] bg-white text-[#374151] hover:bg-gray-50 px-6 py-2 text-sm font-medium rounded"
                >
                  Previous
                </Button>

                <span className="text-sm text-[#6B7280]">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="border border-[#D1D5DB] bg-white text-[#374151] hover:bg-gray-50 px-6 py-2 text-sm font-medium rounded"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Edit Role Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="max-w-lg p-6 bg-white border border-gray-200 rounded-[40px]">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <img src={Vector} alt="" className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">
                      Edit Network Attorney Role
                    </h3>
                  </div>
                </DialogHeader>

                <div className="px-4 pt-4 pb-0 ">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Left: Name + State in nested grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Name</div>
                        <div className="font-bold text-base">
                          {selectedAttorney?.firstName || "N/A"}{" "}
                          {selectedAttorney?.lastName || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">State</div>
                        <div className="font-bold text-base">
                          {selectedAttorney?.state?.stateName || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Right: Email ID */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Email ID</div>
                      <div
                        className="font-bold text-base line-clamp-2 break-words"
                        title={selectedAttorney?.email || "N/A"}
                      >
                        {selectedAttorney?.email || "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* Role Dropdown */}
                  <div className="mb-2">
                    <label className="block text-sm mb-3">Role</label>
                    <Select onValueChange={setNewRole} value={newRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Role">
                          {rolesData?.data?.data?.find(
                            (role) => role.id === newRole
                          )?.name || "Select Role"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        style={{ maxHeight: "30vh", overflowY: "scroll" }}
                      >
                        {rolesData?.data?.data?.map((roleItem) =>
                          roleItem.name ? (
                            <SelectItem key={roleItem.id} value={roleItem.id}>
                              {roleItem.name}
                            </SelectItem>
                          ) : null
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveRole}
                    className="bg-[#00426E] text-white hover:bg-blue-900"
                  >
                    {updateRoleMutation.status === "pending" ? (
                      <Loader className="w-5 h-5 mr-2" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </>
      )}
    </>
  );
};

export default AttorneyTable;
