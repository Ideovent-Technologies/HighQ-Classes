import React, { useState, useEffect } from "react";
import axios from "axios";

interface CreateFeeFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateFeeForm: React.FC<CreateFeeFormProps> = ({ onClose, onSuccess }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  // We no longer need the 'batches' state to hold all batches
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch students and courses on mount
  // We will now fetch batches dynamically based on course selection
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/student/students"),
          axios.get("http://localhost:8080/api/courses"),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };
    fetchData();
  }, []);

  // 🔹 New logic: Fetch batches by course whenever a course is selected
  useEffect(() => {
    const fetchBatches = async () => {
      if (courseId) {
        try {
          // Call the correct backend endpoint
          const batchesRes = await axios.get(`http://localhost:8080/api/batches/course/${courseId}`);
          setFilteredBatches(batchesRes.data);
          setBatchId(""); // Reset batch selection when course changes
        } catch (err) {
          console.error("Error fetching batches by course:", err);
          setFilteredBatches([]); // Clear batches on error or if none are found
        }
      } else {
        // Clear batches if no course is selected
        setFilteredBatches([]);
      }
      setFilteredStudents([]); // Always clear students when course or batch changes
      setSelectedStudents([]);
    };
    fetchBatches();
  }, [courseId]); // This effect runs only when courseId changes

  // 🔹 Filter students when batch changes
  useEffect(() => {
    if (batchId) {
      setFilteredStudents(students.filter((s) => s.batch === batchId));
      setSelectedStudents([]);
    } else {
      setFilteredStudents([]);
      setSelectedStudents([]);
    }
  }, [batchId, students]);

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s._id));
    }
  };

  const handleStudentToggle = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        month,
        year,
        amount,
        dueDate,
        status,
        batch: batchId,
        course: courseId,
      };

      if (selectedStudents.length > 0) {
        // ✅ Create fee for selected students
        await axios.post("http://localhost:8080/api/fees/multi", {
          ...payload,
          students: selectedStudents,
        });
      } else if (batchId && courseId) {
        // ✅ Create fee for entire batch
        await axios.post("http://localhost:8080/api/fees/batch-course", payload);
      } else {
        setError("Please select a course and batch.");
        return;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create Fee</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Dropdown */}
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Batch Dropdown */}
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
            disabled={!courseId}
          >
            <option value="">Select Batch</option>
            {filteredBatches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Students List with Select All */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Select Students</span>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-sm text-blue-600"
                >
                  {selectedStudents.length === filteredStudents.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="border rounded-lg p-2 max-h-40 overflow-y-auto">
                {filteredStudents.map((s) => (
                  <label key={s._id} className="block">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(s._id)}
                      onChange={() => handleStudentToggle(s._id)}
                      className="mr-2"
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Month + Year */}
          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-1/2 border rounded-lg p-2"
              required
            >
              <option value="">Select Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-1/2 border rounded-lg p-2"
              required
            />
          </div>

          {/* Amount */}
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              setAmount(value === '' ? 0 : Number(value));
            }}
            className="w-full border rounded-lg p-2"
            required
          />

          {/* Due Date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />

          {/* Status */}
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

          {/* Buttons */}
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
