import React, { useEffect, useState } from "react";
import axios from "axios";
import { Video, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface Recording {
  _id: string;
  title: string;
  url: string;
  uploadedAt: string;
  views: number;
  viewedBy: {
    student: string;
    viewCount: number;
    lastViewed: string;
  }[];
}

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const res = await axios.get("/api/recordings/teacher", {
          withCredentials: true,
        });
        setRecordings(res.data || []);
      } catch (err: any) {
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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-navy-600 flex items-center gap-2">
        <Video className="w-6 h-6 text-teal-500" />
        Uploaded Recordings
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recordings.length === 0 ? (
        <p className="text-gray-500">No recordings uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordings.map((rec) => (
            <Card
              key={rec._id}
              className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg text-navy-700">{rec.title}</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {rec.views}
                    <Eye className="w-4 h-4" />
                  </Badge>
                </div>

                <p className="text-sm text-gray-500">
                  Uploaded {formatDistanceToNow(new Date(rec.uploadedAt))} ago
                </p>

                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-600 hover:underline"
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
