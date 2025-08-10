import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import batchService from "@/API/services/batchService";
import AdminService from "@/API/services/AdminService";

interface Student {
    _id: string;
    name: string;
    email: string;
}

const AddStudentsToBatchPage = () => {
    const { batchId } = useParams<{ batchId: string }>();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Fetch all students
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await AdminService.getAllStudents();
            setStudents(res.students || []);
            console.log(res)
        } catch {
            toast({
                title: "Error",
                description: "Failed to fetch students",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const handleCheckboxChange = (studentId: string) => {
        setSelectedIds((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAddStudents = async () => {
        if (selectedIds.length === 0) {
            toast({
                title: "Warning",
                description: "Please select at least one student",
                variant: "destructive",
            });
            return;
        }
        try {
            const result = await batchService.addStudentsToBatch(batchId!, selectedIds);
            if (result.success) {
                toast({
                    title: "Success",
                    description: "Students added to batch successfully!",
                });
                console.log(result)
                navigate("/dashboard/batches");
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to add students to batch",
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "An error occurred while adding students",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Add Students to Batch</h1>

            {loading ? (
                <p>Loading students...</p>
            ) : students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div className="space-y-4">
                    {students.map((student) => (
                        <div
                            key={student._id}
                            className="flex items-center justify-between border p-3 rounded"
                        >
                            <div>
                                <p className="font-semibold">{student.name}</p>
                                <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(student._id)}
                                onChange={() => handleCheckboxChange(student._id)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-4">
                <Button onClick={handleAddStudents}>Add Selected Students</Button>
                <Button variant="outline" onClick={() => navigate("/dashboard/batches")}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default AddStudentsToBatchPage;
