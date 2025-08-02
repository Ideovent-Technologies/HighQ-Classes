import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Batch } from "@/types/Batch.Types";

interface BatchFormProps {
    batchToEdit?: Batch;
}

const BatchForm: React.FC<BatchFormProps> = ({ batchToEdit }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Batch>>(
        batchToEdit || { name: "", courseId: "", teacherId: "" }
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Submitting batch data:", formData);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard/batches");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mr-4">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {batchToEdit ? "Edit Batch" : "Create New Batch"}
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{batchToEdit ? "Edit Batch" : "Batch Details"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Batch Name</Label>
                            <Input
                                id="name"
                                value={formData.name || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="courseId">Course ID</Label>
                            <Input
                                id="courseId"
                                value={formData.courseId || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="teacherId">Teacher ID</Label>
                            <Input
                                id="teacherId"
                                value={formData.teacherId || ""}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Batch"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BatchForm;