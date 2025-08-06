import React, { useEffect, useState } from "react";

type Gender = "male" | "female" | "other";
type AttendanceStatus = "present" | "absent" | "leave";
type StudentStatus = "pending" | "active" | "suspended" | "inactive";
type ThemeOption = "light" | "dark" | "auto";

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
}

interface EnrolledCourse {
  course: Course;
  enrollmentDate: string;
  status: "active" | "completed" | "dropped";
}

interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  batch: Batch;
}

interface Attendance {
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
  records: AttendanceRecord[];
}

interface ExamHistoryItem {
  examId: string;
  examTitle: string;
  score: number;
  total: number;
  percentage: number;
  grade: string;
  date: string;
}

interface PaymentHistoryItem {
  amount: number;
  date: string;
  method: string;
  note?: string;
}

interface Resource {
  title: string;
  fileUrl: string;
  uploadedAt: string;
  batch: string;
}

interface NotificationsPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface Preferences {
  notifications: NotificationsPreferences;
  theme: ThemeOption;
  language: string;
}

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profilePicture: string;
  gender?: Gender;
  dateOfBirth?: string;
  parentName: string;
  parentContact: string;
  address?: Address;
  batch?: Batch;
  courses: Course[];
  enrolledCourses: EnrolledCourse[];
  grade: string;
  schoolName: string;
  joinDate: string;
  attendance: Attendance;
  examHistory: ExamHistoryItem[];
  paymentHistory: PaymentHistoryItem[];
  resources: Resource[];
  status: StudentStatus;
  lastLogin?: string;
  preferences: Preferences;
}

const staticProfile: StudentProfile = {
  _id: "student1",
  name: "Alice Johnson",
  email: "alice.johnson@example.com",
  mobile: "9876543210",
  profilePicture: "/placeholder.svg",
  gender: "female",
  dateOfBirth: "2005-06-15T00:00:00.000Z",
  parentName: "Mary Johnson",
  parentContact: "8765432109",
  address: {
    street: "123 Maple Street",
    city: "Springfield",
    state: "Illinois",
    zipCode: "62704",
    country: "USA",
  },
  batch: { _id: "batch1", name: "Batch A" },
  courses: [
    { _id: "course1", name: "Computer Science Engineering" },
    { _id: "course2", name: "MERN Fullstack" },
  ],
  enrolledCourses: [
    {
      course: { _id: "course1", name: "Computer Science Engineering" },
      enrollmentDate: "2025-02-01T00:00:00.000Z",
      status: "active",
    },
  ],
  grade: "10",
  schoolName: "Springfield High School",
  joinDate: "2024-01-10T00:00:00.000Z",
  attendance: {
    percentage: 80,
    totalClasses: 25,
    attendedClasses: 20,
    records: [
      {
        date: "2025-07-21T00:00:00.000Z",
        status: "present",
        batch: { _id: "batch1", name: "Batch A" },
      },
      {
        date: "2025-07-22T00:00:00.000Z",
        status: "absent",
        batch: { _id: "batch1", name: "Batch A" },
      },
    ],
  },
  examHistory: [
    {
      examId: "exam1",
      examTitle: "Midterm Exam",
      score: 85,
      total: 100,
      percentage: 85,
      grade: "A",
      date: "2025-06-15T00:00:00.000Z",
    },
  ],
  paymentHistory: [
    {
      amount: 500,
      date: "2025-01-15T00:00:00.000Z",
      method: "Credit Card",
      note: "Monthly tuition",
    },
  ],
  resources: [
    {
      title: "CS Notes",
      fileUrl: "/files/cs_notes.pdf",
      uploadedAt: "2025-03-01T00:00:00.000Z",
      batch: "Batch A",
    },
  ],
  status: "active",
  lastLogin: "2025-08-06T08:30:00.000Z",
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    theme: "light",
    language: "en",
  },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setProfile(staticProfile);
    setEmailInput(staticProfile.email);
    setMobileInput(staticProfile.mobile);
  }, []);

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "-";

  const isValidEmail = (email: string) =>
    /^\S+@\S+\.\S+$/.test(email.trim());

  const isValidMobile = (mobile: string) => /^[0-9]{10}$/.test(mobile.trim());

  const handleEditClick = () => {
    setEditing(true);
    setEmailInput(profile.email);
    setMobileInput(profile.mobile);
    setError("");
  };

  const handleCancelClick = () => {
    setEditing(false);
    setError("");
  };

  const handleSaveClick = async () => {
    setError("");
    if (!isValidEmail(emailInput)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidMobile(mobileInput)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      // Replace with actual API call:
      // const res = await fetch("/api/student/update-contact", { ... });

      await new Promise((r) => setTimeout(r, 1000)); // simulate API delay

      setProfile({
        ...profile,
        email: emailInput.trim(),
        mobile: mobileInput.trim(),
      });

      setEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred while updating profile.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6">Student Profile</h2>

      <section className="flex items-center gap-6 mb-10">
        <img
          src={profile.profilePicture}
          alt={`${profile.name} profile`}
          className="w-28 h-28 rounded-full object-cover border border-gray-200 shadow-md"
        />
        <div>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-gray-600">
            <span className="font-semibold">Status:</span> {profile.status}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Last Login:</span>{" "}
            {formatDate(profile.lastLogin)}
          </p>
        </div>
      </section>

      <section className="mb-10">
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Email:
          </label>
          {editing ? (
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={loading}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile.email}</p>
          )}
        </div>
        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Mobile:
          </label>
          {editing ? (
            <input
              type="tel"
              pattern="[0-9]{10}"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value)}
              disabled={loading}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile.mobile}</p>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-600 mb-4 font-medium">{error}</p>
        )}

        {/* Buttons */}
        {editing ? (
          <div className="space-x-3">
            <button
              onClick={handleSaveClick}
              disabled={loading}
              className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancelClick}
              disabled={loading}
              className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEditClick}
            className="px-5 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition"
          >
            Edit Contact Info
          </button>
        )}
      </section>

      {/* The rest of the profile remains the same (unchanged) */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Personal Details</h3>
        <p>
          <strong>Gender:</strong> {profile.gender || "-"}
        </p>
        <p>
          <strong>Date of Birth:</strong> {formatDate(profile.dateOfBirth)}
        </p>
        <p>
          <strong>Parent's Name:</strong> {profile.parentName}
        </p>
        <p>
          <strong>Parent's Contact:</strong> {profile.parentContact}
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Address</h3>
        <p>
          {profile.address?.street || "-"}, {profile.address?.city || "-"},{" "}
          {profile.address?.state || "-"},<br />
          {profile.address?.zipCode || "-"}, {profile.address?.country || "-"}
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Batch & Courses</h3>
        <p>
          <strong>Batch:</strong> {profile.batch?.name || "-"}
        </p>
        <p>
          <strong>Courses:</strong>{" "}
          {profile.courses.length > 0
            ? profile.courses.map((c) => c.name).join(", ")
            : "-"}
        </p>
        <p>
          <strong>Enrolled Courses:</strong>{" "}
          {profile.enrolledCourses.length > 0
            ? profile.enrolledCourses
                .map(
                  (ec) =>
                    `${ec.course.name} (Enrolled: ${formatDate(
                      ec.enrollmentDate
                    )}, Status: ${ec.status})`
                )
                .join("; ")
            : "-"}
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Academic Info</h3>
        <p>
          <strong>Grade:</strong> {profile.grade}
        </p>
        <p>
          <strong>School:</strong> {profile.schoolName}
        </p>
        <p>
          <strong>Join Date:</strong> {formatDate(profile.joinDate)}
        </p>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Attendance Summary</h3>
        <p>
          {profile.attendance.attendedClasses} /{" "}
          {profile.attendance.totalClasses} classes attended —{" "}
          {profile.attendance.percentage}%
        </p>
        <h4 className="mt-4 font-semibold text-lg">Recent Records</h4>
        <ul className="list-disc pl-5">
          {profile.attendance.records.length > 0 ? (
            profile.attendance.records.map((rec, i) => (
              <li key={i}>
                {formatDate(rec.date)} —{" "}
                {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)} (
                Batch: {rec.batch.name})
              </li>
            ))
          ) : (
            <li>No attendance records available.</li>
          )}
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Exam History</h3>
        <ul className="list-disc pl-5">
          {profile.examHistory.length > 0 ? (
            profile.examHistory.map((exam) => (
              <li key={exam.examId}>
                {exam.examTitle} ({formatDate(exam.date)}): {exam.score}/
                {exam.total} ({exam.percentage}%, Grade: {exam.grade})
              </li>
            ))
          ) : (
            <li>No exam records available.</li>
          )}
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Payment History</h3>
        <ul className="list-disc pl-5">
          {profile.paymentHistory.length > 0 ? (
            profile.paymentHistory.map((payment, idx) => (
              <li key={idx}>
                {formatDate(payment.date)} - {payment.amount} via{" "}
                {payment.method} {payment.note ? `(${payment.note})` : ""}
              </li>
            ))
          ) : (
            <li>No payment records available.</li>
          )}
        </ul>
      </section>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Resources</h3>
        <ul className="list-disc pl-5">
          {profile.resources.length > 0 ? (
            profile.resources.map((res, idx) => (
              <li key={idx}>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {res.title}
                </a>{" "}
                (Batch: {res.batch}, Uploaded: {formatDate(res.uploadedAt)})
              </li>
            ))
          ) : (
            <li>No resources available.</li>
          )}
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Preferences</h3>
        <p>
          <strong>Notifications:</strong> Email:{" "}
          {profile.preferences.notifications.email ? "Yes" : "No"}, SMS:{" "}
          {profile.preferences.notifications.sms ? "Yes" : "No"}, Push:{" "}
          {profile.preferences.notifications.push ? "Yes" : "No"}
        </p>
        <p>
          <strong>Theme:</strong> {profile.preferences.theme}
        </p>
        <p>
          <strong>Language:</strong> {profile.preferences.language}
        </p>
      </section>
    </div>
  );
}
