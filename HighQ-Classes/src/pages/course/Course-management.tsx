import React, { useState } from "react";
import { Course } from "@/types/course.types";
import CourseCard from "@/components/dashboard/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const initialMockCourses: Course[] = [
  {
    _id: "C101",
    name: "Physics for Engineers",
    description: "An introductory course on fundamental physics principles for engineering students, covering mechanics, thermodynamics, and electromagnetism.",
    duration: "16 weeks",
    fee: 15000,
    topics: [
      { title: "Mechanics", order: 1 },
      { title: "Thermodynamics", order: 2 },
    ]
  },
  {
    _id: "C102",
    name: "Organic Chemistry",
    description: "A comprehensive study of the structure, properties, and reactions of organic compounds, including synthesis and spectroscopy.",
    duration: "14 weeks",
    fee: 12000,
    topics: [
      { title: "Hydrocarbons", order: 1 },
      { title: "Functional Groups", order: 2 },
    ]
  },
  {
    _id: "C103",
    name: "Calculus I",
    description: "An essential course covering the fundamentals of differential and integral calculus, including limits, derivatives, and applications.",
    duration: "15 weeks",
    fee: 10000,
    topics: [
      { title: "Limits and Continuity", order: 1 },
      { title: "Derivatives", order: 2 },
    ]
  },
];

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(initialMockCourses);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (confirmed) {
      setCourses(prev => prev.filter(course => course._id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Link to="/dashboard/courses/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </Link>
      </div>

      {/* === Grid View === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="relative group">
            <CourseCard course={course} />
            <div className="absolute top-3 right-3 hidden group-hover:flex gap-2">
              <Link to={`/dashboard/courses/edit/${course._id}`}>
                <Button size="icon" variant="outline">
                  <Pencil className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDelete(course._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* === Table View === */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <table className="w-full text-sm">
          <caption className="text-left p-4 font-semibold">All Courses</caption>
          <thead className="bg-muted text-xs uppercase">
            <tr>
              <th className="text-left p-3">Course Name</th>
              <th className="text-left p-3">Description</th>
              <th className="text-left p-3">Duration</th>
              <th className="text-left p-3">Fee</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="border-t">
                <td className="p-3 font-medium">{course.name}</td>
                <td className="p-3 truncate max-w-[250px]">{course.description}</td>
                <td className="p-3">{course.duration}</td>
                <td className="p-3">₹{course.fee}</td>
                <td className="p-3 text-right space-x-2">
                  <Link to={`/dashboard/courses/${course._id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                  <Link to={`/dashboard/courses/edit/${course._id}`}>
                    <Button size="sm" variant="secondary">Edit</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseManagementPage;
