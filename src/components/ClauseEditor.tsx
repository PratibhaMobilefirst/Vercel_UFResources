import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCreateClause, useUpdateClause } from "@/hooks/useClauses";
import { useToast } from "@/components/ui/use-toast";

interface ClauseEditorProps {
  onBack: () => void;
  formData: {
    clauseName: string;
    stateId: string;
    categoryId: string;
    clauseId?: string;
    clauseContent?: string;
    isEditing?: boolean;
  };
}

export function ClauseEditor({ onBack, formData }: ClauseEditorProps) {
  const [content, setContent] = useState(formData.clauseContent || "");
  const createClauseMutation = useCreateClause();
  const updateClauseMutation = useUpdateClause();
  const { toast } = useToast();
  
  useEffect(() => {
    if (formData.clauseContent) {
      setContent(formData.clauseContent);
    }
  }, [formData.clauseContent]);

  const handleSave = async () => {
    try {
      if (formData.isEditing && formData.clauseId) {
        // Update existing clause
        await updateClauseMutation.mutateAsync({
          clauseId: formData.clauseId,
          clauseName: formData.clauseName,
          templateCategoryId: formData.categoryId,
          stateId: formData.stateId,
          clauseContent: content,
        });

        toast({
          title: "Success",
          description: "Clause updated successfully",
        });
      } else {
        // Create new clause
        await createClauseMutation.mutateAsync({
          clauseName: formData.clauseName,
          templateCategoryId: formData.categoryId,
          stateId: formData.stateId,
          status: true,
          clauseContent: content,
        });

        toast({
          title: "Success",
          description: "Clause created successfully",
        });
      }

      // Navigate back or clear form
      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: formData.isEditing 
          ? "Failed to update clause" 
          : "Failed to create clause",
        variant: "destructive",
      });
    }
  };

  const isPending = formData.isEditing 
    ? updateClauseMutation.isPending 
    : createClauseMutation.isPending;

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-blue-600 flex items-center hover:text-blue-700"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-base">
                {formData.isEditing ? "Edit Clause" : "Create New Clause"}
              </span>
            </button>
            <Button 
              className="bg-blue-600 text-white"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <Button variant="outline" size="sm">T</Button>
              <Button variant="outline" size="sm">B</Button>
              <Button variant="outline" size="sm">I</Button>
            </div>
            <div className="min-h-[400px] w-full border rounded-lg p-4">
              <textarea 
                className="w-full h-full min-h-[380px] resize-none focus:outline-none"
                placeholder="Type Clause Here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 