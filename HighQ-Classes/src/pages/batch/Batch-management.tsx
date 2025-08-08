import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import batchService from "@/API/services/batchService";
import { Batch } from "@/types/Batch.Types";
import BatchCard from "@/components/dashboard/batch/BatchCard";
import { useToast } from "@/hooks/use-toast";

const BatchManagementPage = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    const fetchBatches = async () => {
        setLoading(true);
        const res = await batchService.getAllBatches();
        setBatches((res.batches as any) || []);
        console.log("Fetched batches:", res.batches);
        setLoading(false);
    };

    const handleEditBatch = (batch: Batch) => {
        // Navigate to edit batch page
        navigate(`/dashboard/batches/edit/${batch._id}`);
    };

    const handleDeleteBatch = async (batchId: string) => {
        try {
            const result = await batchService.deleteBatch(batchId);
            if (result.success) {
                setBatches(batches.filter((batch) => batch._id !== batchId));
                toast({
                    title: "Success",
                    description: "Batch deleted successfully!",
                });
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to delete batch",
                    variant: "destructive",
                });
            }
        } catch (error) {
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
                        <BatchCard
                            key={batch._id}
                            batch={batch}
                            onEdit={handleEditBatch}
                            onDelete={handleDeleteBatch}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BatchManagementPage;
