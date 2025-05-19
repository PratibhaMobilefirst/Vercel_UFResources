// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ChevronLeft, Copy, X, Check } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Layout from "@/components/Layout";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// const CampaignQuestionnaire = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("contact");
//   const [selectedState, setSelectedState] = useState("New York");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [copied, setCopied] = useState(false);
  
//   const campaignLink = "campaignlink@legalhelp.34546456";

//   const handleBack = () => {
//     navigate(-1);
//   };

//   const handleSubmit = () => {
//     setDialogOpen(true);
//   };
  
//   const handleCopyLink = () => {
//     navigator.clipboard.writeText(campaignLink);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // Common variables
//   const commonVariables = [
//     { key: "first_name", placeholder: "What is your first name?", readOnly: true },
//     { key: "last_name", placeholder: "What is your last name?", readOnly: true },
//     { key: "address", placeholder: "What is your address?", readOnly: true },
//     { key: "contact_num", placeholder: "What is your contact number?", readOnly: true },
//     { key: "email_id", placeholder: "Enter Question here", readOnly: true },
//   ];

//   // Unique variables
//   const uniqueVariables = [
//     { key: "community_property_distribution", placeholder: "Enter Question Here" },
//     { key: "small_estate_exemption_limit", placeholder: "Enter Question Here" },
//     { key: "holographic_will_recognition", placeholder: "Enter Question Here" },
//     { key: "spousal_inheritance_rights", placeholder: "Enter Question Here" },
//     { key: "limited_estate_provision", placeholder: "Enter Question Here" },
//   ];

//   return (
//     <Layout>
//       <div className="bg-white rounded-lg p-6 m-6 min-h-[calc(100vh-7rem)] shadow-sm">
//         <div className="flex items-center gap-2 mb-6">
//           <Button 
//             variant="ghost" 
//             className="p-0 hover:bg-transparent"
//             onClick={handleBack}
//           >
//             <ChevronLeft className="h-5 w-5" />
//           </Button>
//           <h1 className="text-2xl font-semibold">Create Campaign Questionnaire</h1>
//         </div>

//         <div className="max-w-[800px]">
//           <div className="mb-6">
//             <div className="flex items-center gap-4 mb-4">
//               <label className="min-w-[120px] text-sm font-medium text-gray-700">Campaign Name</label>
//               <div className="flex-1 bg-[#E7F5FF] p-3 rounded-md">
//                 Empowerment of Citizens through Legal Awareness and Outreach
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <label className="min-w-[120px] text-sm font-medium text-gray-700">Category</label>
//               <div className="bg-[#E7F5FF] text-[#00426E] px-3 py-1 rounded-md inline-block text-sm">
//                 Will
//               </div>
//             </div>
//           </div>

//           <Tabs defaultValue="common" className="w-full" onValueChange={setActiveTab}>
//             <TabsList className="w-full bg-transparent border-b border-gray-200 mb-6">
//               <div className="flex gap-8">
//                 <TabsTrigger 
//                   value="common"
//                   className="data-[state=active]:border-b-2 data-[state=active]:border-[#00426E] 
//                            data-[state=active]:text-[#00426E] px-0 py-2 rounded-none bg-transparent 
//                            text-gray-600 font-medium border-b-2 border-transparent -mb-[2px]"
//                 >
//                   Common Variables
//                 </TabsTrigger>
//                 <TabsTrigger 
//                   value="unique"
//                   className="data-[state=active]:border-b-2 data-[state=active]:border-[#00426E] 
//                            data-[state=active]:text-[#00426E] px-0 py-2 rounded-none bg-transparent 
//                            text-gray-600 font-medium border-b-2 border-transparent -mb-[2px]"
//                 >
//                   Unique Variables
//                 </TabsTrigger>
//               </div>
//             </TabsList>

//             {/* Contact Variables Tab Content */}
//             <TabsContent value="common">
//               <div className="space-y-6">
//                 {commonVariables.map((variable, index) => (
//                   <div key={index} className="flex gap-8">
//                     <div className="flex-1">
//                       <Input 
//                         value={variable.key}
//                         className="bg-[#F5F8FA] border-0"
//                         readOnly
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <Input 
//                         placeholder={variable.placeholder}
//                         className="border-gray-300"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>

//             {/* Unique Variables Tab Content */}
//             <TabsContent value="unique">
//               <div className="space-y-6">
//                 <div className="mb-8">
//                   <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
//                   <Select value={selectedState} onValueChange={setSelectedState}>
//                     <SelectTrigger className="w-[200px]">
//                       <SelectValue>{selectedState}</SelectValue>
//                     </SelectTrigger>
//                     <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
//                       <SelectItem value="New York">New York</SelectItem>
//                       <SelectItem value="California">California</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {uniqueVariables.map((variable, index) => (
//                   <div key={index} className="flex gap-8">
//                     <div className="flex-1">
//                       <Input 
//                         value={variable.key}
//                         className="bg-[#F5F8FA] border-0"
//                         readOnly
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <div className="relative">
//                         <Input 
//                           placeholder={variable.placeholder}
//                           className="border-gray-300 pr-8"
//                         />
//                         <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">*</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </TabsContent>
//           </Tabs>

//           <div className="flex justify-end gap-4 mt-8">
//             <Button 
//               variant="outline" 
//               onClick={handleBack}
//               className="px-6"
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handleSubmit}
//               className="bg-[#00426E] text-white hover:bg-[#003359] px-6"
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//       </div>
      
//       {/* Campaign Link Dialog */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="sm:max-w-md bg-white p-0 border-0">
//           <DialogHeader className="p-6 bg-white rounded-t-md">
//             <DialogTitle className="text-xl font-semibold">
//               Empowerment of Citizens through Legal Awareness and Outreach
//             </DialogTitle>
//           </DialogHeader>
//           <div className="p-6 space-y-4">
//             <div>
//               <p className="mb-1 text-sm font-medium text-gray-700">Campaign Link</p>
//               <div className="flex items-center gap-2">
//                 <div className="flex-1 bg-gray-50 p-2 border rounded-md text-sm">
//                   {campaignLink}
//                 </div>
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   onClick={handleCopyLink}
//                   className="flex items-center gap-1 h-9"
//                 >
//                   {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                   {copied ? "Copied" : "Copy"}
//                 </Button>
//               </div>
//             </div>
//             <div className="pt-2 flex justify-end">
//               <Button 
//                 className="bg-[#00426E] text-white hover:bg-[#003359] px-6"
//                 onClick={() => setDialogOpen(false)}
//               >
//                 OK
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// };

// export default CampaignQuestionnaire;



import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Vector from "../../assets/img/Group 37878.svg"
const CampaignQuestionnaire = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("contact");
  const [selectedState, setSelectedState] = useState("New York");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const campaignLink = "campaignlink@legalhelp.34546456";

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    setDialogOpen(true);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(campaignLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Common variables
  const commonVariables = [
    { key: "first_name", placeholder: "What is your first name?" },
    { key: "last_name", placeholder: "What is your last name?" },
    { key: "address", placeholder: "What is your address?" },
    { key: "contact_num", placeholder: "What is your contact number?" },
    { key: "email_id", placeholder: "Enter Question here" },
  ];

  // Unique variables
  const uniqueVariables = [
    { key: "community_property_distribution", placeholder: "Enter Question Here" },
    { key: "small_estate_exemption_limit", placeholder: "Enter Question Here" },
    { key: "holographic_will_recognition", placeholder: "Enter Question Here" },
    { key: "spousal_inheritance_rights", placeholder: "Enter Question Here" },
    { key: "limited_estate_provision", placeholder: "Enter Question Here" },
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2 mb-6">
           <Button
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={handleBack}
            >
               <img src={Vector} alt="" className="h-5 w-5" />
              {/* <ChevronLeft className="h-5 w-5" /> */}
              <span className="ml-1 text-[22px] font-[500] ">Create Campaign Questionnaire</span>
            </Button>
          </div>

          <div>
           <div className="mb-6 grid grid-cols-2 gap-4 border border-[#D7D7D7] bg-[#F9F9F9] h-[100px] w-full rounded-[11px] p-4"> {/* Added p-4 here */}
  <div className="flex items-center"> {/* Removed p-4 from here since container has it now */}
    <div>
      <label className="block text-sm text-gray-700 mb-1">Campaign Name</label>
        <div className="text-[22px] font-[600] whitespace-nowrap overflow-hidden text-ellipsis">
        Empowerment of Citizens through Legal Awareness and Outreach
      </div>
    </div>
  </div>
  <div className="flex items-center justify-end pr-12"> {/* Removed p-4 from here */}
    <div>
      <label className="block text-sm text-gray-700 mb-1 text-right">Category</label>
      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md inline-block text-xs font-medium">
        Will
      </div>
    </div>
  </div>
</div>

            <Tabs defaultValue="contact" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="bg-[#F3F3F3] border border-[#D8D8D8] rounded-md p-1 gap-4 mb-6">
                <TabsTrigger 
                  value="contact"
                  className="flex-1 data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] px-4 py-2 rounded"
                >
                  Common Variables
                </TabsTrigger>
                <TabsTrigger 
                  value="unique"
                  className="flex-1 data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#00426E] px-4 py-2 rounded"
                >
                  Unique Variables
                </TabsTrigger>
              </TabsList>

              {/* Contact Variables Tab Content */}
              <TabsContent value="contact">
                <div className="space-y-6">
                  {commonVariables.map((variable, index) => (
                    <div key={index} className="flex gap-8">
                      <div className="flex-1">
                        <Input 
                          value={variable.key}
                          className="bg-blue-100 border-0 text-blue-800"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <Input 
                          placeholder={variable.placeholder}
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Unique Variables Tab Content */}
              <TabsContent value="unique">
                <div className="space-y-6">
                  <div className="mb-8">
                    <label className="block mb-2 text-sm font-medium text-gray-700">State</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue>{selectedState}</SelectValue>
                      </SelectTrigger>
                      <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {uniqueVariables.map((variable, index) => (
                    <div key={index} className="flex gap-8">
                      <div className="flex-1">
                        <Input 
                          value={variable.key}
                          className="bg-blue-100 border-0 text-blue-800"
                          readOnly
                        />
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                          <Input 
                            placeholder={variable.placeholder}
                            className="border-gray-300"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">*</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                className="bg-blue-800 hover:bg-blue-900"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign Link Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Empowerment of Citizens through Legal Awareness and Outreach
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-1 text-sm font-medium">Campaign Link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-50 p-2 border rounded-md text-sm">
                {campaignLink}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyLink}
                className="flex items-center gap-1 h-9"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button 
              className="bg-blue-800 hover:bg-blue-900"
              onClick={() => setDialogOpen(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CampaignQuestionnaire;
