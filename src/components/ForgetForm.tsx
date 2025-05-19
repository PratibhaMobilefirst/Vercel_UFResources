import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import BackArrow from "/lovable-uploads/BackArrow.svg";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";

import validationSchemaForgetForm from "@/validation/validationSchemaForgetForm";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { Loader } from "lucide-react";

const ForgetForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const forgetPasswordMutation = useForgotPassword();

  const backpage = () => {
    navigate("/");
  };

  const handleSubmit = (values: { email: string }) => {
    forgetPasswordMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-0">
      <CardContent className="p-8">
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchemaForgetForm}
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
              <div className="space-y-6">
                <div className="flex items-center justify-start mb-8">
                  <div className="" onClick={backpage}>
                    <img
                      src={BackArrow}
                      alt="Legacy Assurance Plan"
                      className="h-4 object-contain cursor-pointer"
                    />
                  </div>
                  <div className="ml-2">
                    <h1 className="text-xl font-medium roboto-font">
                      Forgot Password
                    </h1>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${
                      errors.email && touched.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#004b7a] hover:bg-[#00395d] text-white py-2 h-12"
                  disabled={forgetPasswordMutation.status === "pending"}
                >
                  {}
                  {/* Send Reset Link */}
                  {forgetPasswordMutation.status === "pending" ? (
                    <Loader className="w-5 h-5 mr-2" />
                  ) : (
                    "Send Reset Link"
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

export default ForgetForm;
