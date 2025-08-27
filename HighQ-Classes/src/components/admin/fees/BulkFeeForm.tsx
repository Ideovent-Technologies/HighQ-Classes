import React, { useState, useEffect } from "react";
import axios from "axios";

interface BulkFeeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface Batch {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
}

const BulkFeeForm: React.FC<BulkFeeFormProps> = ({ onClose, onSuccess }) => {
  const [batchId, setBatchId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // 🔹 Fetch batches & courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchRes, courseRes] = await Promise.all([
          axios.get("http://localhost:8080/api/batches"),
          axios.get("http://localhost:8080/api/courses"),
        ]);
        setBatches(batchRes.data);
        setCourses(courseRes.data);
      } catch (err: any) {
        setError("Failed to load batches/courses");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/api/fees/bulk", {
        batch: batchId,
        course: courseId,
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
        <h2 className="text-xl font-bold mb-4">Create Bulk Fees</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 Batch dropdown */}
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Batch</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name}
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
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>

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

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded-lg p-2"
            required
          />

          <input
            type="date"
            placeholder="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />

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

export default BulkFeeForm;
