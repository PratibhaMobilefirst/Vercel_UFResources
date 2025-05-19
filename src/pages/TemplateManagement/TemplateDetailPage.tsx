import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import ContentTable from "@/components/ContentTable";
import { useFetchStatesTemplate } from "@/hooks/useTemplateCards";
import { formatDate } from "@/utils/dateFormat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStates } from "@/hooks/useStates";

interface Template {
  id: string;
  name: string;
  category: string;
  createdBy: string;
  createdDate: string;
}

interface StateVersion {
  sno: string;
  stateName: string;
  version: string;
  date: string;
  updatedBy: string;
}

const TemplateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the passed state (template data)
  const templateCardId = location.state?.id;
  console.log({ templateCardId });

  const [template, setTemplate] = useState<Template | null>(null);
  const [stateVersions, setStateVersions] = useState<StateVersion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // We'll dynamically set this
  const [selectedState, setSelectedState] = useState("all");
  const limitState = 50;
  const [rolesPage, setRolesPage] = useState(1);
  const { data: statesData } = useStates(rolesPage, limitState);
  console.log({ selectedState });

  const { data, isLoading, isError, error } = useFetchStatesTemplate(
    id,
    currentPage,
    10,
    selectedState === "all" ? null : selectedState
  );
  console.log({ data }, "-------templateDetailPage-------------");

  // Map API response to the table format
  useEffect(() => {
    if (data) {
      const mappedData = data.data.map((item: any, index: number) => ({
        sno: `00${index + 1}`,
        templateCardId: item.documentTemplate?.templateCardId,
        stateId: item.documentTemplate?.stateId,
        stateName: item.state.stateName,
        date: formatDate(item.createdAt),
        updatedBy: item.documentTemplate.updatedBy || "N/A",
      }));

      setStateVersions(mappedData);
      setTotalPages(data.meta.totalPages);
    }
  }, [data]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDocument = (row: any) => {
    console.log({ row });
    navigate(`/template-management-single/${id}`, {
      state: { templateCardId: row?.templateCardId, stateId: row?.stateId },
    });
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    // In a real implementation, you would fetch the versions for this state
  };

  const tableColumns = [
    { header: "S.no", accessorKey: "sno" },
    { header: "State Name", accessorKey: "stateName" },
    { header: "Date", accessorKey: "date" },
    { header: "Updated By", accessorKey: "updatedBy" },
  ];
  if (isLoading)
    return (
      <>
        <Layout>
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
          </div>
        </Layout>
      </>
    );
  if (isError)
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <h1 className="text-2xl font-semibold text-gray-500">
            Error loading states. Please try again.
          </h1>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="container mx-auto p-1 max-w-full">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/template-management")}
              className="mr-4"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
            {/* <h1 className="text-2xl font-bold">{template?.name || "N/A"}</h1> */}
          </div>

          {/* Template metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Created Date</p>
              {/* <p className="font-medium">{template.createdDate || "N/A"}</p> */}
            </div>
          </div>

          {/* List of States */}

          <h2 className="text-lg font-semibold mb-4">List of States</h2>
          <div className="flex gap-4 mb-4">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="all">All States</SelectItem>
                {statesData?.data?.data?.map((stateItem) => {
                  if (stateItem.stateName) {
                    return (
                      <SelectItem
                        key={stateItem.id}
                        value={stateItem.stateName}
                      >
                        {stateItem.stateName}
                      </SelectItem>
                    );
                  }
                  return null;
                })}
              </SelectContent>
            </Select>
          </div>

          {/* States versions table using ContentTable */}

          {stateVersions.length === 0 ? (
            <>
              <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-semibold text-gray-500">
                  No Data Found
                </h1>
              </div>
            </>
          ) : (
            <>
              <ContentTable
                data={stateVersions}
                columns={tableColumns}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disableInternalPagination={true}
                showActions={true}
                showDeleteAction={false}
                onEdit={handleViewDocument}
                useEyeIcon={true}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TemplateDetailPage;
