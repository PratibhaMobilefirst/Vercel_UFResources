import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Tick from "/lovable-uploads/Tick.svg";
import { useNavigate } from "react-router-dom";

const SuccessPopup = () => {
  const navigate = useNavigate();
  const backToLogin = () => {
    navigate("/");
  };
  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-0">
      <CardContent className="p-8">
        <form>
          <div className="space-y-6">
            <div className=" flex items-center justify-center flex-col">
              <div className="">
                <img
                  src={Tick}
                  alt="Legacy Assurance Plan"
                  className="h-20 object-contain cursor-pointer"
                />
              </div>
              <div className="mr-2 mt-4 mb-4">
                <h1 className="text-2xl font-semibold roboto-font text-[#1CCF49]">
                  Password Changed Successfully
                </h1>
              </div>
            </div>
            <div className="flex justify-center w-full items-center">
              <Button
                type="submit"
                onClick={backToLogin}
                className="w-full bg-[#004b7a] hover:bg-[#00395d] text-white py-2 h-12"
              >
                Go back to login
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SuccessPopup;
