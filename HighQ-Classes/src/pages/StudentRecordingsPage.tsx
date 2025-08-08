import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Play,
    Download,
    Eye,
    Clock,
    Calendar,
    Search,
    Filter,
    VideoIcon,
    BookOpen,
    Users,
} from "lucide-react";
import { format } from "date-fns";
import RecordingService, { Recording } from "@/API/services/recordingService";

interface StudentRecordingsPageProps {
    userRole: "student";
}

const StudentRecordingsPage: React.FC<StudentRecordingsPageProps> = ({
    userRole,
}) => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedRecording, setSelectedRecording] =
        useState<Recording | null>(null);

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
        } catch (error) {
            setMessage({ type: "error", text: "Failed to fetch recordings" });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handlePlayRecording = async (recording: Recording) => {
        // Track the view
        await RecordingService.trackRecordingView(recording._id);

        // Update local state to increment view count
        setRecordings((prev) =>
            prev.map((r) =>
                r._id === recording._id ? { ...r, views: r.views + 1 } : r
            )
        );

        setSelectedRecording(recording);
    };

    const handleDownloadRecording = (recording: Recording) => {
        window.open(recording.fileUrl, "_blank");
    };

    // Filter recordings
    const filteredRecordings = recordings.filter((recording) => {
        const matchesSearch =
            recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recording.subject
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            recording.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesSubject =
            selectedSubject === "all" || recording.subject === selectedSubject;

        return matchesSearch && matchesSubject;
    });

    // Get unique subjects for filter
    const subjects = Array.from(new Set(recordings.map((r) => r.subject)));

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "Unknown";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Class Recordings</h1>
                <Badge variant="outline" className="text-sm">
                    {filteredRecordings.length} recordings available
                </Badge>
            </div>

            {message && (
                <Alert
                    className={
                        message.type === "success"
                            ? "border-green-500"
                            : "border-red-500"
                    }
                >
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            {/* Search and Filter Controls */}
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

                <TabsContent value="grid" className="space-y-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                    <CardContent className="p-4">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRecordings.map((recording) => (
                                <Card
                                    key={recording._id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <div className="relative">
                                        {recording.thumbnailUrl ? (
                                            <img
                                                src={recording.thumbnailUrl}
                                                alt={recording.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                                                <VideoIcon className="h-16 w-16 text-blue-500" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-black/50 text-white"
                                            >
                                                {formatDuration(
                                                    recording.duration
                                                )}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                            {recording.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                            {recording.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                {recording.subject}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {recording.views} views
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                            <Calendar className="h-3 w-3" />
                                            {format(
                                                new Date(recording.createdAt),
                                                "MMM dd, yyyy"
                                            )}
                                            <span>•</span>
                                            <Users className="h-3 w-3" />
                                            {recording.batch.name}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() =>
                                                    handlePlayRecording(
                                                        recording
                                                    )
                                                }
                                                className="flex-1"
                                                size="sm"
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                Play
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleDownloadRecording(
                                                        recording
                                                    )
                                                }
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!loading && filteredRecordings.length === 0 && (
                        <div className="text-center py-12">
                            <VideoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No recordings found
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm || selectedSubject !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No recordings have been uploaded yet"}
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="list" className="space-y-4">
                    {filteredRecordings.map((recording) => (
                        <Card
                            key={recording._id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-14 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
                                        <VideoIcon className="h-8 w-8 text-blue-500" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg mb-1">
                                            {recording.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                                            {recording.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{recording.subject}</span>
                                            <span>•</span>
                                            <span>{recording.views} views</span>
                                            <span>•</span>
                                            <span>
                                                {formatDuration(
                                                    recording.duration
                                                )}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {format(
                                                    new Date(
                                                        recording.createdAt
                                                    ),
                                                    "MMM dd, yyyy"
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            onClick={() =>
                                                handlePlayRecording(recording)
                                            }
                                            size="sm"
                                        >
                                            <Play className="h-4 w-4 mr-2" />
                                            Play
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                handleDownloadRecording(
                                                    recording
                                                )
                                            }
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* Video Player Modal */}
            {selectedRecording && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {selectedRecording.title}
                                    </h2>
                                    <p className="text-gray-600">
                                        {selectedRecording.subject} •{" "}
                                        {selectedRecording.batch.name}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => setSelectedRecording(null)}
                                    variant="outline"
                                    size="sm"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                <video
                                    controls
                                    className="w-full h-full"
                                    src={selectedRecording.fileUrl}
                                    poster={selectedRecording.thumbnailUrl}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            {selectedRecording.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Description
                                    </h3>
                                    <p className="text-gray-700">
                                        {selectedRecording.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRecordingsPage;
