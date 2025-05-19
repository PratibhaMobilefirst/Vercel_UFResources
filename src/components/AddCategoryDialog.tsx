import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateCategory } from "@/hooks/useCreateCategory";

interface AddCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddCategoryDialog = ({ open, setOpen }: AddCategoryDialogProps) => {
  const createCategoryMutation = useCreateCategory();

  const validationSchema = Yup.object({
    category: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters long")
      .max(50, "Category name cannot be longer than 50 characters"),
  });

  const handleSubmit = async (values: { category: string }) => {
    await createCategoryMutation.mutateAsync(values.category);
    setOpen(false); // Close dialog after successful submission
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 bg-[#00426E] hover:bg-[#00426E]/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <hr />
        <Formik
          initialValues={{ category: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                    disabled={createCategoryMutation.isPending}
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
                    disabled={createCategoryMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#00426E] hover:bg-[#00426E]/90"
                    type="submit"
                    disabled={
                      Boolean(errors.category && touched.category) ||
                      createCategoryMutation.isPending
                    }
                  >
                    {createCategoryMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create"
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

export default AddCategoryDialog;
