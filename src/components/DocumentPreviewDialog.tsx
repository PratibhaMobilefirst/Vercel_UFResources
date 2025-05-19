import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Template {
  id: string;
  documentName: string;
  state: string;
  category: string;
  uploadedDate: string;
}

interface DocumentPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Template;
}

export const DocumentPreviewDialog = ({
  isOpen,
  onClose,
  document,
}: DocumentPreviewDialogProps) => {
  console.log(document?.preview?.documentContent);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-medium">Preview Document</h2>
        </div>
        <div className="p-6 overflow-y-auto h-full">
          <h3 className="text-xl font-semibold mb-4">
            {document.documentName || "N/A"}
          </h3>
          <div className="prose max-w-none">
            <p>{document?.preview?.documentContent || "no content"}</p>
            {/* <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure date to
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Quis aute irure date to reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p>
              Quis autem(Will Document) vel eum iure reprehenderit qui in ea
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
            <p>
              Quis autem(Will Document) vel eum iure reprehenderit qui in ea
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Quis autem vel eum
              iure reprehenderit qui in ea voluptate velit esse cillum dolore eu
              fugiat nulla pariatur.
            </p>
            <p>
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
