import Layout from "@/components/Layout";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Edit, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PreviewClauseModal } from "./PreviewClauseModal";
import { CreateClauseForm } from "@/components/CreateClauseForm";
import ContentTable from "@/components/ContentTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useClauses, useToggleClauseStatus } from "@/hooks/useClauses";
import { ClauseItem } from "@/api/clausesApi";
import { useRoles } from "@/hooks/useRoles";
import { useStates } from "@/hooks/useStates";

interface ClauseData {
  id: string;
  clauseName: string;
  templateCategory: string;
  state: string;
  status: boolean;
  content: string;
  createdDate: string;
  lastModifiedDate: string;
  modifiedBy: string;
}

export function ClauseManagementPage() {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<ClauseData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editClauseId, setEditClauseId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  // const limit = 10;
  const limitRole = 1000000;
  const limitState = 50;
  const [rolesPage, setRolesPage] = useState(1);
  const [state, setState] = useState("");
  const [role, setRole] = useState("all");
  const [limit, setLimit] = useState(10);

  const { data: rolesData } = useRoles(rolesPage, limitRole);
  console.log({ rolesData });
  const { data: statesData } = useStates(rolesPage, limitState);
  console.log({ statesData });

  // Use the status from activeTab for filtering
  const status = activeTab === "active" ? true : false;

  const {
    data: clausesData,
    isLoading: isClausesLoading,
    isError: isClausesError,
  } = useClauses(page, limit, status);

  const toggleClauseMutation = useToggleClauseStatus();

  // Transform API data to table format
  const tableData = (clausesData?.data?.data || []).map((item, idx) => ({
    id: item.id,
    sno: (idx + 1).toString(),
    clauseName: item.clauseName,
    templateCategory: item.templateCategory.templateName,
    state: item.state.stateName,
    status: item.status,
    createdDate: new Date(item.createdAt).toLocaleDateString(),
    lastModifiedDate: new Date(item.updatedAt).toLocaleDateString(),
    content: item.content || "", // Content may be fetched separately
    modifiedBy: "Admin", // This might need to come from the API
  }));

  // Define columns for ContentTable
  const columns = [
    { header: "S.no", accessorKey: "sno" },
    { header: "Clause Name", accessorKey: "clauseName" },
    { header: "Category", accessorKey: "templateCategory" },
    { header: "State", accessorKey: "state" },
    { header: "Status", accessorKey: "status" },
    { header: "Add", accessorKey: "add" },
    { header: "Preview", accessorKey: "preview" },
    { header: "Edit", accessorKey: "edit" },
  ];

  // Handlers for actions
  const handleAdd = (row: any) => {
    // Implement add logic here
    alert(`Add clause: ${row.clauseName}`);
  };

  const handleEdit = (sno: string) => {
    const clause = tableData.find((item) => item.sno === sno);
    if (clause) {
      setEditClauseId(clause.id);
      setShowCreateForm(true);
    }
  };

  const handleToggleStatus = async (sno: string) => {
    const clause = tableData.find((item) => item.sno === sno);
    if (clause) {
      try {
        setToggleLoadingId(sno);
        await toggleClauseMutation.mutateAsync(clause.id);
      } finally {
        setToggleLoadingId(null);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePreview = (clause: ClauseData) => {
    setSelectedClause(clause);
    setIsPreviewOpen(true);
  };

  // Custom row rendering for Add, Preview, Edit columns
  const dataWithActions = tableData.map((row) => ({
    ...row,
    add: (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-blue-600"
        onClick={() => handleAdd(row)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    ),
    preview: (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handlePreview(row)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
    edit: (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => handleEdit(row.sno)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    ),
  }));

  if (showCreateForm) {
    return (
      <Layout>
        <CreateClauseForm 
          onBack={() => {
            setShowCreateForm(false);
            setEditClauseId(null);
          }} 
          clauseId={editClauseId || undefined}
          isEditing={!!editClauseId}
        />
      </Layout>
    );
  }

  const handleLimitChange = (value: string) => {
    const newLimit =
      value === "All" ? clausesData?.data?.meta?.total : parseInt(value, 10);

    setLimit(newLimit);

    setPage(1); // Reset to first page
  };

  return (
    <Layout>
      <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader className="border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold" style={{ color: "#000" }}>
                Clause Management
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Search Bar */}
              <div className="w-full flex flex-col gap-2">
                {/* <label className="text-sm font-medium text-[#222] mb-1">Search</label> */}
                <div className="flex w-[45%] gap-0.5">
                  <input
                    type="text"
                    placeholder="Search"
                    className="px-3 py-2 border border-[#D8D8D8] rounded-l-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
                  />
                  <Button
                    variant="default"
                    className="bg-[#00426E] hover:bg-[#003355] text-white rounded-r-md rounded-l-none"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "active" | "inactive")
                }
                className="w-full"
              >
                <TabsList
                  style={{
                    border: "1px solid #D8D8D8",
                    display: "flex",
                    justifyContent: "flex-start",
                    maxWidth: 320,
                    backgroundColor: "#F3F3F3",
                    marginBottom: 0,
                  }}
                >
                  <TabsTrigger
                    value="active"
                    style={{
                      flex: 1,
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                      fontWeight: activeTab === "active" ? "500" : "400",
                      color: activeTab === "active" ? "#00426E" : "#797878",
                    }}
                  >
                    Active Clause
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactive"
                    style={{
                      flex: 1,
                      fontFamily: "Roboto, sans-serif",
                      fontSize: "16px",
                      fontWeight: activeTab === "inactive" ? "500" : "400",
                      color: activeTab === "inactive" ? "#00426E" : "#797878",
                    }}
                  >
                    Inactive Clause
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filters and Create Button */}
              <div className="flex flex-wrap items-end justify-between gap-4 mt-2">
                <div className="flex gap-8 w-full md:w-auto">
                  <div className="flex flex-col w-48">
                    <label className="text-sm font-medium text-[#222] mb-1">
                      State
                    </label>
                    <Select onValueChange={setState}>
                      <SelectTrigger className="w-full border-[#D8D8D8]">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent
                        style={{ maxHeight: "30vh", overflowY: "scroll" }}
                      >
                        <SelectItem value="all">All States</SelectItem>
                        {statesData?.data?.data?.map((roleItem) => {
                          if (roleItem.stateName) {
                            return (
                              <SelectItem
                                key={roleItem.id}
                                value={roleItem.stateName}
                              >
                                {roleItem.stateName}
                              </SelectItem>
                            );
                          }
                          return null;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-48">
                    <label className="text-sm font-medium text-[#222] mb-1">
                      Category
                    </label>
                    <Select onValueChange={setRole}>
                      <SelectTrigger className="w-full border-[#D8D8D8]">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent
                        style={{ maxHeight: "30vh", overflowY: "scroll" }}
                      >
                        <SelectItem value="all">All Roles</SelectItem>
                        {rolesData?.data?.data?.map((roleItem) => {
                          if (roleItem.name) {
                            return (
                              <SelectItem
                                key={roleItem.id}
                                value={roleItem.name}
                              >
                                {roleItem.name}
                              </SelectItem>
                            );
                          }
                          return null;
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col w-48 mt-6">
                    {/* <label className="text-sm font-medium text-[#222] mb-1">
                      Category
                    </label> */}
                    <Select onValueChange={handleLimitChange}>
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
                </div>
                <Button
                  className="bg-[#00426E] hover:bg-[#003355] text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
                  onClick={() => setShowCreateForm(true)}
                >
                  <Plus className="h-4 w-4" /> Create Clause
                </Button>
              </div>

              {/* Table */}
              {isClausesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : isClausesError ? (
                <div className="text-center text-red-500 py-8">
                  Error loading clauses. Please try again.
                </div>
              ) : (
                <ContentTable
                  data={dataWithActions}
                  columns={columns}
                  showActions={false}
                  onToggleStatus={handleToggleStatus}
                  toggleLoadingId={toggleLoadingId}
                  currentPage={page}
                  totalPages={clausesData?.data?.meta?.totalPages || 1}
                  onPageChange={handlePageChange}
                  disableInternalPagination={true}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedClause && (
        <PreviewClauseModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          clauseData={{
            createdDate: selectedClause.createdDate,
            lastModifiedDate: selectedClause.lastModifiedDate,
            modifiedBy: selectedClause.modifiedBy,
            clauseName: selectedClause.clauseName,
            content: selectedClause.content,
          }}
        />
      )}
    </Layout>
  );
}

export default ClauseManagementPage;
