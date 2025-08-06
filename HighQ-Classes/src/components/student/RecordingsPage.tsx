import React, { useEffect, useState } from "react";

interface Teacher {
  _id: string;
  name: string;
  email?: string;
}

interface Recording {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileId: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  subject: string;
  batch: string; // batch ID or name (simplified)
  course: string; // course ID or name (simplified)
  teacher?: Teacher;
  accessExpires: string; // ISO date string
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Utility function to format duration from seconds to mm:ss
const formatDuration = (duration?: number) => {
  if (!duration) return "-";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

// Static dummy data simulating response from backend (replace with real fetch)
const staticRecordings: Recording[] = [
  {
    _id: "rec1",
    title: "Introduction to React",
    description: "Basics of React Components",
    fileUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    fileId: "cloudinary-file-id-1",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=React+Intro",
    duration: 420,
    subject: "React",
    batch: "batch123",
    course: "course123",
    teacher: { _id: "teacher1", name: "Ms. Jane Smith" },
    accessExpires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    views: 123,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "rec2",
    title: "Advanced MongoDB",
    description: "Aggregation pipeline and indexing",
    fileUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    fileId: "cloudinary-file-id-2",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=MongoDB+Advanced",
    duration: 540,
    subject: "MongoDB",
    batch: "batch123",
    course: "course456",
    teacher: { _id: "teacher2", name: "Mr. John Doe" },
    accessExpires: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // expired yesterday
    views: 98,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "rec3",
    title: "Express.js Middleware",
    description: "Understanding middleware in Express",
    fileUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    fileId: "cloudinary-file-id-3",
    thumbnailUrl: "https://via.placeholder.com/320x180.png?text=Express+Middleware",
    duration: 300,
    subject: "Express.js",
    batch: "batch123",
    course: "course789",
    teacher: { _id: "teacher3", name: "Mrs. Emily Rose" },
    accessExpires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    views: 50,
    isActive: false, // inactive
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    // TODO: Replace with actual API call, e.g. fetch(`/api/recordings?batch=...`)
    setRecordings(staticRecordings);
  }, []);

  // Filter accessible & active recordings based on accessExpires and isActive
  const accessibleRecordings = recordings.filter(
    (rec) =>
      rec.isActive && new Date(rec.accessExpires) > new Date()
  );

  return (
    <div>
      <h2>Recordings</h2>

      {recordings.length === 0 ? (
        <p>No recordings available.</p>
      ) : (
        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}>
          {recordings.map((rec) => {
            const isExpired = new Date(rec.accessExpires) <= new Date();
            return (
              <div
                key={rec._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                  opacity: rec.isActive ? 1 : 0.5,
                  position: "relative",
                }}
              >
                {/* Thumbnail or fallback */}
                <div
                  style={{
                    width: "100%",
                    height: 180,
                    backgroundColor: "#000",
                    marginBottom: 8,
                    borderRadius: 6,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {rec.thumbnailUrl ? (
                    <img
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      No Thumbnail
                    </div>
                  )}
                  {(isExpired || !rec.isActive) && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                        borderRadius: 6,
                      }}
                      title={isExpired ? "Access expired" : "Recording inactive"}
                    >
                      {isExpired ? "Expired" : "Inactive"}
                    </div>
                  )}
                </div>

                <h3 style={{ margin: "8px 0" }}>{rec.title}</h3>
                <p style={{ margin: "8px 0", minHeight: 48 }}>
                  {rec.description || <em>No description</em>}
                </p>
                <p>
                  <strong>Subject:</strong> {rec.subject}
                </p>
                <p>
                  <strong>Teacher:</strong> {rec.teacher?.name || "Unknown"}
                </p>
                <p>
                  <strong>Duration:</strong> {formatDuration(rec.duration)}
                </p>
                <p>
                  <strong>Views:</strong> {rec.views}
                </p>
                <p>
                  <strong>Expires On:</strong>{" "}
                  {new Date(rec.accessExpires).toLocaleDateString()}
                </p>

                {/* Playable video if accessible */}
                {!isExpired && rec.isActive && (
                  <video
                    controls
                    src={rec.fileUrl}
                    style={{ width: "100%", marginTop: 8, borderRadius: 6 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
