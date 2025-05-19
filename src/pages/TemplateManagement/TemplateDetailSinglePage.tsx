import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, Loader2 } from "lucide-react";
import ContentTable from "@/components/ContentTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFetchDocuments } from "@/hooks/useTemplateCards";
import { formatDate } from "date-fns";
import moment from "moment";
interface Template {
  id: string;
  name: string;
  category: string;
  createdBy: string;
  createdDate: string;
}

interface StateVersion {
  sno: string;
  version: string;
  date: string;
  updatedBy: string;
}

const TemplateDetailSinglePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log({ id });
  const templateCardId = location.state?.templateCardId;
  const stateId = location.state?.stateId;
  console.log({ templateCardId, stateId });

  const [template, setTemplate] = useState<Template | null>(null);

  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("all");
  const [stateVersions, setStateVersions] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [templateData, setTemplateData] = useState<any>(null);

  const { data, isLoading, isError, error, refetch } = useFetchDocuments(
    templateCardId,
    stateId,
    currentPage,
    10
  );
  console.log({ data });

  useEffect(() => {
    if (data?.data.data) {
      const mappedData = data?.data.data.map((item: any, index: number) => ({
        sno: `00${index + 1}`,
        id: item.id,
        documentName: item.documentName,
        version: item.version,
        createdAt: moment(item?.state?.addedDate).format("DD.MM.YYYY"),
        updatedAt: moment(item?.state?.updatedAt).format("DD.MM.YYYY"),
        updatedBy: item?.updatedBy || "N/A",
        status: item?.status === true,
      }));

      setTemplateData(mappedData);
      setTotalPages(data?.data.meta.totalPages);
    }
  }, [data]);

  useEffect(() => {
    // For demo purposes, we'll use mock data
    setTemplate({
      id: id || "1",
      name: "Simple Will Document",
      category: "Will",
      createdBy: "John Doe",
      createdDate: "18.12.2024",
    });

    setStates(["New York", "California", "Texas", "Florida"]);

    // Mock state versions data
    setStateVersions(
      Array(10)
        .fill(null)
        .map((_, i) => ({
          sno: `00${i + 1}`,
          version: `New York`,
          date: "1.2.2024",
          updatedBy: "John Doe",
        }))
    );
  }, [id]);

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    // In a real implementation, you would fetch the versions for this state
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real implementation, you would fetch the data for this page
  };

  const handleViewDocument = (id: string) => {
    setShowPreview(true);
  };

  const tableColumns = [
    { header: "Document Name", accessorKey: "documentName" },
    { header: "Version", accessorKey: "version" },
    { header: "Added Date", accessorKey: "createdAt" },
    { header: "Updated Date", accessorKey: "updatedAt" },
    { header: "Status", accessorKey: "status" },
    { header: "Updated by", accessorKey: "updatedBy" },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      </Layout>
    );
  }

  if (!template) {
    return <div>Loading...</div>;
  }

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
            <h1 className="text-2xl font-bold">{template.name}</h1>
          </div>

          {/* Template metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium">{template.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created Date</p>
              <p className="font-medium">{template.createdDate}</p>
            </div>
          </div>

          {/* List of States */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">List of States</h2>
            <div className="flex gap-4 mb-4">
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-60">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem
                      key={state}
                      value={state.toLowerCase().replace(/\s+/g, "")}
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* States versions table using ContentTable */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <ContentTable
              data={templateData || []}
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
          )}

          {/* Document Preview Dialog */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="max-w-3xl h-[80vh] p-0 overflow-hidden">
              <div className="p-4 border-b flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(false)}
                  className="mr-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <DialogTitle className="text-xl font-medium">
                  Preview Document
                </DialogTitle>
              </div>
              <div className="p-6 overflow-y-auto h-full">
                <h3 className="text-xl font-semibold mb-4">{template.name}</h3>
                <div className="prose max-w-none">
                  <p>
                    Quis aute irure date to reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure date to reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Quis aute irure date to reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Quis autem(Will Document) vel eum iure reprehenderit qui in
                    ea voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est
                    laborum.
                  </p>
                  <p>
                    Quis autem(Will Document) vel eum iure reprehenderit qui in
                    ea voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident,
                    sunt in culpa qui officia deserunt mollit anim id est
                    laborum. reprehenderit in voluptate velit esse cillum dolore
                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                    non proident, sunt in culpa qui officia deserunt mollit anim
                    id est laborum. Quis autem vel eum iure reprehenderit qui in
                    ea voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur.
                  </p>
                  <p>
                    nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default TemplateDetailSinglePage;
