
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Trash, Clock, Loader2 } from "lucide-react";
import materialService from "@/API/services/materialService";
import { MaterialUploadData } from "@/types/material.types";

const UploadMaterials = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batchIds, setBatchIds] = useState<string[]>([]);
  const [category, setCategory] = useState<'lecture' | 'assignment' | 'reference' | 'exam'>('lecture');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Real uploaded materials from API
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  
  // Fetch materials from API
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await materialService.getAdminTeacherMaterials();
      if (response.success) {
        setUploadedMaterials(response.materials || []);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !courseId || !title || !batchIds.length) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const uploadData: MaterialUploadData = {
        file: selectedFile,
        title,
        description,
        courseId,
        batchIds,
        category
      };
      
      const onProgress = (progressEvent: any) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(progress);
      };
      
      const response = await materialService.uploadMaterial(uploadData, onProgress);
      
      if (response.success) {
        toast({
          title: "Upload Successful",
          description: "Study material has been uploaded successfully.",
        });
        
        // Reset form
        setSelectedFile(null);
        setCourseId("");
        setTitle("");
        setDescription("");
        setBatchIds([]);
        setCategory('lecture');
        setUploadProgress(0);
        
        // Refresh materials list
        fetchMaterials();
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload material. Please try again.",
        variant: "destructive",
      });
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (materialId: string) => {
    try {
      const response = await materialService.deleteMaterial(materialId);
      if (response.success) {
        setUploadedMaterials(uploadedMaterials.filter((material) => material._id !== materialId));
        toast({
          title: "Success",
          description: "Material deleted successfully!",
        });
      } else {
        throw new Error(response.message || "Delete failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete material. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    }
  };
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
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    Title*
                  </label>
                  <Input
                    id="name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Wave Optics - Interference"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="course">
                    Course*
                  </label>
                  <Select value={courseId} onValueChange={setCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics101">Physics 101</SelectItem>
                      <SelectItem value="chemistry101">Chemistry 101</SelectItem>
                      <SelectItem value="mathematics101">Mathematics 101</SelectItem>
                      <SelectItem value="biology101">Biology 101</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="category">
                    Category*
                  </label>
                  <Select value={category} onValueChange={(value: 'lecture' | 'assignment' | 'reference' | 'exam') => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lecture">Lecture</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="reference">Reference</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="batches">
                    Target Batches* (Select one or more)
                  </label>
                  <div className="space-y-2">
                    {['batch1', 'batch2', 'batch3', 'batch4'].map((batchId) => (
                      <label key={batchId} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={batchIds.includes(batchId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBatchIds([...batchIds, batchId]);
                            } else {
                              setBatchIds(batchIds.filter(id => id !== batchId));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Batch {batchId.slice(-1)}</span>
                      </label>
                    ))}
                  </div>
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
                
                {isUploading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
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
                      key={material._id}
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
                              {material.courseId?.name || 'Unknown Course'}
                            </span>
                            <span>Batches: {material.batchIds?.map(batch => batch.name).join(', ') || 'No Batch'}</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(material.createdAt).toLocaleDateString()}
                            </span>
                            <span>Type: {material.fileType}</span>
                            <span>Views: {material.views || 0}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleDelete(material._id)}
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
