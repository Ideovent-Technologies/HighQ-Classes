import React, { useEffect, useState } from "react";
import axios from "axios";
import { Video, Eye, Clock, CalendarX2, BookOpen, Users, Timer, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface Recording {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  subject: string;
  caption?: string; // new caption/tag field (optional)
  batch: { name: string };
  course: { name: string };
  teacher: { name: string };
  accessExpires: string;
  views: number;
  viewedBy: {
    student: string;
    viewCount: number;
    lastViewed: string;
  }[];
  createdAt: string;
}

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await axios.get("/api/recordings?active=true", {
          withCredentials: true,
        });
        const allRecordings = res.data?.data || [];
        const latestThree = allRecordings.slice(0, 3);
        setRecordings(latestThree);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch recordings.");
        toast({
          title: "Error",
          description: "Could not load recordings. Try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecordings();
  }, []);

  const formatDuration = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-navy-600 flex items-center gap-2">
        <Video className="w-6 h-6 text-teal-500" />
        Recent Class Recordings
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recordings.length === 0 ? (
        <p className="text-gray-500">No recent recordings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((rec) => (
            <Card
              key={rec._id}
              className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200"
            >
              <CardContent className="p-4 space-y-2">
                {rec.thumbnailUrl && (
                  <img
                    src={rec.thumbnailUrl}
                    alt={rec.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}

                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-navy-700 line-clamp-2">
                    {rec.title}
                  </h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {rec.views}
                    <Eye className="w-4 h-4" />
                  </Badge>
                </div>

                {rec.caption && (
                  <div className="text-xs text-purple-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {rec.caption}
                  </div>
                )}

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{rec.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span>
                      {rec.batch?.name || "Unknown"} - {rec.course?.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    {formatDuration(rec.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarX2 className="w-3 h-3" />
                    Expires {formatDistanceToNow(new Date(rec.accessExpires), { addSuffix: true })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Uploaded {formatDistanceToNow(new Date(rec.createdAt))} ago
                  </span>
                </div>

                <a
                  href={rec.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-teal-600 font-medium hover:underline mt-2"
                >
                  ▶ Watch Recording
                </a>

                <p className="text-xs text-gray-600 mt-1">
                  Viewed by {rec.viewedBy.length} student{rec.viewedBy.length !== 1 && "s"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recordings;
