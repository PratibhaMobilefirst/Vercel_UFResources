import * as Yup from "yup";

const validationSchemaLogin = Yup.object({
  // Email Validation: Valid email format (email ID must be alphanumeric and valid)
  email: Yup.string()
    .email("Invalid email address") // This ensures the email is in a valid email format
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // RegEx for alphanumeric email IDs
      "Email should be alphanumeric"
    )
    .required("Email is required"), // Email is a required field

  // Password Validation: Must contain uppercase, lowercase, special char, number, and min length of 8
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long") // Minimum length of 8 characters
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one uppercase letter
    .matches(/[a-z]/, "Password must contain at least one lowercase letter") // At least one lowercase letter
    .matches(/[0-9]/, "Password must contain at least one number") // At least one number
    // .matches(/[\W_]/, "Password must contain at least one special character") // At least one special character
    .required("Password is required"), // Password is a required field
});

export default validationSchemaLogin;
