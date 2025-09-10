import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EditBatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    teacher: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);

  // Placeholder for fetching existing batch data
  useEffect(() => {
    // In a real app, you would fetch data using the batch ID
    // const fetchBatchData = async () => {
    //   const data = await batchService.getBatchById(id);
    //   setFormData(data);
    //   setLoading(false);
    // };
    // fetchBatchData();

    // Mock data for demonstration
    setTimeout(() => {
      setFormData({
        name: "Mock Batch 1",
        course: "Math 101",
        teacher: "Jane Doe",
        startDate: "2023-01-01",
        endDate: "2023-06-30",
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for API call to update a batch
    console.log(`Updating batch ${id}:`, formData);
    // After successful update, navigate back to the management page
    navigate("/dashboard/batches");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-24">
        <p className="text-xl text-gray-500">Loading batch details...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 md:p-10 max-w-4xl mx-auto space-y-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200"
    >
      <h1 className="text-4xl font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
        ✏️ Edit Batch
      </h1>
      <p className="text-gray-600 text-center mt-2 text-lg">
        Update the details for Batch ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded-md">{id}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-gray-700 font-semibold">Batch Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="course" className="text-gray-700 font-semibold">Course</Label>
          <Input
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="teacher" className="text-gray-700 font-semibold">Teacher</Label>
          <Input
            id="teacher"
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="mt-1"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate" className="text-gray-700 font-semibold">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-gray-700 font-semibold">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
        >
          Update Batch
        </Button>
      </form>
    </motion.div>
  );
};

export default EditBatchPage;
