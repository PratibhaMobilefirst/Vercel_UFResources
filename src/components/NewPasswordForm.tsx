import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import BackArrow from "/lovable-uploads/BackArrow.svg";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useResetPassword } from "@/hooks/useResetPassword";
import { passwordValidationSchema } from "@/validation/validationSchemasetpassword";
import { Loader } from "lucide-react";

const NewPasswordForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();

  const backpage = () => {
    navigate("/");
  };

  const handleSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    resetPasswordMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-0">
      <CardContent className="p-8">
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={passwordValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <div className="flex items-center mb-8">
                <div className="" onClick={backpage}>
                  <img
                    src={BackArrow}
                    alt="Back Arrow"
                    className="h-4 object-contain cursor-pointer"
                  />
                </div>
                <div className="ml-2">
                  <h1 className="text-xl font-medium roboto-font">
                    Create New Password
                  </h1>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Create New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter New Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${
                      errors.password && touched.password
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Enter Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#004b7a] hover:bg-[#00395d] text-white py-2 h-12"
                  disabled={resetPasswordMutation.status === "pending"}
                >
                  {resetPasswordMutation.status === "pending" ? (
                    <Loader className="w-5 h-5 mr-2" />
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default NewPasswordForm;
