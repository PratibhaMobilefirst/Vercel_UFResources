import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

interface PreviewClauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  clauseData: {
    createdDate: string;
    lastModifiedDate: string;
    modifiedBy: string;
    clauseName: string;
    content: string;
  };
}

export function PreviewClauseModal({
  isOpen,
  onClose,
  clauseData,
}: PreviewClauseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-blue-600 flex items-center hover:text-blue-700"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Preview Clause</span>
            </button>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Created Date</p>
              <p className="font-medium">{clauseData.createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Modified Date</p>
              <p className="font-medium">{clauseData.lastModifiedDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Modified By</p>
              <p className="font-medium">{clauseData.modifiedBy}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">{clauseData.clauseName}</h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {clauseData.content}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 