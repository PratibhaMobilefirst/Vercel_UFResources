import Layout from "@/components/Layout";
import TemplateList from "@/components/TemplateList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTemplateCards } from "@/hooks/useTemplateCards";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCategories } from "@/hooks/useCategories";
import { useStates } from "@/hooks/useStates";
import { debounce } from "lodash";

const getAttorneyTypeFromTab = (tab: string) => {
  switch (tab) {
    case "network-attorney":
      return "NetworkAttorney";
    case "campaign":
      return "Campaign";
    case "attorney-specific":
      return "AttorneySpecific";
    default:
      return "NetworkAttorney";
  }
};

const TemplateManagementPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("network-attorney");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const normalizedStateId = selectedStateId === "all" ? "" : selectedStateId;
  const normalizedCategoryId =
    selectedCategoryId === "all" ? "" : selectedCategoryId;

  const debouncedSetSearch = debounce((val: string) => {
    setDebouncedSearch(val);
  }, 500);

  const attorneyType = getAttorneyTypeFromTab(currentTab);

  const { data, isLoading, isError, refetch } = useTemplateCards(
    attorneyType,
    currentPage,
    perPage,
    normalizedStateId,
    normalizedCategoryId,
    debouncedSearch
  );

  const limit = 1000000;
  const [categoriesPage, setCategoriesPage] = useState(1);
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(categoriesPage, limit, "");

  const [statesPage, setStatesPage] = useState(1);
  const {
    data: statesData,
    isLoading: isStatesLoading,
    isError: isStatesError,
  } = useStates(statesPage, limit, "");

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab]);

  useEffect(() => {
    refetch();
  }, [
    attorneyType,
    currentPage,
    selectedStateId,
    selectedCategoryId,
    debouncedSearch,
  ]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const handleSearch = () => {
    setDebouncedSearch(searchQuery);
    setCurrentPage(1); // Reset to first page when searching
  };

  const templates = data?.data?.templateCards || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <Layout>
      <div className="container mx-auto p-1 max-w-full">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Template Management</h1>

          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <Tabs
              defaultValue="network-attorney"
              value={currentTab}
              onValueChange={handleTabChange}
              className="w-full md:max-w-md"
            >
              <TabsList className="w-full bg-gray-100 p-0 h-auto">
                <TabsTrigger
                  value="network-attorney"
                  className="flex-1 py-2 data-[state=active]:bg-[#00426E] data-[state=active]:text-white"
                >
                  Network Attorney
                </TabsTrigger>
                <TabsTrigger
                  value="campaign"
                  className="flex-1 py-2 data-[state=active]:bg-[#00426E] data-[state=active]:text-white"
                >
                  Campaign
                </TabsTrigger>
                <TabsTrigger
                  value="attorney-specific"
                  className="flex-1 py-2 data-[state=active]:bg-[#00426E] data-[state=active]:text-white"
                >
                  Attorney Specific
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <div className="relative w-full md:w-60">
                <Input
                  type="text"
                  placeholder="Search by document name"
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    if (value === "") {
                      setDebouncedSearch("");
                      setCurrentPage(1); // Reset to first page
                    }
                  }}
                  className="pl-3 pr-10"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
              <Button
                className="bg-[#00426E] hover:bg-[#003058]"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block">State</label>
              <Select onValueChange={setSelectedStateId}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent
                  style={{ maxHeight: "30vh", overflowY: "scroll" }}
                >
                  <SelectItem value="all">All States</SelectItem>
                  {statesData?.data?.data?.map((stateItem) => {
                    if (stateItem.stateName) {
                      return (
                        <SelectItem key={stateItem.id} value={stateItem.id}>
                          {stateItem.stateName}
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent
                  style={{ maxHeight: "30vh", overflowY: "scroll" }}
                >
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.data?.data?.map((categoryItem) => {
                    if (categoryItem.templateName) {
                      return (
                        <SelectItem
                          key={categoryItem.id}
                          value={categoryItem.templateName}
                        >
                          {categoryItem.templateName}
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/2 flex items-end justify-end">
              <Button
                className="bg-[#00426E] hover:bg-[#003058]"
                onClick={() => navigate("/template-management/create")}
              >
                Create Template Card
              </Button>
            </div>
          </div>

          <Tabs value={currentTab}>
            <TabsContent value="network-attorney" className="mt-0">
              <TemplateList
                templates={templates}
                isLoading={isLoading}
                isError={isError}
              />
            </TabsContent>
            <TabsContent value="campaign" className="mt-0">
              <TemplateList
                templates={templates}
                isLoading={isLoading}
                isError={isError}
              />
            </TabsContent>
            <TabsContent value="attorney-specific" className="mt-0">
              <TemplateList
                templates={templates}
                isLoading={isLoading}
                isError={isError}
              />
            </TabsContent>
          </Tabs>

          {templates.length > 0 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TemplateManagementPage;
