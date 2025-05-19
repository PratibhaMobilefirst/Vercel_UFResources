
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Check } from "lucide-react";

interface Template {
  id: string;
  documentName: string;
  state: string;
  category: string;
  uploadedDate: string;
}

interface ConfirmApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  document: Template;
}

export const ConfirmApprovalDialog = ({
  isOpen,
  onClose,
  onApprove,
  document,
}: ConfirmApprovalDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are You Sure, You want to approve?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to approve the template "{document.documentName}". This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onClick={onApprove} className="bg-green-500 hover:bg-green-600">
            <Check className="mr-2 h-4 w-4" /> Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
