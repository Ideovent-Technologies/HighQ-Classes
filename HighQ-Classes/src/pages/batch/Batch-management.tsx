import React, { useEffect, useState } from "react";
import { Batch } from "@/types/batch.types";
import { BatchService } from "@/API/services/admin/batches.service";
import BatchCard from "@/components/dashboard/batch/BatchCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BatchManagementPage = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const batchService = new BatchService();

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await batchService.getAllBatches();
        if (response.success && response.data) {
          setBatches(response.data);
        } else {
          setError(response.message || "Failed to fetch batches.");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading batches...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Batch Management</h1>
        <Link to="/dashboard/batches/add">
          <Button>Add New Batch</Button>
        </Link>
      </div>

      {batches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <BatchCard key={batch._id} batch={batch} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No batches found.
        </div>
      )}
    </div>
  );
};

export default BatchManagementPage;
