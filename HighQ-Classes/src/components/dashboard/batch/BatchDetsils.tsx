import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import batchService from "@/API/services/batchService";
import { Batch } from "@/types/Batch.Types";

const BatchDetails = () => {
    const { batchId } = useParams<{ batchId: string }>();
    const [batch, setBatch] = useState<Batch | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchBatch = async () => {
            // 🔐 Validate batchId format before making API call
            if (
                !batchId ||
                batchId.length !== 24 ||
                !/^[a-fA-F0-9]{24}$/.test(batchId)
            ) {
                setErrorMessage("Invalid batch ID format");
                setLoading(false);
                return;
            }

            try {
                const response = await batchService.getBatchById(batchId);
                if (response.success && response.batch) {
                    setBatch(response.batch);
                    console.log("Fetched batch:", response.batch);
                } else {
                    setErrorMessage(response.message || "Batch not found");
                }
            } catch (error: any) {
                console.error("Failed to fetch batch:", error);
                setErrorMessage(
                    error?.response?.data?.error ||
                        error?.message ||
                        "Failed to fetch batch"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBatch();
    }, [batchId]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (errorMessage)
        return (
            <div className="text-center mt-10 text-red-500">{errorMessage}</div>
        );
    if (!batch)
        return (
            <div className="text-center mt-10 text-red-500">
                Batch not found
            </div>
        );

    const courseName =
        typeof batch.courseId === "object" && batch.courseId !== null
            ? batch.courseId.name
            : String(batch.courseId);

    const teacherName =
        typeof batch.teacherId === "object" && batch.teacherId !== null
            ? batch.teacherId.name
            : "N/A";

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4">{batch.name}</h2>

            <p>
                <strong>Start Date:</strong>{" "}
                {batch.startDate
                    ? new Date(batch.startDate).toLocaleDateString()
                    : "N/A"}
            </p>
            <p>
                <strong>End Date:</strong>{" "}
                {batch.endDate
                    ? new Date(batch.endDate).toLocaleDateString()
                    : "N/A"}
            </p>
            <p>
                <strong>Course:</strong> {courseName || "N/A"}
            </p>
            <p>
                <strong>Instructor:</strong> {teacherName || "N/A"}
            </p>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                    Enrolled Students
                </h3>
                {batch.students && batch.students.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {batch.students.map((student, index) => {
                            if (typeof student === "string") {
                                return <li key={index}>{student}</li>;
                            }
                            return (
                                <li key={student._id}>
                                    {student.name}{" "}
                                    {student.email ? `(${student.email})` : ""}
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
