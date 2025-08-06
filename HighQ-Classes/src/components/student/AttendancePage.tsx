import React, { useEffect, useState } from "react";

// Interfaces matching your Mongoose model fields

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface Student {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  name: string;
}

type AttendanceStatus = "present" | "absent" | "leave";

interface Attendance {
  _id: string;
  studentId: Student;   // populated student object
  batchId: Batch;       // populated batch object
  date: string;         // ISO date string
  status: AttendanceStatus;
  markedBy: User;       // populated teacher object who marked attendance
  createdAt: string;
  updatedAt: string;
}

// Static example data simulating backend API response (replace with real fetch)
const staticAttendanceRecords: Attendance[] = [
  {
    _id: "att1",
    studentId: { _id: "stu1", name: "Alice Johnson" },
    batchId: { _id: "batch1", name: "Batch A" },
    date: "2025-08-01T00:00:00.000Z",
    status: "present",
    markedBy: { _id: "teacher1", name: "Mr. Smith" },
    createdAt: "2025-08-01T08:00:00.000Z",
    updatedAt: "2025-08-01T08:05:00.000Z",
  },
  {
    _id: "att2",
    studentId: { _id: "stu1", name: "Alice Johnson" },
    batchId: { _id: "batch1", name: "Batch A" },
    date: "2025-08-02T00:00:00.000Z",
    status: "absent",
    markedBy: { _id: "teacher1", name: "Mr. Smith" },
    createdAt: "2025-08-02T08:00:00.000Z",
    updatedAt: "2025-08-02T08:03:00.000Z",
  },
  {
    _id: "att3",
    studentId: { _id: "stu1", name: "Alice Johnson" },
    batchId: { _id: "batch1", name: "Batch A" },
    date: "2025-08-03T00:00:00.000Z",
    status: "leave",
    markedBy: { _id: "teacher1", name: "Mr. Smith" },
    createdAt: "2025-08-03T08:00:00.000Z",
    updatedAt: "2025-08-03T08:01:00.000Z",
  },
];

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);

  // Replace this effect with your real API call in production
  useEffect(() => {
    // Example API fetch to get attendance for current user could be placed here
    // e.g. fetch("/api/attendance?studentId=...").then(...)
    setAttendanceRecords(staticAttendanceRecords);
  }, []);

  // Helper to get readable status with styles
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "green";
      case "absent":
        return "red";
      case "leave":
        return "orange";
      default:
        return "black";
    }
  };

  return (
    <div>
      <h2>Attendance Records</h2>
      {attendanceRecords.length === 0 ? (
        <p>No attendance records available.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Date</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Batch</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Status</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Marked By</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record._id}>
                <td style={{ padding: "8px" }}>
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "8px" }}>{record.batchId.name}</td>
                <td style={{ padding: "8px", color: getStatusColor(record.status), fontWeight: "bold" }}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </td>
                <td style={{ padding: "8px" }}>{record.markedBy.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
