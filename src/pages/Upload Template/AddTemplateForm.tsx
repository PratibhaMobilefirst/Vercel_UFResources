import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DocumentEditor from "./DocumentEditor";
import { useRoles } from "@/hooks/useRoles";
import { useStates } from "@/hooks/useStates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateDocument,
  useTemplateCardsByRoleAndCategory,
} from "@/hooks/useTemplates";

import { useFormik } from "formik";
import { getValidationSchema } from "@/validation/validationSchemaTemplate";
import { useToast } from "@/hooks/use-toast";

interface AddTemplateFormProps {
  onBack: () => void;
  activeTab: "Draft" | "Submitted";
}

const AddTemplateForm = ({ onBack, activeTab }: AddTemplateFormProps) => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const limitRole = 1000000;
  const limitState = 50;
  const [rolesPage, setRolesPage] = useState(1);
  const limit = 1000000;
  const [categoriesPage, setCategoriesPage] = useState(1);

  const { data: rolesData } = useRoles(rolesPage, limitRole);
  const { data: statesData } = useStates(rolesPage, limitState, "");
  const { data: categoriesData } = useCategories(categoriesPage, limit, "");

  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTemplateCard, setSelectedTemplateCard] = useState("");

  const { data: templateCardsData } = useTemplateCardsByRoleAndCategory(
    role,
    category
  );
  const { toast } = useToast();

  const { mutateAsync: createDocument } = useCreateDocument();

  // Reset selected template card when role or category changes
  useEffect(() => {
    setSelectedTemplateCard("");
  }, [role, category]);

  // Filter only active states
  const allStates: any[] =
    statesData?.data?.data.filter((s: any) => s.status) || [];

  const availableStates = allStates.filter(
    (state) => !selectedStates.includes(state.id)
  );

  // Helper: get state name by id
  const getStateNameById = (id: string) =>
    allStates.find((s) => s.id === id)?.stateName || id;

  // Formik setup with imported validation schema
  const formik = useFormik({
    initialValues: {
      documentName: "",
      category: "",
      role: "",
      templateCard: "",
      states: [] as string[],
      updateVersion: "",
      uploadFile: null as File | null,
    },
    validationSchema: getValidationSchema(),
    onSubmit: async (values) => {
      try {
        // You should replace this with real uploaded file URL after uploading the file somewhere
        const fakeUrl = "https://example.com/path/to/document.docx";
        console.log({ values });

        const payload = {
          docName: values.documentName,
          url: fakeUrl,
          submitType: activeTab,
          templateCardId: values.templateCard,
          stateIds: values.states,
          categoryId: values.category,
          roleId: values.role,
          shallUpdate:
            values.updateVersion.toLowerCase() === "yes" ? true : false,
        };

        const result = await createDocument(payload);

        toast({
          title: "Document created successfully.",
          description: `Document ID: ${result.id || "N/A"}`,
          variant: "success",
        });

        setSelectedFile(values.uploadFile);
        setShowEditor(true);
      } catch (error: any) {
        toast({
          title: "Failed to create document.",
          description: error?.message || "Please try again or contact support.",
          variant: "destructive",
        });
      }
    },
  });

  // Sync selectedStates with Formik states field
  const handleStateSelect = (stateId: string) => {
    let newStates: string[];
    if (selectedStates.includes(stateId)) {
      newStates = selectedStates.filter((id) => id !== stateId);
    } else {
      newStates = [...selectedStates, stateId];
    }
    setSelectedStates(newStates);
    formik.setFieldValue("states", newStates);
  };

  // Sync role, category, templateCard with Formik values to keep selects controlled
  useEffect(() => {
    setRole(formik.values.role);
  }, [formik.values.role]);

  useEffect(() => {
    setCategory(formik.values.category);
  }, [formik.values.category]);

  useEffect(() => {
    setSelectedTemplateCard(formik.values.templateCard);
  }, [formik.values.templateCard]);

  // Handle file selection and validation
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    formik.setFieldValue("uploadFile", file);
    if (file) {
      setSelectedFile(file);
      // Do not open editor here - open after form submit
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (showEditor && selectedFile) {
    return (
      <DocumentEditor
        onBack={() => setShowEditor(false)}
        initialFile={selectedFile}
      />
    );
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white min-h-screen flex justify-center items-center p-4"
      noValidate
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg text-blue-600 font-medium">
            Add New Template
          </span>
        </div>

        {/* Form Content */}
        <div className="p-4 pt-0">
          {/* Upload Section with validation */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Upload Word File
            </label>
            <div
              className={`border border-dashed rounded-md bg-gray-50 p-6 flex flex-col items-center text-center cursor-pointer hover:bg-blue-50 transition ${
                formik.touched.uploadFile && formik.errors.uploadFile
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              onClick={handleUploadClick}
            >
              <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">
                Drag File here or{" "}
                <span className="text-blue-600 cursor-pointer">Browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Upload your document in word format
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".doc,.docx"
              className="hidden"
            />
            {formik.touched.uploadFile && formik.errors.uploadFile ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.uploadFile as string}
              </div>
            ) : null}
          </div>

          {/* Document Name */}
          <div className="flex flex-col gap-2 mb-4">
            <label
              htmlFor="documentName"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Document Name
            </label>
            <input
              id="documentName"
              name="documentName"
              type="text"
              placeholder="Enter the Document Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.documentName}
              className={`px-3 py-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 ${
                formik.touched.documentName && formik.errors.documentName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[#D8D8D8] focus:ring-[#00426E]"
              }`}
            />
            {formik.touched.documentName && formik.errors.documentName ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.documentName}
              </div>
            ) : null}
          </div>

          {/* Category */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select Category
            </label>
            <Select
              onValueChange={(val) => formik.setFieldValue("category", val)}
              value={formik.values.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesData?.data?.data?.map((categoryItem) =>
                  categoryItem.templateName ? (
                    <SelectItem key={categoryItem.id} value={categoryItem.id}>
                      {categoryItem.templateName}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
            {formik.touched.category && formik.errors.category ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.category}
              </div>
            ) : null}
          </div>

          {/* Role */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select Type
            </label>
            <Select
              onValueChange={(val) => formik.setFieldValue("role", val)}
              value={formik.values.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "30vh", overflowY: "scroll" }}>
                {rolesData?.data?.data?.map((roleItem) =>
                  roleItem.name ? (
                    <SelectItem key={roleItem.id} value={roleItem.id}>
                      {roleItem.name}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
            {formik.touched.role && formik.errors.role ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.role}
              </div>
            ) : null}
          </div>

          {/* Template Card */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select Template Card
            </label>
            <Select
              onValueChange={(val) => formik.setFieldValue("templateCard", val)}
              value={formik.values.templateCard}
              disabled={!formik.values.role || !formik.values.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template card " />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "30vh", overflowY: "scroll" }}>
                {templateCardsData?.data?.map((item) =>
                  item.templateCardName ? (
                    <SelectItem key={item.id} value={item.id}>
                      {item.templateCardName}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
            {formik.touched.templateCard && formik.errors.templateCard ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.templateCard}
              </div>
            ) : null}
          </div>

          {/* States */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Select State
            </label>
            <div className="relative">
              <div className="w-full bg-white border border-gray-200 rounded px-2 py-1 flex flex-wrap items-center min-h-10">
                {selectedStates.map((stateId) => (
                  <span
                    key={stateId}
                    className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-medium flex items-center gap-1 m-1"
                  >
                    {getStateNameById(stateId)}
                    <button
                      type="button"
                      className="ml-1 text-blue-500 hover:text-blue-700"
                      onClick={() => handleStateSelect(stateId)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div
                  className="flex-1 min-w-[120px] h-8 flex items-center cursor-pointer"
                  onClick={() =>
                    setShowDropdown(showDropdown === "state" ? null : "state")
                  }
                >
                  <span className="text-gray-500 text-sm">
                    {selectedStates.length ? "" : "Select here"}
                  </span>
                </div>
              </div>
              {showDropdown === "state" && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto">
                  <div className="py-1">
                    {availableStates.length > 0 ? (
                      availableStates.map((state) => (
                        <div
                          key={state.id}
                          className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                          onClick={() => handleStateSelect(state.id)}
                        >
                          {state.stateName}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No states left
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {formik.touched.states && formik.errors.states ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.states}
              </div>
            ) : null}
          </div>

          {/* Update Version */}
          <div className="w-full mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Update Version
            </label>
            <Select
              onValueChange={(val) =>
                formik.setFieldValue("updateVersion", val)
              }
              value={formik.values.updateVersion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Version" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: "30vh", overflowY: "scroll" }}>
                <SelectItem value="yes">YES</SelectItem>
                <SelectItem value="no">NO</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.updateVersion && formik.errors.updateVersion ? (
              <div className="text-red-600 text-xs mt-1">
                {formik.errors.updateVersion}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8 mb-2">
          <button
            type="button"
            className="px-6 py-2 text-sm border border-gray-300 bg-white rounded hover:bg-gray-50"
            onClick={onBack}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Go to Editor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddTemplateForm;
