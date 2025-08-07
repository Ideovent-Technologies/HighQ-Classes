import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course } from "@/types/course.types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CourseService from "@/API/services/courseService";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  if (!courseId) return;

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await CourseService.getCourseById(courseId);
      setCourse(data.course);
    } catch (error) {
      console.error("Failed to fetch course:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCourse();
}, [courseId]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{course.name}</CardTitle>
          <p className="text-muted-foreground text-sm mt-1">{course.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Duration:</span>
            <Badge>{course.duration}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Fee:</span>
            <Badge>₹{course.fee}</Badge>
          </div>

          {course.topics?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-4">Topics Covered</h3>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {course.topics.map((topic, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{topic.title}</span>
                    {topic.description && (
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
