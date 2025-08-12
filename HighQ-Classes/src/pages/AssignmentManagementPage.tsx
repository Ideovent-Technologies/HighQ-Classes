import React, { useState, useEffect } from "react";
import { useAssignments } from "@/hooks/useAssignments";
import { useTeacherAssignments } from "@/hooks/useTeacherAssignments";
import { useSubmissions } from "@/hooks/useTeacherSubmissions"; // Import the new hook
import { toast } from "@/hooks/use-toast";
import {
  FaTrashAlt,
  FaUpload,
  FaFileAlt,
  FaSpinner,
  FaListAlt,
} from "react-icons/fa";

// Note: Interfaces are defined here to match the data structure from the hooks.
// Assuming your useAssignments hook provides these populated types.
interface Course {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface AssignmentWithDetails {
  _id: string;
  title: string;
  description?: string;
  course: Course;
  batch: Batch;
  dueDate: string;
  totalMarks?: number;
  fileUrl?: string;
}

export default function TeacherAssignments() {
  const [activeTab, setActiveTab] = useState<
    "create" | "assignments" | "reports"
  >("create");

  // Use the existing assignment hooks
  const {
    assignments,
    loading,
    error,
    createAssignment,
    deleteAssignment,
  } = useAssignments();

  const {
    assignedBatches,
    assignedCourses,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useTeacherAssignments();

  // Use the new useSubmissions hook for reports
  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    fetchSubmissionsByTeacher,
    gradeSubmission,
  } = useSubmissions();

  // Fetch submissions when the reports tab becomes active
  useEffect(() => {
    if (activeTab === "reports") {
      fetchSubmissionsByTeacher();
    }
  }, [activeTab, fetchSubmissionsByTeacher]);

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    courseId: "",
    batchId: "",
    dueDate: "",
    totalMarks: "",
    file: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "file" && files) {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.courseId || !form.batchId || !form.dueDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const createRes = await createAssignment({
      title: form.title,
      description: form.description,
      courseId: form.courseId,
      batchId: form.batchId,
      dueDate: form.dueDate,
      totalMarks: form.totalMarks ? Number(form.totalMarks) : undefined,
      file: form.file,
    });

    if (createRes.success) {
      toast({ title: "Assignment created successfully" });
      setForm({
        title: "",
        description: "",
        courseId: "",
        batchId: "",
        dueDate: "",
        totalMarks: "",
        file: null,
      });
      setActiveTab("assignments"); // Switch to assignments tab after creation
    } else {
      toast({ title: "Failed to create assignment", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    // A custom confirmation modal should be used here instead of window.confirm
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      const res = await deleteAssignment(id);
      if (res.success) {
        toast({ title: "Assignment deleted successfully" });
      } else {
        toast({ title: "Failed to delete assignment", variant: "destructive" });
      }
    }
  };

  const combinedLoading = loading || assignmentsLoading;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen font-sans">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-300">
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "create"
              ? "border-blue-600 text-blue-600"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("create")}
        >
          <FaUpload className="inline mr-2" /> Create Assignment
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "assignments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("assignments")}
        >
          <FaListAlt className="inline mr-2" /> All Assignments
        </button>
        <button
          className={`px-4 py-2 font-semibold border-b-2 ${
            activeTab === "reports"
              ? "border-blue-600 text-blue-600"
              : "border-transparent"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          📊 Student Submissions
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "create" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Create Assignment Form (same as before) */}
          <h1 className="text-2xl font-bold mb-4 flex items-center">
            <FaUpload className="mr-3 text-blue-600" /> Create New Assignment
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... your form inputs same as before ... */}
            {/* For brevity, you can paste your form inputs here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Assignment Title"
                value={form.title}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>

            <textarea
              name="description"
              placeholder="Description (Optional)"
              value={form.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="batchId"
                value={form.batchId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              >
                <option value="">Select Batch</option>
                {assignedBatches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>

              <select
                name="courseId"
                value={form.courseId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                required
              >
                <option value="">Select Course</option>
                {assignedCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="totalMarks"
                placeholder="Total Marks (optional)"
                value={form.totalMarks}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
                min={0}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File (optional)
              </label>
              <input
                type="file"
                name="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.txt"
                onChange={handleInputChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-md text-white font-semibold flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <FaUpload />
              <span>Create Assignment</span>
            </button>
          </form>
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Your Assignments</h2>

          {combinedLoading ? (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
              <p className="ml-4">Loading assignments...</p>
            </div>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : assignments.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FaFileAlt className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No assignments found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((a: AssignmentWithDetails) => (
                <div
                  key={a._id}
                  className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{a.title}</h3>
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      {a.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Batch: {a.batch?.name || "N/A"} | Course:{" "}
                      {a.course?.name || "N/A"} | Due:{" "}
                      {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                  >
                    <FaTrashAlt />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "reports" && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Student Submission Reports</h2>
          {submissionsLoading ? (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
              <p className="ml-4">Loading submissions...</p>
            </div>
          ) : submissionsError ? (
            <p className="text-red-600">{submissionsError}</p>
          ) : submissions.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <FaFileAlt className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No submissions found.</p>
            </div>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">
                    Student
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Assignment
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Submitted At
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Grade
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Status
                  </th>
                  <th className="border border-gray-300 p-2 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2">
                      {sub.student?.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {sub.assignment?.title}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {sub.grade ?? "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {sub.status ?? "-"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {sub.fileUrl ? (
                        <a
                          href={sub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View File
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
