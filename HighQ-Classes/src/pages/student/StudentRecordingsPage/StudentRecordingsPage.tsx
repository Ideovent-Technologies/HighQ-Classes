import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import RecordingService, { Recording } from "@/API/services/recordingService";

import RecordingGrid from "./RecordingGrid";
import RecordingList from "./RecordingList";
import VideoPlayerModal from "./VideoPlayerModal";

const StudentRecordingsPage: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const result = await RecordingService.getStudentRecordings();
      if (result.success && result.recordings) {
        setRecordings(result.recordings);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to fetch recordings" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePlayRecording = async (recording: Recording) => {
    await RecordingService.trackRecordingView(recording._id);
    setRecordings((prev) =>
      prev.map((r) => (r._id === recording._id ? { ...r, views: r.views + 1 } : r))
    );
    setSelectedRecording(recording);
  };

  const handleDownloadRecording = (recording: Recording) => {
    window.open(recording.fileUrl, "_blank");
  };

  const filteredRecordings = recordings.filter((recording) => {
    const matchesSearch =
      recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recording.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = selectedSubject === "all" || recording.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(recordings.map((r) => r.subject)));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Class Recordings</h1>
        <Badge variant="outline" className="text-sm">
          {filteredRecordings.length} recordings available
        </Badge>
      </div>

      {message && (
        <Alert className={message.type === "success" ? "border-green-500" : "border-red-500"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search recordings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <RecordingGrid
            recordings={filteredRecordings}
            loading={loading}
            onPlay={handlePlayRecording}
            onDownload={handleDownloadRecording}
          />
        </TabsContent>

        <TabsContent value="list">
          <RecordingList
            recordings={filteredRecordings}
            onPlay={handlePlayRecording}
            onDownload={handleDownloadRecording}
          />
        </TabsContent>
      </Tabs>

      {selectedRecording && (
        <VideoPlayerModal recording={selectedRecording} onClose={() => setSelectedRecording(null)} />
      )}
    </div>
  );
};

export default StudentRecordingsPage;
