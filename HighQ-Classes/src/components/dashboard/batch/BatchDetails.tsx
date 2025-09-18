import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Batch } from "@/types/batch.types";
import { BatchService } from "@/API/services/admin/batches.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Info, Trash2, Edit3, Check, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { debounce } from "lodash";

// ---------------------- MODALS ----------------------
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white p-6 rounded-xl shadow-2xl relative w-full max-w-md mx-4"
    >
      {children}
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition">
        &times;
      </button>
    </motion.div>
  </div>
);

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => (
  <Modal onClose={onCancel}>
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{message}</p>
    <div className="flex justify-end gap-2">
      <button onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-300 transition">
        Cancel
      </button>
      <button onClick={onConfirm} className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition">
        Confirm
      </button>
    </div>
  </Modal>
);

const AlertDialog = ({ title, message, onClose }) => (
  <Modal onClose={onClose}>
    <h2 className="text-xl font-bold mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{message}</p>
    <div className="flex justify-end">
      <button onClick={onClose} className="bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-600 transition">
        OK
      </button>
    </div>
  </Modal>
);

// ---------------------- ADD STUDENT MODAL ----------------------
const AddStudentModal = ({ onClose, onAddStudent, batch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const batchService = new BatchService();

  // Debounced search
  const debouncedSearch = debounce(async (query) => {
    setIsSearching(true);
    try {
      const res = await batchService.getAllStudents();
      if (res.success) {
        // Filter by search query
        let filtered = query
          ? res.data.filter(
              (s) =>
                s.name.toLowerCase().includes(query.toLowerCase()) ||
                (s.email && s.email.toLowerCase().includes(query.toLowerCase()))
            )
          : res.data;

        // Exclude students already in the batch
        const batchStudentIds = batch.students.map((s) => s._id);
        filtered = filtered.filter((s) => !batchStudentIds.includes(s._id));

        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleAddStudent = async () => {
    if (!selectedStudent) return;
    setIsLoading(true);
    await onAddStudent(selectedStudent._id);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold mb-2">Add Student to Batch</h2>
      <p className="text-gray-600 mb-4">Search for a student to add.</p>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSelectedStudent(null);
        }}
        className="w-full px-4 py-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Search by name or email"
      />

      <div className="min-h-[150px] max-h-[250px] overflow-y-auto mb-4 border rounded-lg p-2 bg-gray-50">
        {isSearching ? (
          <p className="text-center text-gray-500">Searching...</p>
        ) : searchResults.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {searchResults.map((student) => (
              <li
                key={student._id}
                onClick={() => setSelectedStudent(student)}
                className={`p-2 cursor-pointer transition rounded-md ${
                  selectedStudent?._id === student._id ? "bg-indigo-100 font-medium" : "hover:bg-gray-100"
                }`}
              >
                {student.name} ({student.email})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No students found.</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg text-gray-800 hover:bg-gray-300 transition">
          Cancel
        </button>
        <button
          onClick={handleAddStudent}
          className={`bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-600 transition ${
            !selectedStudent || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!selectedStudent || isLoading}
        >
          {isLoading ? "Adding..." : `Add ${selectedStudent ? selectedStudent.name : "Student"}`}
        </button>
      </div>
    </Modal>
  );
};

// ---------------------- BATCH DETAILS PAGE ----------------------
const BatchDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const batchService = new BatchService();

  // Fetch batch
  const fetchBatch = async () => {
    if (!batchId) {
      setError("Batch ID is missing from the URL.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await batchService.getBatchById(batchId);
      if (response.success && response.data) {
        setBatch(response.data);
        setUpdateName(response.data.name || "");
        setError(null);
      } else {
        setError(response.message || "Failed to fetch batch.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, [batchId]);

  // Delete batch
  const handleDelete = async () => {
    setIsConfirmOpen(false);
    if (!batch?._id) return;
    try {
      const response = await batchService.deleteBatch(batch._id);
      setAlertMessage(response.message || "Batch deleted successfully");
      setIsAlertOpen(true);
      navigate("/admin/batches");
    } catch (err) {
      setAlertMessage(err.message || "Error deleting batch");
      setIsAlertOpen(true);
      console.error(err);
    }
  };

  // Update batch
  const handleUpdate = async () => {
    if (!batch?._id) return;
    try {
      const response = await batchService.updateBatch(batch._id, { name: updateName });
      if (response.success && response.batch) {
        setBatch(response.batch);
        setEditing(false);
        setAlertMessage("Batch updated successfully");
        setIsAlertOpen(true);
      } else {
        setAlertMessage(response.message || "Failed to update batch");
        setIsAlertOpen(true);
      }
    } catch (err) {
      console.error(err);
      setAlertMessage(err.message || "Failed to update batch");
      setIsAlertOpen(true);
    }
  };

  // Add student to batch
  const handleAddStudent = async (studentId: string) => {
    if (!batch?._id) return;
    try {
      const response = await batchService.addStudentToBatch(batch._id, studentId);
      if (response.success && response.data) {
        setBatch(response.data.batch);
        setAlertMessage(response.message || "Student added successfully!");
        setIsAlertOpen(true);
      } else {
        setAlertMessage(response.message || "Failed to add student.");
        setIsAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage(err.message || "An unexpected error occurred while adding the student.");
      setIsAlertOpen(true);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading batch details...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-lg text-red-500">{error}</div>;
  if (!batch) return <div className="flex justify-center items-center h-screen text-lg text-gray-500">Batch not found.</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-10 shadow-lg">
          <div className="container mx-auto text-center flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              {editing ? (
                <div className="flex items-center justify-center gap-2">
                  <input
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                    className="px-2 py-1 rounded text-black"
                  />
                  <button onClick={handleUpdate} className="bg-green-500 px-2 py-1 rounded hover:bg-green-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="bg-gray-300 px-2 py-1 rounded hover:bg-gray-400">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-extrabold mb-2">{batch.name}</h1>
                  <p className="text-lg">{batch.courseId?.name || "Unknown Course"} • {batch.teacherId?.name || "No Teacher Assigned"}</p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}
              {!editing && (
                <button
                  onClick={() => setIsAddStudentOpen(true)}
                  className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Add Student
                </button>
              )}
              <button
                onClick={() => setIsConfirmOpen(true)}
                className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Batch Info */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="rounded-2xl shadow-md border">
              <CardHeader className="flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" />
                <CardTitle>Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700">
                {batch.description && (
                  <p><strong>Description:</strong> {batch.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Schedule */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="rounded-2xl shadow-md border">
              <CardHeader className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700">
                <p><strong>Start:</strong> {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}</p>
                <p><strong>End:</strong> {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "N/A"}</p>
                {batch.schedule && (
                  <>
                    <p><strong>Days:</strong> {batch.schedule.days?.join(", ") || "N/A"}</p>
                    <p><strong>Time:</strong> {batch.schedule.startTime && batch.schedule.endTime ? `${batch.schedule.startTime} - ${batch.schedule.endTime}` : "N/A"}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Students */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="rounded-2xl shadow-md border">
              <CardHeader className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <CardTitle>Students ({batch.students?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {batch.students?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {batch.students.map((student) => (
                      <Badge
                        key={student._id}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 shadow-sm hover:bg-gray-200"
                      >
                        {student.name}{student.email ? ` (${student.email})` : ""}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No students enrolled.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmDialog
            title="Delete Batch"
            message={`Are you sure you want to delete batch "${batch.name}"? This action cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setIsConfirmOpen(false)}
          />
        )}
        {isAlertOpen && (
          <AlertDialog
            title="Notification"
            message={alertMessage}
            onClose={() => setIsAlertOpen(false)}
          />
        )}
        {isAddStudentOpen && (
          <AddStudentModal
            batch={batch}
            onClose={() => setIsAddStudentOpen(false)}
            onAddStudent={handleAddStudent}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default BatchDetails;
