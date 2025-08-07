import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import batchService from "@/API/services/batchService";
import { Batch } from "@/types/Batch.Types";

const BatchDetails = () => {
  const { batchId } = useParams<{ batchId: string }>();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const response = await batchService.getBatchById(batchId!);
        setBatch(response.batch);
        console.log("Fetched batch:", response.batch);
      } catch (error) {
        console.error('Failed to fetch batch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!batch) return <div className="text-center mt-10 text-red-500">Batch not found</div>;

  const courseName =
    typeof batch.courseId === "object" ? batch.courseId.name : batch.courseId;

  const teacherName =
    typeof batch.teacherId === "object" ? batch.teacherId.name : batch.teacherId;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">{batch.name}</h2>

      <p><strong>Start Date:</strong> {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "N/A"}</p>
      <p><strong>End Date:</strong> {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "N/A"}</p>
      <p><strong>Course:</strong> {courseName || "N/A"}</p>
      <p><strong>Instructor:</strong> {teacherName || "N/A"}</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Enrolled Students</h3>
        {batch.students && batch.students.length > 0 ? (
          <ul className="list-disc pl-5">
            {batch.students.map((student, index) => {
              if (typeof student === "string") {
                return <li key={index}>{student}</li>;
              }
              return (
                <li key={student._id}>
                  {student.name} {student.email ? `(${student.email})` : ""}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-600">No students enrolled.</p>
        )}
      </div>
    </div>
  );
};

export default BatchDetails;
