import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course, CourseTopic } from "@/types/course.types";
import CourseService from "@/API/services/courseService";
import { useNavigate, useParams } from "react-router-dom";

const CourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<Course>({
    _id: "",
    name: "",
    description: "",
    duration: "",
    fee: 0,
    topics: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== "add") {
      setLoading(true);
      CourseService.getCourseById(id)
        .then((data) => {
          console.log("Raw fetched course data:", data);

          if (data.course) {
            setFormData({
              _id: data.course._id || "",
              name: data.course.name || "",
              description: data.course.description || "",
              duration: data.course.duration || "",
              fee: data.course.fee || 0,
              topics: data.course.topics || [], // default to []
            });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch course:", err);
          alert("Failed to load course details.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fee" ? Number(value) : value,
    }));
  };

  const handleTopicChange = (
    index: number,
    field: keyof CourseTopic,
    value: string
  ) => {
    const newTopics = [...formData.topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    setFormData((prev) => ({ ...prev, topics: newTopics }));
  };

  const addTopic = () => {
    setFormData((prev) => ({
      ...prev,
      topics: [
        ...prev.topics,
        { title: "", description: "", order: prev.topics.length + 1 },
      ],
    }));
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, topics: newTopics }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (id && id !== "add") {
        await CourseService.UpdateCourse(id, formData);
        alert("Course updated successfully!");
      } else {
        await CourseService.CreateCourse(formData);
        alert("Course created successfully!");
      }
      navigate("/dashboard/course-management");
    } catch (err) {
      console.error("API Error:", err);
      alert("Failed to save course.");
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading course details...</p>;
  }

  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>{id && id !== "add" ? "Edit Course" : "Create Course"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Course Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <Input
            name="duration"
            placeholder="Duration (e.g., 6 weeks)"
            value={formData.duration}
            onChange={handleInputChange}
            required
          />
          <Input
            name="fee"
            placeholder="Course Fee"
            type="number"
            value={formData.fee}
            onChange={handleInputChange}
            required
          />

          <div className="space-y-2">
            <p className="font-semibold">Topics</p>
            {formData.topics.map((topic, index) => (
              <div key={index} className="grid gap-2 border p-2 rounded-md">
                <Input
                  placeholder="Topic Title"
                  value={topic.title}
                  onChange={(e) => handleTopicChange(index, "title", e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Topic Description"
                  value={topic.description}
                  onChange={(e) =>
                    handleTopicChange(index, "description", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeTopic(index)}
                >
                  Remove Topic
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addTopic}>
              Add Topic
            </Button>
          </div>

          <Button type="submit" className="w-full">
            {id && id !== "add" ? "Update Course" : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
