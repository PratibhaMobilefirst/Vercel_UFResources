import * as Yup from "yup";

const validationSchemaForgetForm = Yup.object({
  // Email Validation: Valid email format (email ID must be alphanumeric and valid)
  email: Yup.string()
    .email("Invalid email address") // This ensures the email is in a valid email format
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // RegEx for alphanumeric email IDs
      "Email should be alphanumeric"
    )
    .required("Email is required"), // Email is a required field
});

export default validationSchemaForgetForm;
