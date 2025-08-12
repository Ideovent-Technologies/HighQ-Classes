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
                const response = await batchService.getBatchById(batchId);
                if (response.success && response.batch) {
                    setBatch(response.batch);
                } else {
                    toast.error("Batch not found");
                    navigate("/dashboard/batches/manage");
                }
            } catch (error) {
                toast.error("Failed to load batch data");
                navigate("/dashboard/batches/manage");
            } finally {
                setLoading(false);
            }
        };

        fetchBatch();
    }, [batchId, navigate]);

    if (loading) {
        return <p className="text-center mt-6">Loading batch details...</p>;
    }

    if (!batch) {
        return <p className="text-center mt-6 text-red-500">Batch not found.</p>;
    }

    return <BatchForm batchToEdit={batch} />;
};

export default EditBatchPage;
