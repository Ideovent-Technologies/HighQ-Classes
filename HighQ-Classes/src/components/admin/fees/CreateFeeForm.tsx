import React, { useState, useEffect } from "react";
import axios from "axios";

interface CreateFeeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateFeeForm: React.FC<CreateFeeFormProps> = ({ onClose, onSuccess }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch students/courses/batches when form opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes, batchesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/student/students"),
          axios.get("http://localhost:8080/api/courses"),
          axios.get("http://localhost:8080/api/batches"),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setBatches(batchesRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/fees", {
        student: studentId,
        course: courseId,
        batch: batchId,
        month,
        year,
        amount,
        dueDate,
        status,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create Fee</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 Student dropdown */}
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* 🔹 Course dropdown */}
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* 🔹 Batch dropdown */}
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* 🔹 Month + Year */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-1/2 border rounded-lg p-2"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-1/2 border rounded-lg p-2"
              required
            />
          </div>

          {/* 🔹 Amount */}
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded-lg p-2"
            required
          />

          {/* 🔹 Due Date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />

          {/* 🔹 Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* 🔹 Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeeForm;
