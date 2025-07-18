
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Trash, Clock } from "lucide-react";

const UploadMaterials = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batch, setBatch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Sample uploaded materials
  const [uploadedMaterials, setUploadedMaterials] = useState([
    {
      id: 1,
      title: "Mechanics - Newton's Laws",
      subject: "Physics",
      description: "Comprehensive notes on Newton's Laws of Motion",
      batch: "Physics Batch A",
      uploadDate: "2023-04-05",
      fileSize: "2.3 MB",
      downloads: 24,
    },
    {
      id: 2,
      title: "Organic Chemistry - Reaction Mechanisms",
      subject: "Chemistry",
      description: "Key reaction mechanisms in organic chemistry",
      batch: "Chemistry Batch B",
      uploadDate: "2023-04-02",
      fileSize: "3.5 MB",
      downloads: 18,
    },
    {
      id: 3,
      title: "Integration Techniques",
      subject: "Mathematics",
      description: "Advanced integration methods with examples",
      batch: "Mathematics Batch A",
      uploadDate: "2023-03-28",
      fileSize: "2.8 MB",
      downloads: 31,
    },
  ]);
  
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !subject || !title || !batch) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Add new material to the list
    const newMaterial = {
      id: uploadedMaterials.length + 1,
      title,
      subject,
      description,
      batch,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      downloads: 0,
    };
    
    setUploadedMaterials([newMaterial, ...uploadedMaterials]);
    
    // Reset form
    setSelectedFile(null);
    setSubject("");
    setTitle("");
    setDescription("");
    setBatch("");
    
    toast({
      title: "Upload Successful",
      description: "Study material has been uploaded successfully.",
    });
    
    setIsUploading(false);
  };

  const handleDelete = (id: number) => {
    setUploadedMaterials(uploadedMaterials.filter((material) => material.id !== id));
    
    toast({
      title: "Material Deleted",
      description: "The study material has been removed.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Upload Study Materials</h1>
        <p className="text-gray-600">Share study materials with your students</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload New Material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="title">
                    Title*
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Wave Optics - Interference"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="subject">
                    Subject*
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="batch">
                    Target Batch*
                  </label>
                  <Select value={batch} onValueChange={setBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics Batch A">Physics Batch A</SelectItem>
                      <SelectItem value="Physics Batch B">Physics Batch B</SelectItem>
                      <SelectItem value="Chemistry Batch A">Chemistry Batch A</SelectItem>
                      <SelectItem value="Chemistry Batch B">Chemistry Batch B</SelectItem>
                      <SelectItem value="Mathematics Batch A">Mathematics Batch A</SelectItem>
                      <SelectItem value="Mathematics Batch B">Mathematics Batch B</SelectItem>
                      <SelectItem value="All Batches">All Batches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description about the material..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="file">
                    Upload File*
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                    <label
                      htmlFor="file"
                      className="cursor-pointer block"
                    >
                      <Upload className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                      <p className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
                      </p>
                    </label>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Material
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Uploaded Materials</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedMaterials.length > 0 ? (
                <div className="space-y-4">
                  {uploadedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex justify-between items-start p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-start">
                        <FileText className="h-8 w-8 text-navy-500 mt-1" />
                        <div className="ml-3">
                          <h3 className="font-medium">{material.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-x-4 gap-y-1">
                            <span className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-navy-500 mr-1"></span>
                              {material.subject}
                            </span>
                            <span>Batch: {material.batch}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {material.uploadDate}
                            </span>
                            <span>Size: {material.fileSize}</span>
                            <span>Downloads: {material.downloads}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(material.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 font-medium">No materials uploaded</h3>
                  <p className="text-sm text-gray-500">
                    Your uploaded study materials will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadMaterials;
