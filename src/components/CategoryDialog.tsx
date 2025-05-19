import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "@/api/categoryApi";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mode: 'add' | 'edit';
  initialData?: {
    id: string;
    templateName: string;
  };
}

const CategoryDialog = ({ open, setOpen, mode, initialData }: CategoryDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validationSchema = Yup.object({
    category: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters long")
      .max(50, "Category name cannot be longer than 50 characters"),
  });

  const createMutation = useMutation({
    mutationFn: (templateName: string) => createCategory({ templateName }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { categoryId: string; updatedName: string }) =>
      updateCategory({ categoryId: data.categoryId, updatedName: data.updatedName }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (values: { category: string }) => {
    if (mode === 'edit' && initialData) {
      await updateMutation.mutateAsync({
        categoryId: initialData.id,
        updatedName: values.category,
      });
    } else {
      await createMutation.mutateAsync(values.category);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Category' : 'Edit Category'}</DialogTitle>
        </DialogHeader>
        <hr />
        <Formik
          initialValues={{ category: initialData?.templateName || "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, touched, errors, handleChange, handleBlur }) => (
            <Form>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="category"
                    className="text-base font-normal roboto-font"
                  >
                    Category
                  </Label>
                  <Input
                    name="category"
                    id="category"
                    placeholder="Enter category name"
                    className="mt-1"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                  />
                  {touched.category && errors.category && (
                    <div className="text-red-500 text-sm">
                      {errors.category}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    type="button"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#00426E] hover:bg-[#00426E]/90"
                    type="submit"
                    disabled={isLoading || (Boolean(errors.category) && touched.category)}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader className="w-5 h-5 mr-2" />
                        {/* <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" /> */}
                        {mode === 'add' ? 'Creating...' : 'Updating...'}
                      </div>
                    ) : (
                      mode === 'add' ? 'Create' : 'Update'
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog; 