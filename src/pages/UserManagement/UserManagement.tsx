import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import ContentTable from "@/components/ContentTable";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { useUsers } from "@/hooks/useUsers";
import {
  useToggleRoleStatus,
  useToggleUserStatus,
} from "@/hooks/useToggleUserRole";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce } from "lodash";
import { set } from "date-fns";

const TAB_STORAGE_KEY = "userManagement.selectedTab";

const UserManagement = () => {
  const [tabValue, setTabValue] = useState(() => {
    return localStorage.getItem(TAB_STORAGE_KEY) || "Role Creation";
  });
  const [rolesPage, setRolesPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  // const limit = 10;
  const [roleSearchText, setRoleSearchText] = useState("");
  const [userSearchText, setUserSearchText] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("");

  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Update localStorage when tab changes
    localStorage.setItem(TAB_STORAGE_KEY, tabValue);
  }, [tabValue]);

  // If coming back from a route with state indicating which tab to show
  useEffect(() => {
    if (location.state?.selectedTab) {
      setTabValue(location.state.selectedTab);
      // Clean up the state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate]);

  const handleAddRole = () => {
    navigate("/user-management/role-creation", {
      state: { selectedTab: "Role Creation" },
    });
  };

  const handleAddUser = () => {
    navigate("/user-management-form", {
      state: { selectedTab: "User Creation" },
    });
  };

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useRoles(
    rolesPage,
    limit,
    roleSearchText,
    activeStatus.toLowerCase() === "all" ? "" : activeStatus
  );

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useUsers(
    usersPage,
    limit,
    userSearchText,
    activeStatus.toLowerCase() === "all" ? "" : activeStatus
  );

  const toggleRoleMutation = useToggleRoleStatus();
  const toggleUserMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();

  // const handleEditRole = (sno: string) => {
  //   // Handle edit role
  //   console.log("Edit role:", sno);
  // };
  const handleEditRole = (row: any) => {
    console.log("Edit role:", row);
    const role = transformedRolesData.find((item) => item.sno === row?.sno);
    console.log({ role });

    if (role) {
      // navigate(`/user-management/edit-role-creation/${role.id}`);
      navigate(`/user-management/edit-role-creation`, {
        state: {
          id: role.id,
          name: role.name,
          sno: role.sno,
          status: role.status,
        },
      });
    }
  };

  const handleEditUser = (row: any) => {
    console.log({ row });
    const user = transformedUsersData.find((item) => item.sno === row?.sno);
    if (user) {
      navigate("/user-management-form", {
        state: {
          userId: user.id,
          selectedTab: "User Creation",
        },
      });
    }
  };

  const handleDeleteUser = async (sno: string) => {
    console.log({ sno }, "----deleteUser");
    const user = transformedUsersData.find((item) => item.sno === sno);
    if (user) {
      try {
        setToggleLoadingId(sno);
        await deleteUserMutation.mutateAsync(user.id);
      } finally {
        setToggleLoadingId(null);
      }
    }
  };

  const handleToggleRoleStatus = async (sno: string) => {
    const role = transformedRolesData.find((item) => item.sno === sno);
    if (role) {
      try {
        setToggleLoadingId(sno);
        await toggleRoleMutation.mutateAsync(role.id);
      } finally {
        setToggleLoadingId(null);
      }
    }
  };

  const handleToggleUserStatus = async (sno: string) => {
    const user = transformedUsersData.find((item) => item.sno === sno);
    if (user) {
      try {
        setToggleLoadingId(sno);
        await toggleUserMutation.mutateAsync(user.id);
      } finally {
        setToggleLoadingId(null);
      }
    }
  };

  const handleUserPageChange = (newPage: number) => {
    setUsersPage(newPage);
  };

  const handleRolePageChange = (newPage: number) => {
    setRolesPage(newPage);
  };
  const handleLimitChangeRole = (value: string) => {
    const newLimit =
      value === "All" ? rolesData?.data?.meta?.total : parseInt(value, 10);

    setLimit(newLimit);

    setRolesPage(1); // Reset to first page
  };
  const handleLimitChangeUser = (value: string) => {
    const newLimit =
      value === "All" ? usersData?.data?.meta?.total : parseInt(value, 10);

    setLimit(newLimit);

    setUsersPage(1); // Reset to first page
  };
  const handleRoleSearchChange = debounce((e) => {
    setRoleSearchText(e.target.value);
  }, 500);

  const handleUserSearchChange = debounce((e) => {
    setUserSearchText(e.target.value);
  }, 500);

  // Transform roles data with safety checks
  const transformedRolesData = Array.isArray(rolesData?.data?.data)
    ? rolesData.data.data.map((role, index) => ({
        id: role?.id || "",
        sno: ((rolesPage - 1) * limit + index + 1).toString(),
        name: role?.name || "N/A",
        status: role?.isActive ?? false,
      }))
    : [];

  // Transform users data with safety checks
  const transformedUsersData = Array.isArray(usersData?.data?.data)
    ? usersData.data.data.map((user, index) => ({
        id: user?.id || "",
        sno: ((usersPage - 1) * limit + index + 1).toString(),
        username:
          `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A",
        role: user?.role?.name || "N/A",
        status: user?.isActive ?? false,
        firstName: user?.firstName || "",
        middleName: user?.middleName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        roleId: user?.role?.id || "",
      }))
    : [];

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">User Access Management</h1>
        </div>
        <Card>
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
            className="p-4"
          >
            <TabsList
              style={{
                border: "1px solid #D8D8D8",
                display: "flex",
                justifyContent: "space-between",
                maxWidth: "28%",
                backgroundColor: "#F3F3F3",
              }}
            >
              {["Role Creation", "User Creation"].map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  style={{
                    flex: 1,
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "16px",
                    fontWeight: tabValue === value ? "500" : "400",
                    color: tabValue === value ? "#00426E" : "#797878",
                  }}
                >
                  {value === "User Creation"
                    ? "User Creation"
                    : "Role Creation"}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className=" mt-10">
              {/* Row 1: Search Input + Button */}
              <div className="flex gap-4 mb-6">
                {tabValue === "Role Creation" && (
                  <>
                    <div className="flex w-[35%] gap-0.5">
                      <input
                        onChange={handleRoleSearchChange}
                        type="text"
                        placeholder="Search State"
                        className="px-3 py-2 border border-[#D8D8D8] rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
                      />
                    </div>

                    <div className="flex w-[15%] gap-0.5">
                      <Select onValueChange={handleLimitChangeRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select by Rows" />
                        </SelectTrigger>
                        <SelectContent
                          style={{ maxHeight: "30vh", overflowY: "scroll" }}
                        >
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-[15%] gap-0.5">
                      <Select onValueChange={setActiveStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder=" Filter by Status" />
                        </SelectTrigger>
                        <SelectContent
                          style={{ maxHeight: "30vh", overflowY: "scroll" }}
                        >
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>

                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {tabValue === "User Creation" && (
                  <>
                    <div className="flex w-[35%] gap-0.5">
                      <input
                        onChange={handleUserSearchChange}
                        type="text"
                        placeholder="Search Category"
                        className="px-3 py-2 border border-[#D8D8D8] rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
                      />
                    </div>

                    <div className="flex w-[15%] gap-0.5">
                      <Select onValueChange={handleLimitChangeUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select by Rows" />
                        </SelectTrigger>
                        <SelectContent
                          style={{ maxHeight: "30vh", overflowY: "scroll" }}
                        >
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-[15%] gap-0.5">
                      <Select onValueChange={setActiveStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder=" Filter by Status" />
                        </SelectTrigger>
                        <SelectContent
                          style={{ maxHeight: "30vh", overflowY: "scroll" }}
                        >
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>

                          <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </div>

            <TabsContent value="Role Creation" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  className="mb-4 bg-[#00426E] hover:bg-[#00426E]/90"
                  onClick={handleAddRole}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
              {isRolesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : isRolesError ? (
                <div className="text-center text-red-500 py-8">
                  Error loading roles. Please try again.
                </div>
              ) : (
                <div>
                  <ContentTable
                    data={transformedRolesData}
                    columns={rolesColumns}
                    showActions={true}
                    onEdit={handleEditRole}
                    onToggleStatus={handleToggleRoleStatus}
                    showDeleteAction={false}
                    currentPage={rolesPage}
                    totalPages={rolesData?.data?.meta?.totalPages || 1}
                    onPageChange={handleRolePageChange}
                    disableInternalPagination={true}
                    toggleLoadingId={toggleLoadingId}
                  />
                  {/* <div className="mt-2 text-sm text-gray-500 text-right">
                    Total Records: {rolesData?.data?.meta?.total || 0}
                  </div> */}
                </div>
              )}
            </TabsContent>
            <TabsContent value="User Creation" className="space-y-4">
              <div className="flex justify-end">
                <Button
                  className="mb-4 bg-[#00426E] hover:bg-[#00426E]/90"
                  onClick={handleAddUser}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
              {isUsersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : isUsersError ? (
                <div className="text-center text-red-500 py-8">
                  Error loading users. Please try again.
                </div>
              ) : (
                <div>
                  <ContentTable
                    data={transformedUsersData}
                    columns={usersColumns}
                    showActions={true}
                    showDeleteAction={true}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    onToggleStatus={handleToggleUserStatus}
                    currentPage={usersPage}
                    totalPages={usersData?.data?.meta?.totalPages || 1}
                    onPageChange={handleUserPageChange}
                    disableInternalPagination={true}
                    toggleLoadingId={toggleLoadingId}
                  />
                  {/* <div className="mt-2 text-sm text-gray-500 text-right">
                    Total Records: {usersData?.data?.meta?.total || 0}
                  </div> */}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

const rolesColumns = [
  { header: "Sr No.", accessorKey: "sno" },
  { header: "Name", accessorKey: "name" },
  { header: "Status", accessorKey: "status" },
];

const usersColumns = [
  { header: "Sr No.", accessorKey: "sno" },
  { header: "Username", accessorKey: "username" },
  { header: "Role", accessorKey: "role" },
  { header: "Active", accessorKey: "status" },
];

export default UserManagement;
