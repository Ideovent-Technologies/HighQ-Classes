import React, { useState, useEffect } from "react";
import { useAssignments } from "@/hooks/useAssignments";
import { useTeacherAssignments } from "@/hooks/useTeacherAssignments";
import { useSubmissions } from "@/hooks/useTeacherSubmissions";
import { toast } from "@/hooks/use-toast";
import AdminService from "@/API/services/AdminService";
import {
  FaTrashAlt,
  FaUpload,
  FaFileAlt,
  FaSpinner,
  FaListAlt,
} from "react-icons/fa";

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

  const {
    submissions,
    loading: submissionsLoading,
    error: submissionsError,
    fetchSubmissionsByTeacher,
  } = useSubmissions();

  // State for all courses and batches
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [metaLoading, setMetaLoading] = useState<boolean>(false);

  // Fetch all courses and batches from AdminService
  useEffect(() => {
    const fetchAllCoursesAndBatches = async () => {
      try {
        setMetaLoading(true);
        const [coursesRes, batchesRes] = await Promise.all([
          AdminService.getAllCourses(),
          AdminService.getAllBatches(),
        ]);
        setAllCourses(coursesRes.data.courses || []);
        setAllBatches(batchesRes.data.batches || []);
      } catch (err) {
        toast({
          title: "Failed to fetch courses/batches",
          variant: "destructive",
        });
      } finally {
        setMetaLoading(false);
      }
    };
    fetchAllCoursesAndBatches();
  }, []);

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
      setActiveTab("assignments");
    } else {
      toast({ title: "Failed to create assignment", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
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
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 min-h-screen font-sans text-gray-900">
      {/* Tabs */}
      <div className="flex space-x-6 mb-8 border-b border-indigo-300">
        {["create", "assignments", "reports"].map((tab) => {
          const isActive = activeTab === tab;
          const labels = {
            create: "Create Assignment",
            assignments: "All Assignments",
            reports: "Student Submissions",
          };
          const icons = {
            create: <FaUpload />,
            assignments: <FaListAlt />,
            reports: <span role="img" aria-label="chart">📊</span>,
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex items-center space-x-2 px-6 py-3 text-lg font-semibold rounded-t-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-400/30"
                    : "text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100"
                }`}
            >
              <span className="text-xl">{icons[tab]}</span>
              <span>{labels[tab]}</span>
            </button>
          );
        })}
      </div>

      {/* Create Tab */}
      {activeTab === "create" && (
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-6 text-indigo-700 flex items-center space-x-3">
            <FaUpload className="text-indigo-500" />
            <span>Create New Assignment</span>
          </h1>
          {metaLoading ? (
            <div className="flex justify-center items-center space-x-3 py-8">
              <FaSpinner className="animate-spin text-indigo-600 text-3xl" />
              <p className="text-indigo-600 text-lg font-semibold">Loading courses & batches...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="title"
                  placeholder="Assignment Title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium transition"
                  required
                />
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium transition"
                  required
                />
              </div>

              <textarea
                name="description"
                placeholder="Description (Optional)"
                value={form.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-5 py-3 border border-indigo-300 rounded-lg resize-none focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium transition"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Batch dropdown */}
                <select
                  name="batchId"
                  value={form.batchId}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium transition"
                  required
                >
                  <option value="" disabled>
                    Select Batch
                  </option>
                  {allBatches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>

                {/* Course dropdown */}
                <select
                  name="courseId"
                  value={form.courseId}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium transition"
                  required
                >
                  <option value="" disabled>
                    Select Course
                  </option>
                  {allCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>

                {/* Total Marks */}
                <input
                  type="number"
                  name="totalMarks"
                  placeholder="Total Marks (optional)"
                  value={form.totalMarks}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium transition"
                  min={0}
                />
              </div>

              {/* File upload */}
              <div className="border-2 border-dashed border-indigo-400 rounded-lg p-6 text-center cursor-pointer hover:bg-indigo-50 transition relative">
                <label
                  htmlFor="file"
                  className="block text-indigo-700 font-semibold mb-2 cursor-pointer"
                >
                  Upload File (optional)
                </label>
                <input
                  id="file"
                  type="file"
                  name="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.txt"
                  onChange={handleInputChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
                <p className="text-indigo-500 text-sm select-none">
                  {form.file ? form.file.name : "Click or drag file to upload"}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-xl font-extrabold tracking-wide shadow-lg hover:scale-[1.03] transform transition"
              >
                <div className="flex items-center justify-center space-x-3">
                  <FaUpload className="text-2xl" />
                  <span>Create Assignment</span>
                </div>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Assignments & Reports Tabs remain same */}
      {/* ...keep your assignments and reports tab code unchanged... */}
    </div>
  );
}
