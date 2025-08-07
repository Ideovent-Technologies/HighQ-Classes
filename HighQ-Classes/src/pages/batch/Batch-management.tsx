import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import batchService from "@/API/services/batchService";
import { Batch } from "@/types/Batch.Types";
import BatchCard from "@/components/dashboard/batch/BatchCard";

const BatchManagementPage = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBatches = async () => {
    setLoading(true);
    const res = await batchService.getAllBatches();
    setBatches(res.batches || []);
    console.log("Fetched batches:", res.batches);
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Batch Management</h1>
        <Link to="/dashboard/batches/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Batch
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading batches...</p>
      ) : batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch._id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchManagementPage;
