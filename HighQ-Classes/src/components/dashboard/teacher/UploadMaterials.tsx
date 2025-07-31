import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";

const UploadMaterials = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!title || !file) {
      toast({
        title: "Missing required fields",
        description: "Please provide a title and a file before uploading.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    setIsUploading(true);
    try {
      await axios.post("/api/materials/upload", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Upload Successful",
        description: "Your study material has been uploaded.",
      });

      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      console.error("Upload Error:", err);
      toast({
        title: "Upload Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-navy-600 flex items-center gap-2">
        <Upload className="w-6 h-6 text-teal-500" />
        Upload Study Material
      </h2>

      <Card className="shadow-md border border-gray-200">
        <CardContent className="space-y-5 p-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title *</label>
            <Input
              placeholder="Enter material title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              placeholder="Optional description (e.g., topics covered, purpose)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">File *</label>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: PDF, Word, PPT, ZIP
            </p>
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Material
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadMaterials;
