// src/hooks/useTeacherAssignments.ts
import { useEffect, useState } from "react";
import axios from "axios";

interface Batch {
  _id: string;
  name: string;
  course: string;
}

interface Course {
  _id: string;
  name: string;
}

export const useTeacherAssignments = () => {
  const [assignedBatches, setAssignedBatches] = useState<Batch[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const { data } = await axios.get("/api/teacher/dashboard");

      // Extract batches
      setAssignedBatches(data.assignedBatches || []);

      // Extract unique courseIds from todaySchedule
      const uniqueCoursesMap: Record<string, Course> = {};

      (data.todaySchedule || []).forEach((scheduleItem: any) => {
        const course = scheduleItem.courseId;
        if (course && course._id && !uniqueCoursesMap[course._id]) {
          uniqueCoursesMap[course._id] = {
            _id: course._id,
            name: course.name || "Untitled Course",
          };
        }
      });

      setAssignedCourses(Object.values(uniqueCoursesMap));
    } catch (err) {
      console.error("Failed to fetch teacher assignments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return {
    assignedBatches,
    assignedCourses,
    loading,
  };
};
