import * as Yup from "yup";

export const passwordValidationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long") // Minimum length of 8 characters
    .matches(/[a-z]/, "Password must contain at least one lowercase letter") // At least one lowercase letter
    .matches(/[0-9]/, "Password must contain at least one number") // At least one number
    .matches(/[\W_]/, "Password must contain at least one special character") // At least one special character
    .required("Password is required"), // Password is a required field
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
