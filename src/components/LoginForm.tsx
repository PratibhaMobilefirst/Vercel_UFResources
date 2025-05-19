import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Logo from "/lovable-uploads/Logo.svg";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/useLogin";
import validationSchemaLogin from "@/validation/validationSchemaLogin";
import { Loader } from "lucide-react";
const LoginForm = () => {
  const loginMutation = useLogin();
  console.log({ loginMutation });

  // Handle form submission
  const handleSubmit = (values: { email: string; password: string }) => {
    // Simulate a login attempt

    const data = {
      username: values.email,
      password: values.password,
    };
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-0">
      <CardContent className="p-8">
        <div className="flex justify-center mb-8">
          <img
            src={Logo}
            alt="Legacy Assurance Plan"
            className="h-20 object-contain"
          />
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchemaLogin}
          onSubmit={handleSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${
                      errors.email && touched.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
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
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                  <div className="flex justify-end mt-1">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#004b7a] hover:bg-[#00395d] text-white py-2 h-12"
                  disabled={loginMutation.status === "pending"}
                >
                  {/* Login */}
                  {loginMutation.status === "pending" ? (
                    <Loader className="w-5 h-5 mr-2" />
                  ) : (
                    "Login"
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

export default LoginForm;
