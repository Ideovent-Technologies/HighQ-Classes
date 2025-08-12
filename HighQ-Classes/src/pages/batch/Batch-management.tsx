import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import batchService from "@/API/services/batchService";
import { Batch } from "@/types/Batch.Types";
import BatchCard from "@/components/dashboard/batch/BatchCard";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const BatchManagementPage = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await batchService.getAllBatches();
      setBatches((res.batches as any) || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch batches. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = (batch: Batch) => {
    navigate(`/dashboard/batches/edit/${batch._id}`);
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const result = await batchService.deleteBatch(batchId);
      if (result.success) {
        setBatches(batches.filter((batch) => batch._id !== batchId));
        toast({
          title: "Success",
          description: "Batch deleted successfully! 🎉",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete batch",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while deleting the batch",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="relative p-8 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Background Decorations */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-br from-pink-200 via-orange-200 to-yellow-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 md:py-6 border-b border-gray-200 -mx-8 px-8 md:-mx-10 md:px-10 rounded-xl shadow-sm"
      >
        <div className="mb-4 md:mb-0">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            📚 Batch Management
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            View, create, and manage all your educational batches here.
          </p>
        </div>
        <Link to="/dashboard/batches/add">
          <Button
            className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Batch
          </Button>
        </Link>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {loading ? (
          // Loader with shimmer
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl h-52 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"
              />
            ))}
          </motion.div>
        ) : batches.length === 0 ? (
          // Empty State with floating animation
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-gray-300 shadow-lg"
          >
            <motion.img
              src="https://illustrations.popsy.co/gray/teamwork.svg"
              alt="No batches"
              className="w-64 opacity-80"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <h2 className="text-3xl font-bold text-gray-800">
              No batches found
            </h2>
            <p className="text-gray-500 max-w-md">
              It looks a little empty here. Start by creating your first batch
              and it will appear here.
            </p>
            <Link to="/dashboard/batches/add">
              <Button className="mt-4 shadow-md bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                <Plus className="h-5 w-5 mr-2" />
                Create First Batch
              </Button>
            </Link>
          </motion.div>
        ) : (
          // Batches Grid
          <motion.div
            key="batches"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {batches.map((batch, index) => (
                <motion.div
                  key={batch._id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  layout
                  className="hover:scale-[1.02] transition-transform duration-300"
                >
                  <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <BatchCard
                      batch={batch}
                      onEdit={handleEditBatch}
                      onDelete={handleDeleteBatch}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer keyframes */}
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
    </div>
  );
};

export default BatchManagementPage;
