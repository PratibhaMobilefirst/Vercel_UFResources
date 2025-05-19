import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import ContentTable from "@/components/ContentTable";
import CategoryDialog from "@/components/CategoryDialog";
import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useStates } from "@/hooks/useStates";
import {
  useToggleStateStatus,
  useToggleCategoryStatus,
} from "@/hooks/useToggleStatus";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { debounce } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContentManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    templateName: string;
  } | null>(null);
  const [tabValue, setTabValue] = useState("states");
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [statesPage, setStatesPage] = useState(1);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);
  const [categorySearchText, setCategorySearchText] = useState("");
  const [stateSearchText, setStateSearchText] = useState("");
  const [limit, setLimit] = useState(10);
  const [activeState, setActiveState] = useState<string>("");
  console.log({ activeState }, "----activeState");
  const filterState = activeState.toLowerCase() === "all" ? "" : activeState;

  // const limit = 10;

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(categoriesPage, limit, categorySearchText, filterState);

  const {
    data: statesData,
    isLoading: isStatesLoading,
    isError: isStatesError,
  } = useStates(statesPage, limit, stateSearchText, filterState);
  const toggleStateMutation = useToggleStateStatus();
  const toggleCategoryMutation = useToggleCategoryStatus();
  const deleteCategoryMutation = useDeleteCategory();

  const handleEdit = (row: any) => {
    console.log(row?.id);
    const category = transformedCategoryData.find(
      (item) => item.id === row?.id
    );
    if (category) {
      setSelectedCategory({ id: category.id, templateName: category.category });
      setDialogMode("edit");
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setToggleLoadingId(id);
      await deleteCategoryMutation.mutateAsync(id);
    } finally {
      setToggleLoadingId(null);
    }
  };

  const handleToggleStateStatus = async (sno: string) => {
    const state = transformedStatesData.find((item) => item.sno === sno);
    if (state) {
      try {
        setToggleLoadingId(sno);
        await toggleStateMutation.mutateAsync(state.id);
      } finally {
        setToggleLoadingId(null);
      }
    }
  };

  const handleToggleCategoryStatus = async (sno: string) => {
    const category = transformedCategoryData.find((item) => item.sno === sno);
    if (category) {
      try {
        setToggleLoadingId(sno);
        await toggleCategoryMutation.mutateAsync(category.id);
      } finally {
        setToggleLoadingId(null);
      }
    }
  };

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setSelectedCategory(null);
    setIsDialogOpen(true);
  };

  const handleCategoryPageChange = (newPage: number) => {
    setCategoriesPage(newPage);
  };

  const handleStatePageChange = (newPage: number) => {
    setStatesPage(newPage);
  };
  const handleCategorySearchChange = debounce((e) => {
    setCategorySearchText(e.target.value);
  }, 500);

  const handleStateSearchChange = debounce((e) => {
    setStateSearchText(e.target.value);
  }, 500);
  const handleLimitChangeCategory = (value: string) => {
    const newLimit =
      value === "All" ? categoriesData?.data?.meta?.total : parseInt(value, 10);

    setLimit(newLimit);
    setCategoriesPage(1); // Reset to first page
  };
  const handleLimitChangeState = (value: string) => {
    const newLimit =
      value === "All" ? statesData?.data?.meta?.total : parseInt(value, 10);

    setLimit(newLimit);

    setStatesPage(1); // Reset to first page
  };

  // Transform categories data with safety checks
  const transformedCategoryData = Array.isArray(categoriesData?.data?.data)
    ? categoriesData.data.data.map((category, index) => ({
        id: category?.id || "",
        sno: ((categoriesPage - 1) * limit + index + 1).toString(),
        category: category?.templateName || "N/A",
        addedDate: category?.addedDate
          ? new Date(category.addedDate).toLocaleDateString()
          : "N/A",
        status: category?.status ?? false,
      }))
    : [];

  // Transform states data with safety checks
  const transformedStatesData = Array.isArray(statesData?.data?.data)
    ? statesData.data.data.map((state, index) => ({
        id: state?.id || "",
        sno: ((statesPage - 1) * limit + index + 1).toString(),
        state: state?.stateName || "N/A",
        stateCode: state?.stateCode || "N/A",
        addedDate: state?.addedDate
          ? new Date(state.addedDate).toLocaleDateString()
          : "N/A",
        status: state?.status ?? false,
      }))
    : [];

  return (
    <Layout>
      <div className="space-y-4">
        <Card>
          <div className="flex justify-between items-center m-6">
            <h1
              className="text-4xl md:text-xl font-medium roboto-font"
              style={{ color: "#000000", textShadow: "1px 1px 2px #F0F0F0" }}
            >
              Content Management System
            </h1>
          </div>
          <Tabs
            value={tabValue}
            onValueChange={(value) => setTabValue(value)}
            className="py-2 px-6"
          >
            <TabsList
              style={{
                border: "1px solid #D8D8D8",
                display: "flex",
                justifyContent: "space-between",
                maxWidth: "25%",
                backgroundColor: "#F3F3F3",
              }}
            >
              {["states", "document"].map((value) => (
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
                  {value === "document" ? "Category" : "States"}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className=" mt-10">
              {/* Row 1: Search Input + Button */}
              <div className="flex gap-4 mb-6">
                {tabValue === "states" && (
                  <>
                    <div className="flex w-[35%] gap-0.5">
                      <input
                        onChange={handleStateSearchChange}
                        type="text"
                        placeholder="Search State"
                        className="px-3 py-2 border border-[#D8D8D8] rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
                      />
                    </div>

                    <div className="flex w-[15%] gap-0.5">
                      <Select onValueChange={handleLimitChangeState}>
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
                      <Select onValueChange={setActiveState}>
                        <SelectTrigger>
                          <SelectValue placeholder=" Filter by Status" />
                        </SelectTrigger>
                        <SelectContent
                          style={{ maxHeight: "30vh", overflowY: "scroll" }}
                        >
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>

                          <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {tabValue === "document" && (
                  <>
                    <div className="flex w-[35%] gap-0.5">
                      <input
                        onChange={handleCategorySearchChange}
                        type="text"
                        placeholder="Search Category"
                        className="px-3 py-2 border border-[#D8D8D8] rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
                      />
                    </div>

                    <div className="flex w-[15%] gap-0.5">
                      <Select onValueChange={handleLimitChangeCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="options" />
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
                      <Select onValueChange={setActiveState}>
                        <SelectTrigger>
                          <SelectValue placeholder="status" />
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

            <TabsContent value="states" className="space-y-4 mt-[90px]">
              {isStatesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : isStatesError ? (
                <div className="text-center text-red-500 py-8">
                  Error loading states. Please try again.
                </div>
              ) : (
                <div>
                  {transformedStatesData.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <h1 className="text-2xl font-semibold text-gray-500">
                        No Data Found
                      </h1>
                    </div>
                  ) : (
                    <ContentTable
                      data={transformedStatesData}
                      columns={statesColumns}
                      showActions={false}
                      onToggleStatus={handleToggleStateStatus}
                      toggleLoadingId={toggleLoadingId}
                      currentPage={statesPage}
                      totalPages={statesData?.data?.meta?.totalPages || 1}
                      onPageChange={handleStatePageChange}
                      disableInternalPagination={true}
                    />
                  )}
                </div>
              )}
            </TabsContent>
            <TabsContent value="document" className="space-y-4">
              {tabValue === "document" && (
                <div className="flex justify-end">
                  <CategoryDialog
                    open={isDialogOpen}
                    setOpen={setIsDialogOpen}
                    mode={dialogMode}
                    initialData={selectedCategory}
                  />
                  {!isDialogOpen && (
                    <Button
                      className="mb-4 bg-[#00426E] hover:bg-[#00426E]/90"
                      onClick={handleOpenAddDialog}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  )}
                </div>
              )}
              {isCategoriesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : isCategoriesError ? (
                <div className="text-center text-red-500 py-8">
                  Error loading categories. Please try again.
                </div>
              ) : (
                <div>
                  {transformedCategoryData.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <h1 className="text-2xl font-semibold text-gray-500">
                        No Data Found
                      </h1>
                    </div>
                  ) : (
                    <ContentTable
                      data={transformedCategoryData}
                      columns={documentsColumns}
                      showActions={true}
                      onEdit={handleEdit}
                      onDelete={(sno) => {
                        const item = transformedCategoryData.find(
                          (item) => item.sno === sno
                        );
                        if (item) handleDelete(item.id);
                      }}
                      onToggleStatus={handleToggleCategoryStatus}
                      toggleLoadingId={toggleLoadingId}
                      currentPage={categoriesPage}
                      totalPages={categoriesData?.data?.meta?.totalPages || 1}
                      onPageChange={handleCategoryPageChange}
                      disableInternalPagination={true}
                    />
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

const statesColumns = [
  { header: "S.no", accessorKey: "sno" },
  { header: "State", accessorKey: "state", sortable: true },
  { header: "State Code", accessorKey: "stateCode" },
  {
    header: "Added Date",
    accessorKey: "addedDate",
    sortable: true,
    isDate: true,
  },
  { header: "Status", accessorKey: "status" },
];

const documentsColumns = [
  { header: "S.no", accessorKey: "sno" },
  { header: "Category", accessorKey: "category", sortable: true },
  {
    header: "Added Date",
    accessorKey: "addedDate",
    sortable: true,
    isDate: true,
  },
  { header: "Status", accessorKey: "status" },
];

export default ContentManagement;
