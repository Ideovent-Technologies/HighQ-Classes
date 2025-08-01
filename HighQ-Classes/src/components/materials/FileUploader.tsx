// /src/components/materials/FileUploader.tsx
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, File as FileIcon, X } from "lucide-react";
import materialService from "@/API/services/materialService";
import { MaterialUploadData } from "@/types/material.types";

interface FileUploaderProps {
  onUploadComplete: (newMaterial: any) => void;
  //you'd pass these as props from a parent component
  courses: { _id: string, name: string }[];
  batches: { _id: string, name: string }[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete, courses, batches }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      // Pre-fill title with filename for convenience
      setTitle(selectedFile.name.split('.').slice(0, -1).join('.'));
    }
  };
  
  const handleBatchToggle = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setCourseId("");
    setSelectedBatches([]);
    setUploadProgress(0);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file || !title || !courseId || selectedBatches.length === 0) {
      setError("Please fill all required fields and select a file.");
      return;
    }
    
    setIsUploading(true);
    setError(null);

    const uploadData: MaterialUploadData = {
      file,
      title,
      description,
      courseId,
      batchIds: selectedBatches,
    };

    const result = await materialService.uploadMaterial(uploadData, (event) => {
      const progress = Math.round((event.loaded * 100) / event.total);
      setUploadProgress(progress);
    });

    setIsUploading(false);

    if (result.success) {
      onUploadComplete(result.material);
      resetForm();
    } else {
      setError(result.message || "Upload failed.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Material</CardTitle>
        <CardDescription>Fill the details and upload a file.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm">Click or Drag & Drop to Select File</p>
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} className="hidden" />
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5" />
              <span className="text-sm font-medium truncate">{file.name}</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setFile(null)} disabled={isUploading}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Input placeholder="Material Title*" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isUploading} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isUploading} />
        
        <div>
          <label className="text-sm font-medium">Course*</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full p-2 border rounded">
            <option value="">Select a Course</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Assign to Batches*</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {batches.map(b => (
              <Button key={b._id} variant={selectedBatches.includes(b._id) ? "default" : "outline"} onClick={() => handleBatchToggle(b._id)}>
                {b.name}
              </Button>
            ))}
          </div>
        </div>

        {isUploading && <Progress value={uploadProgress} />}
        {error && <p className="text-sm text-destructive">{error}</p>}
        
        <Button onClick={handleSubmit} disabled={isUploading || !file} className="w-full">
          {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Material"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUploader;