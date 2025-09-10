import React, { useEffect, useState } from "react";
import { Batch } from "@/types/batch.types";
import { BatchService } from "../../../API/services/admin/batches.service";

const batchService = new BatchService();

const BatchDetails: React.FC<{ batchId: string }> = ({ batchId }) => {
  const [batch, setBatch] = useState<Batch | null>(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await batchService.getAllBatches();
        if (res.success && res.data) {
          const batchFromService = res.data.find(b => b._id === batchId);
          if (batchFromService) {
            const formattedBatch: Batch = {
              _id: batchFromService._id,
              name: batchFromService.name,
              courseId: typeof batchFromService.courseId === "string"
                ? { _id: batchFromService.courseId, name: "" }
                : batchFromService.courseId,
              teacherId: batchFromService.teacherId || { _id: "", name: "" },
              students: batchFromService.students || [],
              createdAt: batchFromService.createdAt || "",
              updatedAt: batchFromService.updatedAt || "",
              schedule: batchFromService.schedule,
              startDate: batchFromService.startDate,
              endDate: batchFromService.endDate,
              status: batchFromService.status,
              capacity: batchFromService.capacity,
              description: batchFromService.description
            };
            setBatch(formattedBatch);
          }
        }
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    };

    fetchBatch();
  }, [batchId]);

  if (!batch) return <div>Loading batch details...</div>;

  return (
    <div>
      <h2>{batch.name}</h2>
      <p>Course: {batch.courseId.name}</p>
      <p>Teacher: {batch.teacherId.name}</p>
      <p>Start Date: {batch.startDate}</p>
      <p>End Date: {batch.endDate}</p>
      <p>Capacity: {batch.capacity}</p>
      <p>Status: {batch.status}</p>
      <p>Description: {batch.description}</p>
      {/* You can add more detailed info here */}
    </div>
  );
};

export default BatchDetails;
