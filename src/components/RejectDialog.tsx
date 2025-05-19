
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string, remarks: string) => void;
}

export const RejectDialog = ({
  isOpen,
  onClose,
  onReject,
}: RejectDialogProps) => {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  const handleAddReason = (value: string) => {
    if (value && !selectedReasons.includes(value)) {
      setSelectedReasons([...selectedReasons, value]);
    }
  };

  const handleRemoveReason = (reason: string) => {
    setSelectedReasons(selectedReasons.filter(r => r !== reason));
  };

  const handleReject = () => {
    onReject(selectedReasons.join(", "), remarks);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure, you want to reject this?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Reason</label>
            <Select onValueChange={handleAddReason}>
              <SelectTrigger>
                <SelectValue placeholder="Type or select reason" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="Format">Format</SelectItem>
                <SelectItem value="Clause">Clause</SelectItem>
                <SelectItem value="Content">Content</SelectItem>
                <SelectItem value="Legal Issues">Legal Issues</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedReasons.map(reason => (
                <Badge 
                  key={reason} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-blue-50 text-blue-600"
                >
                  {reason}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveReason(reason)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Remarks (if any)</label>
            <Textarea
              placeholder="Remark"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="text-right text-xs text-gray-500 mt-1">0/500</div>
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject}
            className="bg-[#00426E] hover:bg-[#003055] text-white"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
