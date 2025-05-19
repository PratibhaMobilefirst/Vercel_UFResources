// SubmittedTable.tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";

interface Template {
  id: string;
  documentName: string;
  state: { stateName: string };
  category: { templateName: string };
  createdAt: string;
  url: string;
}

interface SubmittedTableProps {
  templates: Template[];
  page: number;
}

const SubmittedTable: React.FC<SubmittedTableProps> = ({ templates, page }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S.no</TableHead>
          <TableHead>Template Name</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Uploaded Date</TableHead>
          <TableHead>View</TableHead>
          <TableHead>Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {templates.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No Submitted Templates found
            </TableCell>
          </TableRow>
        ) : (
          templates.map((template, index) => (
            <TableRow key={template.id}>
              <TableCell>{(page - 1) * 5 + index + 1}</TableCell>
              <TableCell>{template.documentName}</TableCell>
              <TableCell>{template.state.stateName}</TableCell>
              <TableCell
                className={`px-2 py-1 rounded-full text-blue-600 inline-block bg-blue-100`}
              >
                {template.category.templateName}
              </TableCell>
              <TableCell>{formatDate(template.createdAt)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  //   onClick={() => window.open(template.url, "_blank")}
                >
                  <Eye />
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default SubmittedTable;
