import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, Video } from "lucide-react";

const UploadMaterials = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]); // Last 3 uploaded materials
  const [search, setSearch] = useState("");

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
      fetchMaterials(); // Refresh list
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

  const fetchMaterials = async () => {
    try {
      const res = await axios.get("/api/materials?limit=3", { withCredentials: true });
      setMaterials(res.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((mat) =>
    mat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
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
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.mp4"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <p className="text-xs text-gray-400 mt-1">
              Supported formats: PDF, Word, PPT, ZIP, MP4
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-500" />
            Last 3 Uploaded Class Recordings
          </h3>
          <Input
            placeholder="Search by title..."
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500 italic">No recent materials found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredMaterials.map((mat) => {
              const date = new Date(mat.createdAt);
              const formattedDate = isNaN(date.getTime())
                ? "Unknown date"
                : date.toLocaleString();

              return (
                <Card key={mat._id} className="border border-gray-200 shadow-sm">
                  <CardContent className="p-4 space-y-2">
                    <h4 className="text-lg font-bold">{mat.title}</h4>
                    {mat.description && (
                      <p className="text-sm text-gray-600">{mat.description}</p>
                    )}
                    <p className="text-xs text-gray-400">Uploaded: {formattedDate}</p>
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View / Download
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadMaterials;
