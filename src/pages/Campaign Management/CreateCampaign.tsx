// src/pages/Campaign Management/CreateCampaign.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Vector from "../../assets/img/Group 37878.svg"
const CreateCampaign = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>(["New York", "California"]);
  const [selectedWill, setSelectedWill] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    navigate('/create-campaign/questionnaire');
  };

  return (
    <Layout>
      <div className="bg-white rounded-lg p-12  min-h-[calc(100vh-7rem)] shadow-sm">
        <div className="flex items-center gap-2 mb-6 -mt-3">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent"
            onClick={handleBack}
          >
            <img src={Vector} alt="" className="h-6 w-6" />
            {/* <ChevronLeft className="h-5 w-5" /> */}
          </Button>
          <h1 className="text-2xl font-semibold">Create Campaign</h1>
        </div>

        <div className="max-w-[400px] space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Campaign name</label>
            <Input 
              placeholder="Enter Campaign Name" 
              className="w-full border-gray-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="will">Will</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            {/* <label className="block mb-2 text-sm font-medium text-gray-700">Selected Categories</label> */}
            <div className="flex gap-2 border border-[#D7D7D7] bg-[#F9F9F9] h-[67px] w-full rounded-[11px]">
              {selectedWill && (
                <div className="bg-[#E7F5FF] text-[#00426E] px-3  mx-3 my-4 rounded-md flex items-center gap-4 text-sm  h-6">
                  Will
                  <button onClick={() => setSelectedWill(false)}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Select Template Card</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Template Here" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="template1">Template 1</SelectItem>
                <SelectItem value="template2">Template 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Select State</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            {/* <label className="block mb-2 text-sm font-medium text-gray-700">Selected States</label> */}
            <div className=" flex-wrap flex gap-1 border border-[#D7D7D7] bg-[#F9F9F9] h-[67px] w-full rounded-[11px]">
              {selectedStates.map((state) => (
                <div key={state} className="bg-[#E7F5FF] text-[#00426E] gap-4 px-3  mx-3 my-4 rounded-lg flex items-center  text-sm  h-6">
                  {state}
                  <button onClick={() => setSelectedStates(states => states.filter(s => s !== state))}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          
        </div>
        <div className="flex justify-end gap-4 pt-6 mt-16">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
             onClick={handleNext}
              className="bg-[#00426E] text-white hover:bg-[#003359] px-6"
            >
              Next
            </Button>
          </div>
      </div>
    </Layout>
  );
};

export default CreateCampaign;