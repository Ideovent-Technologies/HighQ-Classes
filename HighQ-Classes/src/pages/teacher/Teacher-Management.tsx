import React, { useState } from "react";
import TeacherForm from "@/components/dashboard/teacher/TeacherForm";
import TeacherList from "@/components/dashboard/teacher/TeacherList";
import TeacherCard from "@/components/dashboard/teacher/TeacherCard";
import { TeacherUser } from "@/types/teacher.types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const initialMockTeachers: TeacherUser[] = [
  {
    _id: "T101",
    name: "Dr. Anjali Sharma",
    email: "anjali.s@example.com",
    department: "Physics",
    qualification: "Ph.D. in Physics",
    experience: 10,
    specialization: "Quantum Mechanics",
    role: "teacher",
    status: "active",
    mobile: "9876543210",
    profilePicture: "",
  },
  {
    _id: "T102",
    name: "Mr. Vikram Singh",
    email: "vikram.s@example.com",
    department: "Chemistry",
    qualification: "M.Sc. Chemistry",
    experience: 8,
    specialization: "Organic Chemistry",
    role: "teacher",
    status: "active",
    mobile: "9876512345",
    profilePicture: "",
  },
  {
    _id: "T103",
    name: "Ms. Priya Reddy",
    email: "priya.r@example.com",
    department: "Mathematics",
    qualification: "M.Sc. Mathematics",
    experience: 5,
    specialization: "Calculus",
    role: "teacher",
    status: "on-leave",
    mobile: "9988776655",
    profilePicture: "",
  },
];

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherUser[]>(initialMockTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherUser | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setSelectedTeacher(null);
    setShowForm(true);
  };

  const handleEdit = (teacher: TeacherUser) => {
    setSelectedTeacher(teacher);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this teacher?");
    if (confirmed) {
      setTeachers(prev => prev.filter(t => t._id !== id));
    }
  };

  const handleFormSubmit = (newTeacher: Partial<TeacherUser>) => {
    if (selectedTeacher) {
      setTeachers(prev =>
        prev.map(t => (t._id === selectedTeacher._id ? { ...t, ...newTeacher } : t))
      );
    } else {
      const newId = `T${Math.floor(Math.random() * 1000) + 104}`;
      setTeachers(prev => [...prev, { ...newTeacher, _id: newId } as TeacherUser]);
    }
    setShowForm(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Management</h1>
        {!showForm && (
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        )}
      </div>

      {showForm ? (
        <TeacherForm
          teacherToEdit={selectedTeacher || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teachers.map(teacher => (
              <div key={teacher._id} className="relative group">
                <TeacherCard teacher={teacher} />
                <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(teacher)}>
                    ✏️
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(teacher._id)}>
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherManagementPage;
