import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Assuming these are the correct paths and interfaces
import { Batch, CreateBatchData, CourseRef, TeacherRef, StudentRef } from "@/types/Batch.Types"; // Import CourseRef, TeacherRef, StudentRef
import batchService from "@/API/services/batchService";

// UI Components
import BatchForm, { BatchFormProps } from "@/components/dashboard/batch/BatchForm";
import Loader from "@/components/common/Loader"; // Your Loader component
import ErrorBoundary from "@/components/common/ErrorBoundary"; // Your ErrorBoundary component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// The main EditBatchPage component logic
const EditBatchPageContent: React.FC = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Fetch Batch Data on mount ---
  useEffect(() => {
    const fetchBatch = async () => {
      if (!batchId) {
        toast.error("Batch ID is missing in the URL.");
        navigate("/dashboard/batches/manage");
        return;
      }
      try {
        const response = await batchService.getBatchById(batchId);
        if (response.success && response.batch) {
          // Cast response.batch to 'any' initially to handle potential API response inconsistencies
          const apiBatch: any = response.batch;

          // Explicitly map properties to ensure they conform to the 'Batch' interface.
          // This handles cases where the API might return just IDs (strings) instead of full objects for references,
          // and ensures 'createdAt'/'updatedAt' are always present as strings.
          const mappedBatch: Batch = {
            _id: apiBatch._id || '',
            name: apiBatch.name || '',
            description: apiBatch.description || '', // Ensure description is always present
            capacity: apiBatch.capacity || 0, // Ensure capacity is always present
            status: apiBatch.status || 'active', // Ensure status is always present
            schedule: {
              days: apiBatch.schedule?.days || [],
              startTime: apiBatch.schedule?.startTime || '',
              endTime: apiBatch.schedule?.endTime || '',
            },
            startDate: apiBatch.startDate || '',
            endDate: apiBatch.endDate || '',

            // Handle courseId: if it's a string, create a dummy CourseRef object, otherwise use as is.
            courseId: typeof apiBatch.courseId === 'string'
              ? { _id: apiBatch.courseId, name: 'Unknown Course' } as CourseRef
              : apiBatch.courseId as CourseRef, // Assert as CourseRef if it's already an object
            
            // Handle teacherId: if it's a string, create a dummy TeacherRef object, otherwise use as is.
            teacherId: typeof apiBatch.teacherId === 'string'
              ? { _id: apiBatch.teacherId, name: 'Unknown Teacher' } as TeacherRef
              : apiBatch.teacherId as TeacherRef, // Assert as TeacherRef if it's already an object

            // Handle students: map each student to a StudentRef object if it's a string ID.
            students: apiBatch.students?.map((s: string | StudentRef) =>
              typeof s === 'string' ? { _id: s, name: 'Unknown Student' } as StudentRef : s as StudentRef
            ) || [],
            
            // Ensure createdAt and updatedAt are present as per Batch interface, providing fallbacks.
            createdAt: apiBatch.createdAt || new Date().toISOString(),
            updatedAt: apiBatch.updatedAt || new Date().toISOString(),
          };
          setBatch(mappedBatch);
        } else {
          toast.error("Batch not found. Redirecting...");
          navigate("/dashboard/batches/manage");
        }
      } catch (err) {
        toast.error("Failed to load batch data. Please try again.");
        console.error("Error fetching batch:", err);
        navigate("/dashboard/batches/manage");
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
  }, [batchId, navigate]);

  // --- Handle Form Submission ---
  const handleUpdate = async (data: CreateBatchData) => {
    if (!batchId) return;

    setIsSubmitting(true);
    try {
      // Convert string dates from formData to actual Date objects for the API payload
      // if your 'updateBatch' service expects 'Date' objects for 'startDate' and 'endDate'.
      const dataToSend: any = { ...data }; // Use 'any' to allow flexible date type assignment

      if (dataToSend.startDate) {
        dataToSend.startDate = new Date(dataToSend.startDate); // Convert string to Date object
      } else {
        delete dataToSend.startDate; // Remove if empty or null
      }
      if (dataToSend.endDate) {
        dataToSend.endDate = new Date(dataToSend.endDate); // Convert string to Date object
      } else {
        delete dataToSend.endDate; // Remove if empty or null
      }

      const response = await batchService.updateBatch(batchId, dataToSend);

      if (response.success) {
        toast.success("Batch updated successfully!");
        navigate("/dashboard/batches/manage");
      } else {
        toast.error(response.message || "Failed to update batch.");
      }
    } catch (err) {
      toast.error("An error occurred during update.");
      console.error("Error updating batch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render based on state ---
  if (loading) {
    // FIX: Changed 'message' prop to 'text' to match the updated Loader component interface.
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader text="Loading batch details..." />
      </div>
    );
  }

  // If loading is false and batch is still null, it means data was not found or an error occurred.
  if (!batch) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Batch Data Unavailable
            </CardTitle>
            <p className="text-gray-600">
              The batch you are looking for could not be loaded or does not exist.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate("/dashboard/batches/manage")}>
              Go to Batches List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Main Component JSX ---
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Batch: {batch.name}</CardTitle>
          <p className="text-gray-500">
            Modify the details for the batch.
          </p>
        </CardHeader>
        <CardContent>
          <BatchForm
            initialData={batch}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/batches/manage")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Wrap the component with your ErrorBoundary for error handling
const EditBatchPage = () => (
  <ErrorBoundary>
    <EditBatchPageContent />
  </ErrorBoundary>
);

export default EditBatchPage;
