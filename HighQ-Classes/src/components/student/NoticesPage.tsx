import React, { useEffect, useState } from "react";

// Define TypeScript interface for Notice according to your schema
interface Notice {
  _id: string;
  title: string;
  description: string;
  postedBy: {
    _id: string;
    name: string;
    email?: string;
  };
  targetAudience: "all" | "teachers" | "students" | "batch";
  targetBatchIds?: string[];
  isActive: boolean;
  scheduledAt?: string | null; // ISO date string or null
  isScheduled: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// For demo, static data simulating your API response
const staticNotices: Notice[] = [
  {
    _id: "1",
    title: "Welcome to HighQ Classes!",
    description: "Your dashboard is now set up with sample data. Start exploring your courses and schedule.",
    postedBy: { _id: "admin1", name: "Admin User" },
    targetAudience: "students",
    targetBatchIds: [],
    isActive: true,
    scheduledAt: null,
    isScheduled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Exam Schedule Released",
    description: "Midterm exam will be held from 10th to 15th August.",
    postedBy: { _id: "teacher1", name: "Mr. John Doe" },
    targetAudience: "students",
    targetBatchIds: ["batch1"],
    isActive: true,
    scheduledAt: null,
    isScheduled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  // Simulate fetch - replace with real API call later
  useEffect(() => {
    // In real scenario, you'd fetch from backend API e.g.
    // fetch("/api/notices?audience=students")
    //  .then(res => res.json())
    // .then(data => setNotices(data))
    //  .catch(console.error);
    setNotices(staticNotices);
  }, []);

  return (
    <div>
      <h2>All Notices</h2>
      {notices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <ul>
          {notices.map((notice) => (
            <li key={notice._id} style={{ marginBottom: 24, borderBottom: "1px solid #ccc", paddingBottom: 12 }}>
              <h3>{notice.title}</h3>
              <p>{notice.description}</p>
              <p>
                <strong>Posted by:</strong> {notice.postedBy.name}
                {" | "}
                <strong>Date:</strong> {new Date(notice.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Audience:</strong> {notice.targetAudience}
                {notice.targetBatchIds && notice.targetBatchIds.length > 0 && (
                  <> | <strong>Batches:</strong> {notice.targetBatchIds.join(", ")}</>
                )}
              </p>
              {notice.isScheduled && notice.scheduledAt && (
                <p><em>Scheduled for: {new Date(notice.scheduledAt).toLocaleString()}</em></p>
              )}
              {!notice.isActive && <p style={{color: "red"}}><em>This notice is inactive</em></p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
