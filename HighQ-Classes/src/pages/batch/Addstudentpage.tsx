import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentIds, setStudentIds] = useState("");
  const [batchName, setBatchName] = useState("");
  const [loading, setLoading] = useState(true);

  // Placeholder for fetching batch details
  useEffect(() => {
    // In a real app, you would fetch batch details to display the batch name
    // const fetchBatchName = async () => {
    //   const data = await batchService.getBatchById(id);
    //   setBatchName(data.name);
    //   setLoading(false);
    // };
    // fetchBatchName();

    // Mock data for demonstration
    setTimeout(() => {
      setBatchName("Mock Batch 1");
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idsArray = studentIds.split(",").map(id => id.trim());
    // Placeholder for API call to add students
    console.log(`Adding students ${idsArray} to batch ${id}`);
    // After successful addition, navigate back to the batch management page
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
        👨‍🎓 Add Students to Batch
      </h1>
      <p className="text-gray-600 text-center mt-2 text-lg">
        Add students to <span className="font-semibold">{batchName}</span>.
      </p>
      <p className="text-sm text-gray-500 text-center">
        Enter student IDs separated by commas.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="studentIds" className="text-gray-700 font-semibold">Student IDs</Label>
          <Input
            id="studentIds"
            name="studentIds"
            value={studentIds}
            onChange={(e) => setStudentIds(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
        >
          Add Students
        </Button>
      </form>
    </motion.div>
  );
};

export default AddStudentPage;
