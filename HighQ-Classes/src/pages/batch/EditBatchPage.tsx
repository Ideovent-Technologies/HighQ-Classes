import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import BatchForm from "@/components/dashboard/batch/BatchForm";
import batchService from "@/API/services/batchService";
import { Batch } from "@/types/Batch.Types";

const EditBatchPage: React.FC = () => {
    const { batchId } = useParams<{ batchId: string }>();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<Batch | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBatch = async () => {
            if (!batchId) {
                toast.error("Batch ID is required");
                navigate("/dashboard/batches/manage");
                return;
            }

            try {
                setLoading(true);
                const batchData = await batchService.getBatchById(batchId);
                setBatch(batchData as any); // Temporary type assertion until type mismatch is fixed
                setLoading(false);
            } catch (error) {
                console.error("Error fetching batch:", error);
                toast.error("Failed to load batch data");
                navigate("/dashboard/batches/manage");
            }
        };

        fetchBatch();
    }, [batchId, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">
                        Loading batch data...
                    </p>
                </div>
            </div>
        );
    }

    if (!batch) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Batch Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The batch you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard/batches/manage")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Back to Batches
                    </button>
                </div>
            </div>
        );
    }

    return <BatchForm batchToEdit={batch} />;
};

export default EditBatchPage;
