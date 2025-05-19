import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AttorneyTable from "@/components/AttorneyTable";
import { useNavigate } from "react-router-dom";
import { useRoles } from "@/hooks/useRoles";
import { useStates } from "@/hooks/useStates";

const AttorneyManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // This will be used for the actual search
  const [inputValue, setInputValue] = useState(""); // This tracks the input field value
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("all");
  const navigate = useNavigate();
  const limitRole = 1000000;
  const limitState = 50;
  const [rolesPage, setRolesPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [status, setStatus] = useState("");
  const [privateAttorney, setPrivateAttorney] = useState("");

  const { data: rolesData } = useRoles(rolesPage, limitRole);
  console.log({ rolesData });
  const { data: statesData } = useStates(rolesPage, limitState, "");
  console.log({ statesData });

  const handleSearch = () => {
    setSearchQuery(inputValue.trim()); // Update the search query only when button is clicked
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLimitChange = (value: string) => {
    setLimit(value);
  };

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSearchQuery("");
    }
  }, [inputValue]);

  return (
    <Layout>
      <TooltipProvider>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Attorney Management</h2>

          <div className="mb-6">
            {/* Row 1: Search Input + Button */}
            <div className="flex gap-4 mb-6">
              <div className="flex w-[45%] gap-0.5">
                <input
                  type="text"
                  placeholder="Search by Attorney Name"
                  className="px-3 py-2 border border-[#D8D8D8] rounded-l-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#00426E]"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  variant="default"
                  className="bg-[#00426E] hover:bg-[#003355] text-white rounded-r-md rounded-l-none"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Row 2: State, City, Role dropdowns */}
            <div className="flex gap-6">
              <div className="w-36">
                <p className="text-sm text-gray-500 mb-2">State</p>
                <Select onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ maxHeight: "30vh", overflowY: "scroll" }}
                  >
                    <SelectItem value="all">All States</SelectItem>
                    {statesData?.data?.data?.map((roleItem) => {
                      if (roleItem.stateName) {
                        return (
                          <SelectItem
                            key={roleItem.id}
                            value={roleItem.stateName}
                          >
                            {roleItem.stateName}
                          </SelectItem>
                        );
                      }
                      return null;
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-36">
                <p className="text-sm text-gray-500 mb-2 ">City</p>
                <Select onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All " />
                  </SelectTrigger>
                  <SelectContent
                    style={{ maxHeight: "30vh", overflowY: "scroll" }}
                  >
                    <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <p className="text-sm text-gray-500 mb-2">Role</p>
                <Select onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ maxHeight: "30vh", overflowY: "scroll" }}
                  >
                    <SelectItem value="all">All Roles</SelectItem>
                    {rolesData?.data?.data?.map((roleItem) => {
                      if (roleItem.name) {
                        return (
                          <SelectItem key={roleItem.id} value={roleItem.name}>
                            {roleItem.name}
                          </SelectItem>
                        );
                      }
                      return null;
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40 mt-7">
                <Select onValueChange={handleLimitChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select by Rows" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ maxHeight: "30vh", overflowY: "scroll" }}
                  >
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36 mt-7">
                <Select onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select by Status" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ maxHeight: "30vh", overflowY: "scroll" }}
                  >
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-36 mt-7">
                <Select onValueChange={setPrivateAttorney}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select by Private Attorney" />
                  </SelectTrigger>
                  <SelectContent
                    style={{ maxHeight: "30vh", overflowY: "scroll" }}
                  >
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <AttorneyTable
            // searchTerm={searchTerm}
            state={state === "all" ? "" : state}
            searchTerm={searchQuery} // Pass the searchQuery instead of inputValue
            city={city}
            role={role === "all" ? "" : role}
            limitRow={limit === "All" ? 1000000 : Number(limit)}
            statusValue={status === "all" ? "" : status}
            privateAttorneyValue={
              privateAttorney === "all" ? "" : privateAttorney
            }
          />
        </div>
      </TooltipProvider>
    </Layout>
  );
};

export default AttorneyManagement;
