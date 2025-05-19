import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRoles } from "@/hooks/userRole";
import { useCreateUser } from "@/hooks/useCreateUser";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { CreateUserParams, UpdateUserParams } from "@/api/useCreateUser";
import { useUserDetails } from "@/hooks/useUserDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormValues {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9\-]{10,15}$/, "Enter a valid phone number")
    .required("Mobile number is required"),
  roleId: Yup.string().required("Role is required"),
});

const UserManagementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const { data: userDetails, isLoading: isLoadingUser } = useUserDetails(userId);
  const { data: rolesData } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  
  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      roleId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const basePayload = {
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        roleId: values.roleId,
      };

      if (userId) {
        const updatePayload: UpdateUserParams = {
          ...basePayload,
          userId,
        };
        updateUser.mutate(updatePayload);
      } else {
        const createPayload: CreateUserParams = {
          ...basePayload,
          email: values.email,
      };
        createUser.mutate(createPayload);
      }
    },
  });

  useEffect(() => {
    if (userDetails?.data?.data) {
      const user = userDetails.data.data;
      formik.setValues({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.mobileNumber,
        roleId: user.role.id,
      });
    }
  }, [userDetails]);

  if (isLoadingUser) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              className="p-2"
            onClick={() => navigate("/user-management", { state: { selectedTab: "User Creation" } })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          <h1 className="text-2xl font-semibold ml-2">
            {userId ? "Edit User" : "Create User"}
          </h1>
          </div>
        <div className="mt-1 bg-white rounded-lg shadow p-8 mx-auto max-w-6xl h-full">
          <div className="space-y-6">
          <form onSubmit={formik.handleSubmit} className="max-w-4xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs">
                      {String(formik.errors.firstName)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  placeholder="Enter Middle Name"
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.middleName && formik.errors.middleName && (
                  <div className="text-red-500 text-xs">
                      {String(formik.errors.middleName)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-xs">
                      {String(formik.errors.lastName)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="roleId">
                  Role<span className="text-red-500">*</span>
                </Label>
                <Select
                    value={formik.values.roleId}
                    onValueChange={(value) => formik.setFieldValue("roleId", value)}
                >
                  <SelectTrigger
                      onBlur={() => formik.setFieldTouched("roleId", true)}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                    {rolesData &&
                      rolesData?.data?.data?.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                  {formik.touched.roleId && formik.errors.roleId && (
                  <div className="text-red-500 text-xs">
                      {String(formik.errors.roleId)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email ID<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                    disabled={!!userId}
                    className={userId ? "bg-gray-100" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-xs">
                      {String(formik.errors.email)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                  Mobile No.<span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                    +1
                  </span>
                  <Input
                      id="phoneNumber"
                      name="phoneNumber"
                    type="tel"
                    placeholder="555-231-4758"
                    className="rounded-l-none"
                      value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                  />
                </div>
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className="text-red-500 text-xs">
                      {String(formik.errors.phoneNumber)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                  disabled={createUser.status === "pending" || updateUser.status === "pending"}
                type="submit"
                className="bg-[#00426E] hover:bg-[#00426E]/90"
              >
                  {(createUser.status === "pending" || updateUser.status === "pending") ? (
                  <Loader className="w-5 h-5 mr-2" />
                  ) : userId ? (
                    "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagementForm;
