// validationSchema.ts
import * as Yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function getValidationSchema() {
  return Yup.object({
    documentName: Yup.string()
      .min(3, "Document Name must be at least 3 characters")
      .required("Document Name is required"),
    category: Yup.string().required("Category is required"),
    role: Yup.string().required("Role is required"),
    templateCard: Yup.string().required("Template Card is required"),
    states: Yup.array()
      .min(1, "Please select at least one state")
      .required("State selection is required"),
    updateVersion: Yup.string().required("Update Version is required"),
    uploadFile: Yup.mixed()
      .required("File is required")
      .test(
        "fileType",
        "Unsupported file format. Only .doc and .docx are allowed",
        (value) => {
          if (!value) return false;
          const allowedTypes = [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];
          return allowedTypes.includes(value.type);
        }
      )
      .test(
        "fileSize",
        "File size too large, max 5MB",
        (value) => !value || (value && value.size <= MAX_FILE_SIZE)
      ),
  });
}
