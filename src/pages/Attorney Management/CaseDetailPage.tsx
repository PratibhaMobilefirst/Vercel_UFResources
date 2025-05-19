import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
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
  ChevronLeft,
  Eye,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useCaseDetails } from "@/hooks/useAttorneys";
import { DocumentPreviewDialog } from "@/components/DocumentPreviewDialog";
import { formatDate } from "@/utils/dateFormat";

const CaseDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { attorneyId, caseId } = useParams();
  const {
    data: caseData,
    isLoading,
    isError,
  } = useCaseDetails(attorneyId!, caseId!);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (column: string) => {
    // Handle sorting logic here
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleHistoryToggle = (documentId: string) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(documentId)) {
        newExpandedRows.delete(documentId); // Collapse row if already expanded
      } else {
        newExpandedRows.add(documentId); // Expand row
      }
      return newExpandedRows;
    });
  };

  if (isLoading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  if (isError || !caseData)
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <h1 className="text-2xl font-semibold text-gray-500">
            Error loading case details
          </h1>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6">
        <Button
          variant="ghost"
          className="mb-6 text-[#00426E] font-medium flex items-center gap-2"
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4" />
          Case Details
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Attorney Name</p>
            <p className="font-medium">
              {caseData.attorney.firstName || "N/A"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="font-medium">{caseData.attorney.email || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">State</p>
            <p className="font-medium">{caseData?.state?.stateName || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">City</p>
            <p className="font-medium">{caseData?.attorney.city || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="font-medium">{caseData?.attorney.role || "N/A"}</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Case Name</p>
            <p className="font-medium">{caseData?.caseName || "N/A"}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            {caseData?.documents.length > 0 && (
              <TableHeader>
                <TableRow className="bg-[#E7F5FF]">
                  <TableHead className="text-[#00426E] cursor-pointer">
                    <div className="flex items-center">S.no</div>
                  </TableHead>
                  <TableHead className="text-[#00426E] cursor-pointer">
                    <div className="flex items-center">Document Name</div>
                  </TableHead>
                  <TableHead className="text-[#00426E]">
                    Document Type
                  </TableHead>
                  <TableHead className="text-[#00426E]">Date</TableHead>
                  <TableHead className="text-[#00426E]">Preview</TableHead>
                  <TableHead className="text-[#00426E]">History</TableHead>
                </TableRow>
              </TableHeader>
            )}

            <TableBody>
              {caseData?.documents.map((doc, index) => (
                <React.Fragment key={doc.id}>
                  <TableRow className="border-none hover:bg-gray-50">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{doc.documentName || "N/A"}</TableCell>
                    <TableCell>{doc.documentType || "N/A"}</TableCell>
                    <TableCell>{formatDate(doc.date) || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          onClick={() => handlePreview(doc)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full p-0"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        {doc.history && doc.history.length > 0 ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full p-0"
                            onClick={() => handleHistoryToggle(doc.id)}
                          >
                            {expandedRows.has(doc.id) ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        ) : (
                          <div className="h-8 w-8"></div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* History rows */}
                  {expandedRows.has(doc.id) &&
                    doc.history.map((historyItem, index) => (
                      <TableRow key={historyItem.id} className="bg-gray-100">
                        <TableCell>{/* {index + 1 || "N/A"} */}</TableCell>
                        <TableCell>
                          {historyItem.documentName || "N/A"}
                        </TableCell>
                        <TableCell>
                          {historyItem.documentType || "N/A"}
                        </TableCell>
                        <TableCell>
                          {formatDate(historyItem.date) || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              onClick={() => handlePreview(historyItem)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full p-0"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {/* {historyItem.documentContent || "N/A"} */}
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>

          {selectedTemplate && (
            <DocumentPreviewDialog
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              document={selectedTemplate}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CaseDetailPage;
