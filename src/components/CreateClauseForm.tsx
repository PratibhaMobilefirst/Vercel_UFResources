import { ChevronLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCategories } from "@/hooks/useCategories";
import { useStates } from "@/hooks/useStates";
import { useClauses, useClauseById } from "@/hooks/useClauses";

import { useEffect, useState } from "react";
import { ClauseEditor } from "./ClauseEditor";
import { ClauseItem } from "@/api/clausesApi";

interface CreateClauseFormProps {
  onBack: () => void;
  clauseId?: string;
  isEditing?: boolean;
}

const formSchema = z.object({
  clauseName: z.string().min(1, "Clause name is required"),
  state: z.string().min(1, "State is required"),
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateClauseForm({ 
  onBack, 
  clauseId, 
  isEditing = false
}: CreateClauseFormProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const limit = 1000000;
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [clauseContent, setClauseContent] = useState<string>("");
  const [stateId, setStateId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  
  const { data: clausesData } = useClauses(1, 1000, undefined);
  
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(categoriesPage, limit);

  const [statesPage, setStatesPage] = useState(1);
  const {
    data: statesData,
    isLoading: isStatesLoading,
    isError: isStatesError,
  } = useStates(statesPage, limit);
  
  // Use the specific clause API for fetching a clause by ID
  const {
    data: clauseData,
    isLoading: isClauseLoading
  } = useClauseById(isEditing ? clauseId : undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clauseName: "",
      state: "",
      category: "",
    },
  });

  // Populate form with existing clause data when editing
  useEffect(() => {
    if (isEditing && clauseId && clauseData) {
      const clause = clauseData.data;
      
      // Set the clause name
      form.setValue("clauseName", clause.clauseName);
      
      // For clauses fetched through fetchClauseById, we need to look up state and category
      // based on the full data we get elsewhere
      const allClauses = clausesData?.data?.data || [];
      const matchingClause = allClauses.find(c => c.id === clauseId);
      
      if (matchingClause) {
        // Get state name
        const stateName = matchingClause.state ? matchingClause.state.stateName : "";
        form.setValue("state", stateName);
        
        // Get category name
        const categoryName = matchingClause.templateCategory ? matchingClause.templateCategory.templateName : "";
        form.setValue("category", categoryName);
        
        // We need to lookup the IDs from the states and categories lists
        if (stateName && statesData?.data?.data) {
          const stateObj = statesData.data.data.find(s => s.stateName === stateName);
          if (stateObj) {
            setStateId(stateObj.id);
          }
        }
        
        if (categoryName && categoriesData?.data?.data) {
          const categoryObj = categoriesData.data.data.find(c => c.templateName === categoryName);
          if (categoryObj) {
            setCategoryId(categoryObj.id);
          }
        }
      }
      
      // Set content directly from the fetched clause
      setClauseContent(clause.clauseContent || "");
    }
  }, [isEditing, clauseId, clauseData, clausesData, statesData, categoriesData, form]);

  const onSubmit = (data: FormValues) => {
    setFormData(data);
    setShowEditor(true);
  };

  // Get the stateId from the selected state name
  useEffect(() => {
    if (formData?.state && statesData?.data?.data) {
      const selectedState = statesData.data.data.find(
        state => state.stateName === formData.state
      );
      if (selectedState) {
        setStateId(selectedState.id);
      }
    }
  }, [formData?.state, statesData]);

  // Get the categoryId from the selected category name
  useEffect(() => {
    if (formData?.category && categoriesData?.data?.data) {
      const selectedCategory = categoriesData.data.data.find(
        category => category.templateName === formData.category
      );
      if (selectedCategory) {
        setCategoryId(selectedCategory.id);
      }
    }
  }, [formData?.category, categoriesData]);

  if (showEditor) {
    return (
      <ClauseEditor 
        onBack={() => setShowEditor(false)} 
        formData={{
          clauseName: formData?.clauseName || "",
          stateId: isEditing ? stateId : (statesData?.data?.data?.find(
            state => state.stateName === formData?.state
          )?.id || ""),
          categoryId: isEditing ? categoryId : (categoriesData?.data?.data?.find(
            category => category.templateName === formData?.category
          )?.id || ""),
          clauseId: isEditing ? clauseId : undefined,
          clauseContent: isEditing ? clauseContent : undefined,
          isEditing,
        }}
      />
    );
  }

  const isLoading = isClauseLoading || isStatesLoading || isCategoriesLoading;

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="border-b px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="text-blue-600 flex items-center hover:text-blue-700"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-base">{isEditing ? "Edit Clause" : "Create a New Clause"}</span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center p-8">Loading data...</div>
          ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
              <FormField
                control={form.control}
                name="clauseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Clause Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter clause name"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Select State
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Here" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                        {statesData?.data?.data?.map((stateItem) => {
                          if (stateItem.stateName) {
                            return (
                              <SelectItem key={stateItem.id} value={stateItem.stateName}>
                                {stateItem.stateName}
                              </SelectItem>
                            );
                          }
                          return null;
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Select Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Here" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                        {categoriesData?.data?.data?.map((categoryItem) => {
                          if (categoryItem.templateName) {
                            return (
                              <SelectItem key={categoryItem.id} value={categoryItem.templateName}>
                                {categoryItem.templateName}
                              </SelectItem>
                            );
                          }
                          return null;
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Go to Editor
                </Button>
              </div>
            </form>
          </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 