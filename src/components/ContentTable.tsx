import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Eye, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";

interface Column {
  header: string;
  accessorKey: string;
  sortable?: boolean;
  isDate?: boolean; // Added isDate flag to specify date columns
}

interface ContentTableProps {
  data: any[];
  columns: Column[];
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  toggleLoadingId?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  disableInternalPagination?: boolean;
  showDeleteAction?: boolean;
  useEyeIcon?: boolean;
}

const ITEMS_PER_PAGE = 5;

const ContentTable = ({
  data,
  columns,
  showActions = false,
  showDeleteAction = true,
  onEdit,
  onDelete,
  onToggleStatus,
  toggleLoadingId,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  disableInternalPagination = false,
  useEyeIcon = false,
}: ContentTableProps) => {
  const [internalPage, setInternalPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc" | null;
  }>({
    key: null, // No column is sorted by default
    direction: null, // No sorting direction by default
  });

  // Use internal pagination if not disabled
  const useInternalPagination = !disableInternalPagination;
  const activePage = useInternalPagination ? internalPage : currentPage;
  const totalPagesCount = useInternalPagination
    ? Math.ceil(data.length / ITEMS_PER_PAGE)
    : totalPages;

  const displayData = useInternalPagination
    ? data.slice(
        (internalPage - 1) * ITEMS_PER_PAGE,
        internalPage * ITEMS_PER_PAGE
      )
    : data;

  const sortedData = sortConfig.key
    ? displayData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // If the column is a date column, convert to Date objects for correct sorting
        if (columns.find((col) => col.accessorKey === sortConfig.key)?.isDate) {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);

          if (aDate < bDate) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aDate > bDate) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
        } else {
          // Lexicographical sort for non-date columns
          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
        }
        return 0;
      })
    : displayData; // If no sorting, just display the data as is

  const handlePageChange = (newPage: number) => {
    if (useInternalPagination) {
      setInternalPage(newPage);
    } else {
      onPageChange?.(newPage);
    }
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] flex flex-col min-h-[500px]">
      <div className="flex-grow">
        <Table className="">
          <TableHeader>
            <TableRow className="bg-[#F2FAFF]">
              {columns.map((column) => (
                <TableHead
                  key={column.accessorKey}
                  className="text-[#035C98] font-medium text-left px-6 py-3 cursor-pointer"
                  onClick={() =>
                    column.sortable && handleSort(column.accessorKey)
                  }
                >
                  {column.header}
                  {column.sortable && sortConfig.key === column.accessorKey ? (
                    <span>{sortConfig.direction === "asc" ? " ↑" : " ↓"}</span>
                  ) : (
                    // Show default arrow (↕) if no sorting applied to this column
                    column.sortable && " ↕"
                  )}
                </TableHead>
              ))}
              {showActions && (
                <TableHead className="text-[#035C98] font-medium text-left px-6 py-3">
                  Action
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id} className="">
                {columns.map((column) => (
                  <TableCell
                    key={column.accessorKey}
                    className="text-[#374151] text-left px-6 py-3"
                  >
                    {column.accessorKey === "status" ? (
                      <div className="flex items-center">
                        {toggleLoadingId === row.sno ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Switch
                            checked={row[column.accessorKey]}
                            onCheckedChange={() => onToggleStatus?.(row.sno)}
                            className="data-[state=checked]:bg-green-500"
                          />
                        )}
                      </div>
                    ) : (
                      row[column.accessorKey]
                    )}
                  </TableCell>
                ))}

                {showActions && (
                  <TableCell className="text-left px-6 py-3">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-500 hover:text-gray-700 p-0"
                        onClick={() => onEdit?.(row)}
                      >
                        {useEyeIcon ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                      {showDeleteAction && onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-500 hover:text-red-600 p-0"
                          onClick={() => onDelete(row.sno)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-[#E5E7EB] w-full">
        <div className="flex justify-between items-center w-full px-4 py-3">
          <Button
            variant="outline"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="border border-[#D1D5DB] bg-white text-[#374151] hover:bg-gray-50 px-6 py-2 text-sm font-medium rounded"
          >
            Previous
          </Button>

          <span className="text-sm text-[#6B7280]">
            Page {activePage} of {totalPagesCount}
          </span>

          <Button
            variant="outline"
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPagesCount}
            className="border border-[#D1D5DB] bg-white text-[#374151] hover:bg-gray-50 px-6 py-2 text-sm font-medium rounded"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentTable;
