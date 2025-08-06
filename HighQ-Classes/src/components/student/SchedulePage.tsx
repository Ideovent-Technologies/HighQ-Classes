import React, { useEffect, useState } from "react";

interface Teacher {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
}

type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface Schedule {
  _id: string;
  teacherId: Teacher;
  batchId: Batch;
  courseId: Course;
  day: Weekday;
  startTime: string; // e.g., "10:00 AM"
  endTime: string; // e.g., "11:00 AM"
  room?: string;
  createdAt: string;
  updatedAt: string;
}

// Static example data simulating populated references and schedule entries
const staticSchedule: Schedule[] = [
  {
    _id: "1",
    teacherId: { _id: "t1", name: "Mrs. Smith" },
    batchId: { _id: "b1", name: "Batch A" },
    courseId: { _id: "c1", name: "Computer Science Engineering" },
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    room: "Room 101",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    teacherId: { _id: "t2", name: "Mr. Johnson" },
    batchId: { _id: "b2", name: "Batch B" },
    courseId: { _id: "c2", name: "MERN Fullstack" },
    day: "Monday",
    startTime: "1:00 PM",
    endTime: "2:30 PM",
    room: "Room 202",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    teacherId: { _id: "t1", name: "Mrs. Smith" },
    batchId: { _id: "b1", name: "Batch A" },
    courseId: { _id: "c1", name: "Computer Science Engineering" },
    day: "Wednesday",
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    room: "Room 101",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    teacherId: { _id: "t3", name: "Dr. Lee" },
    batchId: { _id: "b3", name: "Batch C" },
    courseId: { _id: "c3", name: "Physics" },
    day: "Friday",
    startTime: "9:00 AM",
    endTime: "10:30 AM",
    room: "Lab 3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    // Replace this with your actual API call to fetch schedule for the logged-in user/batch
    // e.g. fetch("/api/schedule?studentId=...").then(...)
    setSchedule(staticSchedule);
  }, []);

  // Group schedule by day
  const groupedByDay = schedule.reduce<Record<Weekday, Schedule[]>>(
    (acc, curr) => {
      if (!acc[curr.day]) {
        acc[curr.day] = [];
      }
      acc[curr.day].push(curr);
      return acc;
    },
    {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    }
  );

  return (
    <div>
      <h2>Schedule</h2>
      {schedule.length === 0 ? (
        <p>No schedule available.</p>
      ) : (
        <>
          {(
            Object.keys(groupedByDay) as Weekday[]
          ).map((day) => {
            const daySchedules = groupedByDay[day];
            if (daySchedules.length === 0) return null;
            return (
              <div key={day} style={{ marginBottom: 32 }}>
                <h3>{day}</h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "left" }}>
                        Time
                      </th>
                      <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "left" }}>
                        Course
                      </th>
                      <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "left" }}>
                        Teacher
                      </th>
                      <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "left" }}>
                        Batch
                      </th>
                      <th style={{ borderBottom: "1px solid #ddd", padding: 8, textAlign: "left" }}>
                        Room
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {daySchedules.map((item) => (
                      <tr key={item._id}>
                        <td style={{ padding: 8 }}>{item.startTime} - {item.endTime}</td>
                        <td style={{ padding: 8 }}>{item.courseId.name}</td>
                        <td style={{ padding: 8 }}>{item.teacherId.name}</td>
                        <td style={{ padding: 8 }}>{item.batchId.name}</td>
                        <td style={{ padding: 8 }}>{item.room || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
