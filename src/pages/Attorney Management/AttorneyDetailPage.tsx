import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Vector from "../../assets/img/Group 37878.svg";
import EyeImg from "../../assets/img/eye.svg";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttorneyDetails } from "@/hooks/useAttorneys";
import { formatDate } from "@/utils/dateFormat";
import BookLogo from "@/assets/img/Book_logo.svg";

const AttorneyDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const attorneyId = location.state?.attorney?.id;
  const { data: attorney, isLoading, isError } = useAttorneyDetails(attorneyId);
  const [activeTab, setActiveTab] = useState("cases");

  const handleBackClick = () => navigate(-1);

  const handleCaseClick = (caseItem: any) => {
    navigate(`/attorney-case-detail/${attorneyId}/${caseItem.id}`, {
      state: { attorneyId, attorney, caseItem },
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (isError || !attorney) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <h1 className="text-2xl font-semibold text-gray-500">
            Error loading attorney details
          </h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 ">
        <Button
          variant="ghost"
          className="mb-12 text-[#000000] text-[22px] font-[500] flex items-center gap-2"
          onClick={handleBackClick}
        >
          {/* <ChevronLeft className="h-4 w-4" /> */}
          {/* <ChevronLeft className="h-4 w-4" /> */}
          <img src={Vector} alt="" className="w-6 h-6" />
          Attorney Detail
        </Button>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Attorney Name</p>
            <p className="font-medium">
              {attorney.firstName} {attorney.lastName}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="font-medium">{attorney.email || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">State</p>
            <p className="font-medium">{attorney.state?.stateName || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">City</p>
            <p className="font-medium">{attorney.city || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="font-medium">{attorney.role?.name || "N/A"}</p>
          </div>
        </div>

        <Tabs
          defaultValue="cases"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="bg-[#F3F3F3] border border-[#D8D8D8] rounded-md p-1 gap-4 mb-6">
            <TabsTrigger
              value="cases"
              className="data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] rounded-md px-4 py-2"
            >
              Cases Assigned
            </TabsTrigger>

            {attorney.isPrivateAttorney && (
              <>
                <TabsTrigger
                  value="templates"
                  className="data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] rounded-md px-4 py-2"
                >
                  Templates Added
                </TabsTrigger>
                <TabsTrigger
                  value="clauses"
                  className="data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] rounded-md px-4 py-2"
                >
                  Clauses Added
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Cases Tab */}
          <TabsContent value="cases" className="mt-0">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 justify-items-center">
              {attorney.AttorneyCases?.map((caseItem: any) => (
                <Card
                  key={caseItem.id}
                  className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden w-[250px] h-[250px] border border-[#D9D8D8]"
                  onClick={() => handleCaseClick(caseItem)}
                >
                  <div className="bg-[#E7F5FF] p-6 w-full flex justify-center items-center h-[150px]">
                    <img src={BookLogo} alt="Document" className="w-16 h-16" />
                  </div>
                  <CardContent className="p-4 bg-white h-[100px] flex flex-col">
                    <div className="text-left h-full flex flex-col justify-between">
                      <div>
                        {caseItem.state?.stateName && (
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#D4EDFF] text-[#00426E] mb-2">
                            {caseItem.state?.stateName}
                          </span>
                        )}
                        <h3
                          className={`font-semibold text-black text-[18px] ${
                            !caseItem.state?.stateName
                              ? "line-clamp-2"
                              : "line-clamp-1"
                          }`}
                          title={caseItem.caseName}
                        >
                          {caseItem.caseName}
                        </h3>
                      </div>
                      <div className="h-4"></div> {/* Bottom space */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          {attorney.isPrivateAttorney && (
            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 justify-items-center">
                {attorney.templatesAdded?.map((template: any) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden w-[250px] h-[250px] border border-[#D9D8D8]"
                  >
                    <div className="bg-[#E7F5FF] p-6 w-full flex justify-center items-center h-[150px]">
                      <img
                        src={BookLogo}
                        alt="Document"
                        className="w-16 h-16"
                      />
                    </div>
                    <CardContent className="p-4 bg-white h-[100px] flex flex-col">
                      <div className="text-left h-full flex flex-col justify-between">
                        <div>
                          {template.category && (
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#D4EDFF] text-[#00426E] mb-2">
                              {template.category}
                            </span>
                          )}
                          <h3
                            className={`font-semibold text-black text-[18px] ${
                              !template.category
                                ? "line-clamp-2"
                                : "line-clamp-1"
                            }`}
                            title={template.templateCardName}
                          >
                            {template.templateCardName}
                          </h3>
                        </div>
                        <div className="h-4"></div> {/* Bottom space */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Clauses Tab */}
          {attorney.isPrivateAttorney && (
            <TabsContent value="clauses" className="mt-0">
              <Table className="">
                {attorney.clausesAdded?.length > 0 && (
                  <TableHeader>
                    <TableRow className="bg-[#F2FAFF]">
                      <TableHead>S.no</TableHead>
                      <TableHead>Clause Name</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                )}
                <TableBody className="border-l border-r border-b border-[#CFD3D4] ">
                  {attorney.clausesAdded?.map((clause: any, index: number) => (
                    <TableRow key={clause.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{clause.clauseName}</TableCell>
                      <TableCell>{clause.state}</TableCell>
                      <TableCell>{formatDate(clause.date)}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600"
                        >
                          <img src={EyeImg} alt="" />
                          {/* <Eye className="h-5 w-5" /> */}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default AttorneyDetailPage;
