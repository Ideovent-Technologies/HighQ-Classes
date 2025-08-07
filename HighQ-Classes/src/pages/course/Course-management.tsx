import React, { useEffect, useState } from "react";
import { Course } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CourseService from "@/API/services/courseService";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import CourseForm from "@/components/dashboard/courses/CourseForm";

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await CourseService.getAllCourses();
      setCourses(data.courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses(); // Refresh list after update/create
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {showForm && (
        <CourseForm course={editingCourse!} key={editingCourse?._id || "new"} />
      )}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="space-y-2">
            <CourseCard course={course} />
            <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
              Edit
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseManagementPage;
