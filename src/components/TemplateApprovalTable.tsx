import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Eye } from "lucide-react";
import { DocumentPreviewDialog } from "./DocumentPreviewDialog";
import { RejectDialog } from "./RejectDialog";
import { ConfirmApprovalDialog } from "./ConfirmApprovalDialog";
import { toast } from "sonner";

interface Template {
  id: string;
  serialNo: string;
  documentName: string;
  state: string;
  category: string;
  uploadedDate: string;
}

const templates: Template[] = [
  {
    id: "1",
    serialNo: "001",
    documentName: "Will Document",
    state: "California",
    category: "Will",
    uploadedDate: "1.2.2024",
  },
  {
    id: "2",
    serialNo: "002",
    documentName: "Health POA",
    state: "California",
    category: "Will",
    uploadedDate: "1.2.2024",
  },
  {
    id: "3",
    serialNo: "003",
    documentName: "Medical Document",
    state: "California",
    category: "Will",
    uploadedDate: "1.2.2024",
  },
  {
    id: "4",
    serialNo: "004",
    documentName: "Simple Will",
    state: "California",
    category: "Will",
    uploadedDate: "1.2.2024",
  },
  {
    id: "5",
    serialNo: "005",
    documentName: "POA",
    state: "California",
    category: "Will",
    uploadedDate: "1.2.2024",
  },
];

const TemplateApprovalTable = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleApprove = (template: Template) => {
    setSelectedTemplate(template);
    setIsApproveOpen(true);
  };

  const handleReject = (template: Template) => {
    setSelectedTemplate(template);
    setIsRejectOpen(true);
  };

  const confirmApproval = () => {
    toast.success("Template approved successfully!");
    setIsApproveOpen(false);
  };

  const confirmRejection = (reason: string, remarks: string) => {
    toast.success("Template rejected successfully!");
    setIsRejectOpen(false);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.no</TableHead>
            <TableHead>Template Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Uploaded Date</TableHead>
            <TableHead>Preview Document</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.serialNo}</TableCell>
              <TableCell>{template.documentName}</TableCell>
              <TableCell>{template.state}</TableCell>
              <TableCell className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {template.category}
                </span>
              </TableCell>
              <TableCell>{template.uploadedDate}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreview(template)}
                >
                  <Eye className="h-5 w-5" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="bg-[#C1FFD0] hover:bg-[#C1FFD0] text-[#12BA3C]"
                    onClick={() => handleApprove(template)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="default"
                    className="bg-[#FFCDCD] hover:bg-[#FFCDCD] text-[#E94C4C]"
                    onClick={() => handleReject(template)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <div className="mt-6 flex justify-between items-center"> */}
      <div className="flex justify-between items-center pt-4 ">
        {/* <span className="text-sm">Page 1 of 1</span> */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {selectedTemplate && (
        <>
          <DocumentPreviewDialog
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            document={selectedTemplate}
          />
          <RejectDialog
            isOpen={isRejectOpen}
            onClose={() => setIsRejectOpen(false)}
            onReject={confirmRejection}
          />
          <ConfirmApprovalDialog
            isOpen={isApproveOpen}
            onClose={() => setIsApproveOpen(false)}
            onApprove={confirmApproval}
            document={selectedTemplate}
          />
        </>
      )}
    </div>
  );
};

export default TemplateApprovalTable;
