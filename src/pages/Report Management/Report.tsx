import Layout from "@/components/Layout";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, ChevronLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsageData {
  id: string;
  clauseName: string;
  templateUsed: string;
  templateCategory: string;
  noOfTimeUsed: number;
}

export function ReportPage() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedItem, setSelectedItem] = useState<UsageData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const dummyData: UsageData[] = [
    {
      id: "001",
      clauseName: " ipsum",
      templateUsed: "Simple Will Document",
      templateCategory: "Will",
      noOfTimeUsed: 100,
    },
    {
      id: "002",
      clauseName: "Lorem ipsum",
      templateUsed: "Simple Will Document",
      templateCategory: "Trust",
      noOfTimeUsed: 34,
    },
    {
      id: "003",
      clauseName: "rem ipsum",
      templateUsed: "Simple Will Document",
      templateCategory: "Trust",
      noOfTimeUsed: 123,
    },
    {
      id: "004",
      clauseName: "psum",
      templateUsed: "Simple Will Document",
      templateCategory: "Trust",
      noOfTimeUsed: 76,
    },
  ];

  const filteredData = dummyData.filter((item) => {
    const matchesSearch = item.clauseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.templateCategory.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div className="space-y-4">
        {view === 'list' ? (
          <Card className="shadow-sm">
            <CardHeader className="border-b px-6 py-4">
              <h2 className="text-xl font-bold">
                Clause Suggestion usage report
              </h2>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Search by Clause name..."
                    className="px-3 py-2 border rounded-md flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit" className="bg-blue-600 text-white">
                    Search
                  </Button>
                </form>
                <div className="mb-4">
                  <Select 
                    defaultValue="all" 
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="will">Will</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold w-[80px] text-center">S.no</TableHead>
                    <TableHead className="font-bold text-center">Clause Name</TableHead>
                    <TableHead className="font-bold text-center">Template Used In</TableHead>
                    <TableHead className="font-bold text-center">Category</TableHead>
                    <TableHead className="font-bold text-center">No of time Used</TableHead>
                    <TableHead className="font-bold w-[100px] text-center">Preview Document</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell className="text-center">{item.clauseName}</TableCell>
                        <TableCell className="text-center">{item.templateUsed}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded-full text-blue-600 inline-block ${
                            item.templateCategory === 'Will' 
                              ? 'bg-blue-300' 
                              : item.templateCategory === 'Trust' 
                                ? 'bg-blue-300' 
                                : 'bg-blue-300'
                          }`}>
                            {item.templateCategory}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">{item.noOfTimeUsed}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedItem(item);
                              setView('detail');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center p-4 border-t">
                <Button 
                  variant="outline" 
                  disabled={filteredData.length === 0}
                  className="text-sm font-medium"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page 1 of {Math.ceil(filteredData.length / 10)}
                </span>
                <Button 
                  variant="outline" 
                  disabled={filteredData.length === 0}
                  className="text-sm font-medium"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardHeader className="border-b px-6 py-4">
             
               <div className="flex  space-x-2 pl-0  items-center ">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView('list')}
                  className="text-blue-600"
                >
                      <ChevronLeft className="h-6  w-6  text-blue-600 hover:text-blue-700" />
                   Report Detail
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-4 gap-x-12 gap-y-4 mb-8">
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Client Name</h3>
                  <p className="font-medium">John Doe</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Template Used</h3>
                  <p className="font-medium">Simple Will Document</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">Category</h3>
                  <p className="font-medium">Will</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 mb-1">No of time Used</h3>
                  <p className="font-medium">100</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500 mb-1.5 block">
                      State
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All States" />
                      </SelectTrigger>
                      <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1.5 block">
                      Attorney Name
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent style={{ maxHeight: '30vh', overflowY: 'scroll' }}>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="john">John Doe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-black text-center">S.no</TableHead>
                      <TableHead className="font-bold text-black text-center">State</TableHead>
                      <TableHead className="font-bold text-black text-center">Attorney</TableHead>
                      <TableHead className="font-bold text-black text-center">No of time Used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell className="text-center">{item.clauseName}</TableCell>
                        <TableCell className="text-center">{item.templateUsed}</TableCell>
                        <TableCell className="text-center">{item.noOfTimeUsed}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center pt-4">
                  <Button 
                    variant="outline" 
                    className="text-sm font-medium"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">Page 1 of 1</span>
                  <Button 
                    variant="outline" 
                    className="text-sm font-medium"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

export default ReportPage;