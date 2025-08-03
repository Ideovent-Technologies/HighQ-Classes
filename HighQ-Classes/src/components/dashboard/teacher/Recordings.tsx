import React, { useEffect, useState } from "react";
import {
  Video,
  Eye,
  Clock,
  CalendarX2,
  BookOpen,
  Users,
  Timer,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Recording {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  subject: string;
  caption?: string;
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

const dummyRecordings: Recording[] = [
  {
    _id: "1",
    title: "Introduction to Physics",
    description: "Basic concepts of motion and force",
    fileUrl: "https://example.com/physics-recording.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2021/04/13/02/38/prism-6174502_1280.jpg",
    duration: 3200,
    subject: "Physics",
    caption: "Motion & Force",
    batch: { name: "Batch A" },
    course: { name: "Class 9" },
    teacher: { name: "Mr. Verma" },
    accessExpires: new Date(Date.now() + 7 * 86400000).toISOString(),
    views: 150,
    viewedBy: [{ student: "student1", viewCount: 2, lastViewed: new Date().toISOString() }],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    _id: "2",
    title: "Algebra: Quadratic Equations",
    description: "Solving and graphing quadratics",
    fileUrl: "https://example.com/math-recording.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2020/10/22/10/05/formula-5675604_1280.jpg",
    duration: 2700,
    subject: "Mathematics",
    caption: "Quadratics",
    batch: { name: "Batch B" },
    course: { name: "Class 10" },
    teacher: { name: "Ms. Rao" },
    accessExpires: new Date(Date.now() + 5 * 86400000).toISOString(),
    views: 90,
    viewedBy: [{ student: "student2", viewCount: 1, lastViewed: new Date().toISOString() }],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "3",
    title: "English Literature: The Road Not Taken",
    fileUrl: "https://example.com/english-recording.mp4",
    thumbnailUrl: "https://cdn.pixabay.com/photo/2022/10/07/10/11/road-7504719_1280.jpg",
    duration: 1800,
    subject: "English",
    caption: "Poetry Analysis",
    batch: { name: "Batch C" },
    course: { name: "Class 9" },
    teacher: { name: "Mrs. Das" },
    accessExpires: new Date(Date.now() + 10 * 86400000).toISOString(),
    views: 120,
    viewedBy: [{ student: "student3", viewCount: 3, lastViewed: new Date().toISOString() }],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    setRecordings(dummyRecordings);
  }, []);

  const formatDuration = (seconds: number = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#e0f7fa] via-[#f0f4fd] to-[#ffe0f0]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#1A2540] tracking-tight flex justify-center items-center gap-3">
          <Video className="w-8 h-8 text-[#00bfa6]" />
          Recent Class Recordings
        </h1>
        <p className="mt-2 text-gray-600">Catch up or revise anytime with your recorded classes</p>
      </div>

      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {recordings.map((rec) => (
          <div
            key={rec._id}
            className="rounded-3xl overflow-hidden bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_65px_-10px_rgba(0,0,0,0.15)] transition duration-300"
          >
            <img
              src={rec.thumbnailUrl}
              alt={rec.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1A2540] line-clamp-2">
                  {rec.title}
                </h3>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  <Eye className="w-4 h-4 mr-1" />
                  {rec.views}
                </Badge>
              </div>
              {rec.caption && (
                <div className="text-xs text-purple-700 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {rec.caption}
                </div>
              )}
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" /> {rec.subject}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" /> {rec.batch.name} — {rec.course.name}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3" /> {formatDuration(rec.duration)}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarX2 className="w-3 h-3" /> Expires {formatDistanceToNow(new Date(rec.accessExpires), { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Uploaded {formatDistanceToNow(new Date(rec.createdAt))} ago
                </div>
              </div>
              <a
                href={rec.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#1A2540] hover:bg-[#111a30] text-white font-medium py-2 rounded-lg transition"
              >
                ▶ Watch Recording
              </a>
              <p className="text-xs text-center text-gray-500">
                Viewed by {rec.viewedBy.length} student{rec.viewedBy.length !== 1 && "s"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recordings;
