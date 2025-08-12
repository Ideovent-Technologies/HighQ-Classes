import React, { useEffect, useState } from "react";
// Assuming DashboardLayout, Card, CardContent, CardHeader, CardTitle, CardDescription, Button are from Shadcn UI
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BookOpen, Edit, Trash } from "lucide-react";
import CourseService from "@/API/services/courseService";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import { useNavigate } from "react-router-dom";

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

    /**
     * Fetches the list of courses from the API.
     * Handles loading state and displays toast notifications for errors.
     */
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await CourseService.getAllCourses();
            if (data.courses) {
                setCourses(data.courses);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load courses data.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Failed to fetch courses:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred while fetching courses.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Effect hook to fetch courses when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

  const handleCreate = () => {
    navigate("/dashboard/courses/add");
  };

  const handleEdit = (courseId: string) => {
    navigate(`/dashboard/courses/${courseId}/edit`);
  };


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
