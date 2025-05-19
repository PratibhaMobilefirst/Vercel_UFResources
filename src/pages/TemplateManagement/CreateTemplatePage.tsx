import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useRoles } from "@/hooks/useRoles";
import { useCategories } from "@/hooks/useCategories";
import { useCreateTemplateCard, CreateTemplateCardDto } from "@/hooks/useCreateTemplateCard";

const CreateTemplatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const limit = 1000000;
  const [rolesPage, setRolesPage] = useState(1);
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useRoles(rolesPage, limit);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useCategories(categoriesPage, limit);
  
  // Get attorney type from the state passed from TemplateManagementPage
  const [attorneyType, setAttorneyType] = useState<CreateTemplateCardDto["attorneyType"]>("NetworkAttorney");
  const [templateName, setTemplateName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState<string[]>([]);
  
  // Form validation states
  const [errors, setErrors] = useState({
    templateName: "",
    categories: "",
    attorneys: ""
  });
  
  // Get the create template card mutation
  const createTemplateMutation = useCreateTemplateCard();
  
  // Extract attorney type from location state
  useEffect(() => {
    if (location.state?.attorneyType) {
      const types: Record<string, CreateTemplateCardDto["attorneyType"]> = {
        "network-attorney": "NetworkAttorney",
        "campaign": "Campaign",
        "attorney-specific": "AttorneySpecific"
      };
      setAttorneyType(types[location.state.attorneyType] || "NetworkAttorney");
    }
  }, [location.state]);
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      templateName: "",
      categories: "",
      attorneys: ""
    };
    
    if (!templateName.trim()) {
      newErrors.templateName = "Template name is required";
      isValid = false;
    }
    
    if (selectedCategories.length === 0) {
      newErrors.categories = "At least one category is required";
      isValid = false;
    }
    
    if (selectedAttorneys.length === 0) {
      newErrors.attorneys = "At least one attorney role is required";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const findSelectedItemIds = (items: any[] | undefined, selectedNames: string[]) => {
    return items?.filter(item => selectedNames.includes(item.templateName || item.name))
      .map(item => item.id) || [];
  };
  
  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Find category IDs from selected category names
      const categoryIds = findSelectedItemIds(
        categoriesData?.data?.data, 
        selectedCategories
      );
      
      // Find role IDs from selected attorney role names
      const roleIds = findSelectedItemIds(
        rolesData?.data?.data,
        selectedAttorneys
      );
      
      // Create payload
      const payload: CreateTemplateCardDto = {
        templateCardName: templateName,
        attorneyType,
        categoryIds,
        roleIds
      };
      
      // Submit the request
       createTemplateMutation.mutate(payload);
      
      toast({
        title: "Success",
        description: "Template created successfully",
        duration: 2000,
      });
      
      navigate("/template-management");
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    // Clear error when user selects a category
    if (errors.categories && selectedCategories.length === 0) {
      setErrors({ ...errors, categories: "" });
    }
  };

  const handleAttorneySelect = (attorney: string) => {
    if (selectedAttorneys.includes(attorney)) {
      setSelectedAttorneys(selectedAttorneys.filter(a => a !== attorney));
    } else {
      setSelectedAttorneys([...selectedAttorneys, attorney]);
    }
    // Clear error when user selects an attorney
    if (errors.attorneys && selectedAttorneys.length === 0) {
      setErrors({ ...errors, attorneys: "" });
    }
  };

  return (
    <Layout>
      <div className="container p-1">
        <div className="bg-white p-6 rounded-lg shadow-[0_0_3px_rgba(0,0,0,0.1)] h-fit">
          {/* Header with back button */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/template-management")}
              className="mr-4 p-0 hover:bg-transparent flex items-center gap-2"
            >
              <div className="bg-[#D4EDFF] p-0.5 rounded-full">
                <ChevronLeft className="h-2 w-2 text-[#00426E]" />
              </div>
              Create Template Card
            </Button>
          </div>
          
          <div className="max-w-[600px]">
            <div className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="text-base font-normal block mb-2">
                  Template Card Name
                </label>
                <Input
                  placeholder="Enter Here"
                  value={templateName}
                  onChange={(e) => {
                    setTemplateName(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors({ ...errors, templateName: "" });
                    }
                  }}
                  className={`h-10 border-gray-200 ${errors.templateName ? "border-red-500" : ""}`}
                />
                {errors.templateName && (
                  <p className="text-red-500 text-sm mt-1">{errors.templateName}</p>
                )}
              </div>
              
              {/* Category */}
              <div>
                <label className="text-base font-normal block mb-2">
                  Select Category
                </label>
                <Select
                  onValueChange={(value) => handleCategorySelect(value)}
                >
                  <SelectTrigger className={`h-10 border-gray-200 ${errors.categories ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Search here" />
                  </SelectTrigger>
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
                {errors.categories && (
                  <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
                )}
                
                <div className="mt-2 bg-[#F8F9FA] rounded-md min-h-[60px] p-2">
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map(category => (
                        <Badge 
                          key={category} 
                          className="bg-white border border-[#00426E] text-[#00426E] hover:bg-white"
                        >
                          {category}
                          <button 
                            className="ml-2 text-xs hover:text-[#003058]"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategorySelect(category);
                            }}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Attorney Roles */}
              <div>
                <label className="text-base font-normal block mb-2">
                  Attorney role which can use this template
                </label>
                <Select
                  onValueChange={(value) => handleAttorneySelect(value)}
                >
                  <SelectTrigger className={`h-10 border-gray-200 ${errors.attorneys ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Search here" />
                  </SelectTrigger>
                  <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                  {rolesData?.data?.data?.map((roleItem) => {
                    if (roleItem.name) {
                      return (
                        <SelectItem key={roleItem.id} value={roleItem.name}>
                          {roleItem.name}
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                  </SelectContent>
                </Select>
                {errors.attorneys && (
                  <p className="text-red-500 text-sm mt-1">{errors.attorneys}</p>
                )}
                
                <div className="mt-2 bg-[#F8F9FA] rounded-md min-h-[60px] p-2">
                  {selectedAttorneys.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAttorneys.map(attorney => (
                        <Badge 
                          key={attorney} 
                          className="bg-white border border-[#00426E] text-[#00426E] hover:bg-white"
                        >
                          {attorney}
                          <button 
                            className="ml-2 text-xs hover:text-[#003058]"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAttorneySelect(attorney);
                            }}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 px-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/template-management")}
              className="border-gray-200 hover:bg-gray-50"
              disabled={createTemplateMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#00426E] hover:bg-[#003058]"
              onClick={handleSave}
              disabled={createTemplateMutation.isPending}
            >
              {createTemplateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTemplatePage;
