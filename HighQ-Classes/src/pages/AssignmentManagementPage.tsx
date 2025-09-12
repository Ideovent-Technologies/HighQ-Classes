// src/pages/AssignmentManagementPage.tsx
import React, { useEffect, useState } from "react";
import AssignmentService, { AssignmentFormData } from "@/API/services/assignmentService";
import { CourseService } from "@/API/services/admin/courses.service";
import { toast } from "@/hooks/use-toast";

interface Course {
  _id: string;
  name: string;
}

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  course: { name: string };
  batch?: { name: string };
  dueDate: string;
  totalMarks: number;
  fileUrl?: string;
  fileName?: string;
  instructions?: string;
  assignmentType?: string;
  isPublished?: boolean;
  allowLateSubmission?: boolean;
}

export default function AssignmentManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [form, setForm] = useState<AssignmentFormData>({
    title: "",
    description: "",
    courseId: "",
    batchId: "",
    dueDate: "",
    totalMarks: 100,
    attachments: [],
    instructions: "",
    assignmentType: "homework",
    isPublished: true,
    allowLateSubmission: false,
  });

  // Fetch courses
  const fetchCourses = async () => {
    const res = await new CourseService().getAllCourses();
    if (res.success && res.data) {
      setCourses(res.data);
    } else {
      toast({ title: res.message, variant: "destructive" });
    }
  };

  // Fetch assignments
  const fetchAssignments = async () => {
    const res = await AssignmentService.getAssignments();
    if (res.success && res.data) {
      setAssignments(res.data);
    } else {
      toast({ title: res.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  // Handle form input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (name === "attachments" && files) {
      setForm((prev) => ({ ...prev, attachments: Array.from(files) }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "totalMarks") {
      setForm((prev) => ({ ...prev, totalMarks: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit assignment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.courseId || !form.dueDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const res = await AssignmentService.createAssignment(form);
    if (res.success) {
      toast({ title: res.message });
      setForm({
        title: "",
        description: "",
        courseId: "",
        batchId: "",
        dueDate: "",
        totalMarks: 100,
        attachments: [],
        instructions: "",
        assignmentType: "homework",
        isPublished: true,
        allowLateSubmission: false,
      });
      fetchAssignments();
    } else {
      toast({ title: res.message, variant: "destructive" });
    }
  };

  // Delete assignment
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    const res = await AssignmentService.deleteAssignment(id);
    if (res.success) {
      toast({ title: res.message });
      fetchAssignments();
    } else {
      toast({ title: res.message, variant: "destructive" });
    }
  };

  // Download attachment
  const downloadAttachment = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Assignments Management</h1>

      {/* Create Assignment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Create Assignment</h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Assignment Title"
          required
          className="w-full p-3 border rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="w-full p-3 border rounded"
        />

        <select
          name="courseId"
          value={form.courseId}
          onChange={handleInputChange}
          required
          className="w-full p-3 border rounded"
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleInputChange}
          required
          className="w-full p-3 border rounded"
        />

        <input
          type="number"
          name="totalMarks"
          value={form.totalMarks}
          onChange={handleInputChange}
          placeholder="Total Marks"
          min={0}
          className="w-full p-3 border rounded"
        />

        <textarea
          name="instructions"
          value={form.instructions}
          onChange={handleInputChange}
          placeholder="Instructions"
          className="w-full p-3 border rounded"
        />

        <select
          name="assignmentType"
          value={form.assignmentType}
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        >
          <option value="homework">Homework</option>
          <option value="project">Project</option>
          <option value="quiz">Quiz</option>
        </select>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleInputChange}
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="allowLateSubmission"
              checked={form.allowLateSubmission}
              onChange={handleInputChange}
            />
            Allow Late Submission
          </label>
        </div>

        <input
          type="file"
          name="attachments"
          multiple
          onChange={handleInputChange}
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700 transition"
        >
          Create Assignment
        </button>
      </form>

      {/* Assignments List */}
      <div className="grid md:grid-cols-2 gap-4">
        {assignments.map((a) => (
          <div key={a._id} className="border p-4 rounded shadow relative">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <p className="text-sm text-gray-600">{a.description}</p>
            <p className="text-sm">Course: <strong>{a.course.name}</strong></p>
            {a.batch && <p className="text-sm">Batch: <strong>{a.batch.name}</strong></p>}
            <p className="text-sm">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
            <p className="text-sm">Total Marks: {a.totalMarks}</p>
            {a.instructions && <p className="text-sm">Instructions: {a.instructions}</p>}
            {a.fileUrl && (
              <button
                onClick={() => downloadAttachment(a.fileUrl!, a.fileName!)}
                className="text-blue-600 underline mt-2 block"
              >
                Download Attachment
              </button>
            )}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleDelete(a._id)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              {/* Add Edit/Update button here if needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
