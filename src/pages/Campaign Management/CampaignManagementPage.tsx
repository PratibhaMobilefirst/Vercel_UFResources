// src/pages/Campaign Management/CampaignManagementPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Plus from "../../assets/img/plus-square.svg"
const CampaignManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-white rounded-lg p-6  min-h-[calc(100vh-7rem)] shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">Campaign Management</h1>
        
        <div className="flex justify-between mb-10">
          <div className="flex gap-0.5 items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[400px] px-3 py-2 border border-[#D8D8D8] rounded-l-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
            />
            <Button   variant="default"
                  className="bg-[#00426E] py-2 hover:bg-[#003355] text-white rounded-r-md rounded-l-none">
              Search
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-[#F3F3F3] border border-[#D8D8D8] rounded-md p-1 gap-4 mb-6">
              <TabsTrigger 
                value="active"
                className="flex-1 data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] px-4 py-2 rounded"
              >
                Active Campaigns
              </TabsTrigger>
              <TabsTrigger 
                value="inactive"
                className="flex-1 data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] px-4 py-2 rounded"
              >
                Inactive Campaigns
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="default" 
            className="bg-[#00426E] text-white hover:bg-[#003359] ml-4"
            onClick={() => navigate('/create-campaign')}
          >
            <img src={Plus} alt="" />
            Create Campaign
          </Button>
        </div>

        <div className="flex items-center justify-center h-[300px] text-gray-500 text-[30px] font-[500]">
          No campaigns Created Yet
        </div>
      </div>
    </Layout>
  );
};

export default CampaignManagement;