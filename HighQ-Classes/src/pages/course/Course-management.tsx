import React, { useEffect, useState } from "react";
import { Course } from "@/types/course.types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CourseService from "@/API/services/courseService";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import { useNavigate } from "react-router-dom";

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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

  const handleCreate = () => {
    navigate("/dashboard/courses/add");
  };

  const handleEdit = (courseId: string) => {
    navigate(`/dashboard/courses/${courseId}/edit`);
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

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="space-y-2">
            <CourseCard course={course} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(course._id)}
            >
              Edit
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default CourseManagementPage;
