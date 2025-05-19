import Layout from "@/components/Layout";
import TemplateApprovalTable from "@/components/TemplateApprovalTable";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const ApproveTemplatePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <Layout>
      <div className="bg-white rounded-md shadow-sm p-6">
        <h1 className="text-xl font-semibold mb-6">Approve Template</h1>

        {/* <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <Button
              variant="default"
              className="absolute top-0 right-0 h-full px-3 bg-[#00426E]"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div> */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex items-center w-2/5">
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10"
            />
          </div>
          <div className="-ml-4">
            <Button
              variant="default"
              className="h-full px-4 py-[10px] bg-[#00426E] flex items-center"
            >
              {/* <Search className="h-4 w-4" /> */}
              Search
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4  w-7/12">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">State</label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
            Category
            </label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="will">Will</SelectItem>
                <SelectItem value="health">Health POA</SelectItem>
                <SelectItem value="medical">Medical Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TemplateApprovalTable />
      </div>
    </Layout>
  );
};

export default ApproveTemplatePage;
