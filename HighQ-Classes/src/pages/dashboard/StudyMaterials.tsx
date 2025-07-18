
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Search, BookOpen, FileCode, Video } from "lucide-react";

const StudyMaterials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample study materials data
  const materials = {
    physics: [
      {
        id: 1,
        title: "Mechanics - Newton's Laws",
        description: "Comprehensive notes on Newton's Laws of Motion with examples",
        uploadedBy: "Dr. Priya Singh",
        uploadDate: "2023-03-15",
        type: "pdf",
        size: "2.3 MB",
      },
      {
        id: 2,
        title: "Wave Optics",
        description: "Study material for wave optics including interference and diffraction",
        uploadedBy: "Dr. Rajan Verma",
        uploadDate: "2023-04-02",
        type: "pdf",
        size: "3.1 MB",
      },
      {
        id: 3,
        title: "Electromagnetism - Maxwell's Equations",
        description: "Detailed explanations of Maxwell's Equations with applications",
        uploadedBy: "Dr. Priya Singh",
        uploadDate: "2023-04-10",
        type: "pdf",
        size: "4.2 MB",
      },
    ],
    chemistry: [
      {
        id: 1,
        title: "Organic Chemistry - Reaction Mechanisms",
        description: "Key reaction mechanisms in organic chemistry with practice problems",
        uploadedBy: "Dr. Alok Sharma",
        uploadDate: "2023-03-20",
        type: "pdf",
        size: "3.5 MB",
      },
      {
        id: 2,
        title: "Chemical Bonding",
        description: "Comprehensive notes on different types of chemical bonds",
        uploadedBy: "Dr. Meena Khanna",
        uploadDate: "2023-04-05",
        type: "pdf",
        size: "2.8 MB",
      },
    ],
    mathematics: [
      {
        id: 1,
        title: "Calculus - Integration Techniques",
        description: "Advanced integration methods with solved examples",
        uploadedBy: "Prof. Ramesh Kumar",
        uploadDate: "2023-03-18",
        type: "pdf",
        size: "4.0 MB",
      },
      {
        id: 2,
        title: "Vectors and 3D Geometry",
        description: "Notes on vectors, 3D geometry with illustrations",
        uploadedBy: "Prof. Akshay Patel",
        uploadDate: "2023-04-08",
        type: "pdf",
        size: "3.2 MB",
      },
      {
        id: 3,
        title: "Probability and Statistics",
        description: "Comprehensive coverage of probability theory and statistical methods",
        uploadedBy: "Prof. Ramesh Kumar",
        uploadDate: "2023-04-12",
        type: "pdf",
        size: "3.7 MB",
      },
    ],
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "doc":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "ppt":
        return <FileCode className="h-6 w-6 text-orange-500" />;
      case "video":
        return <Video className="h-6 w-6 text-purple-500" />;
      default:
        return <BookOpen className="h-6 w-6 text-gray-500" />;
    }
  };

  const filterMaterials = (materials: any[]) => {
    if (!searchQuery) return materials;
    
    return materials.filter(
      (material) =>
        material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Study Materials</h1>
            <p className="text-gray-600">Access all your course study materials</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search materials..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="physics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="physics">Physics</TabsTrigger>
            <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
            <TabsTrigger value="mathematics">Mathematics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="physics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Physics Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterMaterials(materials.physics).length > 0 ? (
                    filterMaterials(materials.physics).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex">
                          {getFileIcon(material.type)}
                          <div className="ml-4">
                            <h3 className="font-medium">{material.title}</h3>
                            <p className="text-sm text-gray-600">{material.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded by {material.uploadedBy} on{" "}
                              {new Date(material.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No materials found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chemistry" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Chemistry Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterMaterials(materials.chemistry).length > 0 ? (
                    filterMaterials(materials.chemistry).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex">
                          {getFileIcon(material.type)}
                          <div className="ml-4">
                            <h3 className="font-medium">{material.title}</h3>
                            <p className="text-sm text-gray-600">{material.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded by {material.uploadedBy} on{" "}
                              {new Date(material.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No materials found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mathematics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Mathematics Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filterMaterials(materials.mathematics).length > 0 ? (
                    filterMaterials(materials.mathematics).map((material) => (
                      <div
                        key={material.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex">
                          {getFileIcon(material.type)}
                          <div className="ml-4">
                            <h3 className="font-medium">{material.title}</h3>
                            <p className="text-sm text-gray-600">{material.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploaded by {material.uploadedBy} on{" "}
                              {new Date(material.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Download
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No materials found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudyMaterials;
