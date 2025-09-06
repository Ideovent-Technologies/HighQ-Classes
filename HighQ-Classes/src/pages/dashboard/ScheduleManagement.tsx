import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import AdminService from "@/API/services/AdminService";

interface Schedule {
  _id: string;
  // The API may not always return the full object, so we adjust the interface to reflect this
  batchId: { _id: string; name: string } | null;
  teacherId: { _id: string; name: string } | null;
  courseId: { _id: string; name: string } | null;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ScheduleManagement() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({ teacherId: "", batchId: "", day: "" });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    teacherId: "",
    batchId: "",
    courseId: "",
    day: "",
    startTime: "",
    endTime: "",
    room: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all required data in parallel
        const [teachersRes, batchesRes, coursesRes, schedulesRes] = await Promise.all([
          AdminService.getAllTeachers(),
          AdminService.getAllBatches(),
          AdminService.getAllCourses(),
          AdminService.getAllSchedules(filters),
        ]);

        // Safely extract data, defaulting to an empty array.
        const fetchedTeachers: Teacher[] = (teachersRes.success && teachersRes.data) ? teachersRes.data : [];
        const fetchedBatches: Batch[] = (batchesRes.success && batchesRes.data) ? batchesRes.data : [];
        const fetchedCourses: Course[] = (coursesRes.success && coursesRes.data) ? coursesRes.data : [];

        setTeachers(fetchedTeachers);
        setBatches(fetchedBatches);
        setCourses(fetchedCourses);

        // Populate schedules with fetched data
        if (schedulesRes.success && Array.isArray(schedulesRes.data)) {
          const schedulesData = schedulesRes.data as Schedule[];
          const populatedSchedules = schedulesData.map(schedule => {
            // Find the full objects using the IDs. The API might return an ID string or a partial object, so we handle both.
            const teacherIdStr = typeof schedule.teacherId === "string" ? schedule.teacherId : schedule.teacherId?._id;
            const batchIdStr = typeof schedule.batchId === "string" ? schedule.batchId : schedule.batchId?._id;
            const courseIdStr = typeof schedule.courseId === "string" ? schedule.courseId : schedule.courseId?._id;

            const foundTeacher = fetchedTeachers.find(t => t._id === teacherIdStr);
            const foundBatch = fetchedBatches.find(b => b._id === batchIdStr);
            const foundCourse = fetchedCourses.find(c => c._id === courseIdStr);

            return {
              ...schedule,
              teacherId: foundTeacher ? { _id: foundTeacher._id, name: foundTeacher.name } : null,
              batchId: foundBatch ? { _id: foundBatch._id, name: foundBatch.name } : null,
              courseId: foundCourse ? { _id: foundCourse._id, name: foundCourse.name } : null,
            };
          });

          setSchedules(populatedSchedules);
        } else {
          setSchedules([]);
        }
      } catch (err) {
        console.error("Failed to fetch and populate data:", err);
        setSchedules([]);
        setTeachers([]);
        setBatches([]);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters, refreshTrigger]);


  const openModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        teacherId: schedule.teacherId?._id || "",
        batchId: schedule.batchId?._id || "",
        courseId: schedule.courseId?._id || "",
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room,
      });
    } else {
      setEditingSchedule(null);
      setFormData({ teacherId: "", batchId: "", courseId: "", day: "", startTime: "", endTime: "", room: "" });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingSchedule) {
        await AdminService.updateSchedule(editingSchedule._id, formData);
      } else {
        await AdminService.createSchedule(formData);
      }
      setModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setScheduleToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (scheduleToDelete) {
      try {
        await AdminService.deleteSchedule(scheduleToDelete);
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setDeleteModalOpen(false);
        setScheduleToDelete(null);
      }
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Schedule Management</CardTitle>
          <Button onClick={() => openModal()}>
            <Plus className="mr-2" /> Add Schedule
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              className="border p-2 rounded-md"
              value={filters.teacherId}
              onChange={e => setFilters({ ...filters, teacherId: e.target.value })}
            >
              <option value="">All Teachers</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded-md"
              value={filters.batchId}
              onChange={e => setFilters({ ...filters, batchId: e.target.value })}
            >
              <option value="">All Batches</option>
              {batches.map(b => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded-md"
              value={filters.day}
              onChange={e => setFilters({ ...filters, day: e.target.value })}
            >
              <option value="">All Days</option>
              {days.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <p>Loading schedules...</p>
            ) : (
              <table className="min-w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Batch</th>
                    <th className="border px-4 py-2">Teacher</th>
                    <th className="border px-4 py-2">Course</th>
                    <th className="border px-4 py-2">Day</th>
                    <th className="border px-4 py-2">Start</th>
                    <th className="border px-4 py-2">End</th>
                    <th className="border px-4 py-2">Room</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s._id}>
                      <td className="border px-4 py-2">{s.batchId?.name || "N/A"}</td>
                      <td className="border px-4 py-2">{s.teacherId?.name || "N/A"}</td>
                      <td className="border px-4 py-2">{s.courseId?.name || "N/A"}</td>
                      <td className="border px-4 py-2">{s.day}</td>
                      <td className="border px-4 py-2">{s.startTime}</td>
                      <td className="border px-4 py-2">{s.endTime}</td>
                      <td className="border px-4 py-2">{s.room}</td>
                      <td className="border px-4 py-2 flex gap-2 justify-center">
                        <Button size="sm" onClick={() => openModal(s)}>
                          <Edit3 size={16} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(s._id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSchedule ? "Edit Schedule" : "Add Schedule"}
      >
        <div className="space-y-3">
          <div>
            <label className="block mb-1">Teacher</label>
            <select
              className="border w-full p-2 rounded-md"
              value={formData.teacherId}
              onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Batch</label>
            <select
              className="border w-full p-2 rounded-md"
              value={formData.batchId}
              onChange={e => setFormData({ ...formData, batchId: e.target.value })}
            >
              <option value="">Select Batch</option>
              {batches.map(b => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Course</label>
            <select
              className="border w-full p-2 rounded-md"
              value={formData.courseId}
              onChange={e => setFormData({ ...formData, courseId: e.target.value })}
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Day</label>
            <select
              className="border w-full p-2 rounded-md"
              value={formData.day}
              onChange={e => setFormData({ ...formData, day: e.target.value })}
            >
              <option value="">Select Day</option>
              {days.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1">Start Time</label>
              <input
                type="time"
                className="border w-full p-2 rounded-md"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">End Time</label>
              <input
                type="time"
                className="border w-full p-2 rounded-md"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Room</label>
            <input
              type="text"
              className="border w-full p-2 rounded-md"
              placeholder="Room"
              value={formData.room}
              onChange={e => setFormData({ ...formData, room: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingSchedule ? "Update" : "Save"}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this schedule?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
