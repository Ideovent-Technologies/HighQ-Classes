// /src/pages/dashboard/StudyMaterials.tsx
import { useState, useEffect, useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import materialService from "@/API/services/materialService";
import courseService from "@/API/services/courseService";
import batchService from "@/API/services/batchService";
import { Material } from "@/types/material.types";
import FileUploader from "@/components/materials/FileUploader";
import MaterialCard from "@/components/materials/MaterialCard";
import { Input } from "@/components/ui/input";

const StudyMaterialsPage: React.FC = () => {
    const auth = useContext(AuthContext);
    const user = auth?.state.user; // Access the user from the context's value

    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Real data from API services
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch courses
                const coursesResult = await courseService.getAllCourses();
                if (coursesResult.success) {
                    setCourses(coursesResult.courses || []);
                }

                // Fetch batches
                const batchesResult = await batchService.getAllBatches();
                if (batchesResult.success) {
                    setBatches(batchesResult.batches || []);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchMaterials = async () => {
            setLoading(true);
            let result;
            if (user?.role === "student") {
                result = await materialService.getStudentMaterials();
            } else if (user?.role === "teacher" || user?.role === "admin") {
                result = await materialService.getAdminTeacherMaterials();
            }

            if (result?.success) {
                setMaterials(result.materials);
            }
            setLoading(false);
        };

        if (user) {
            fetchMaterials();
        }
    }, [user]);

    const handleUploadComplete = (newMaterial: Material) => {
        setMaterials((prev) => [newMaterial, ...prev]);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this material?")) {
            const result = await materialService.deleteMaterial(id);
            if (result.success) {
                setMaterials((prev) => prev.filter((m) => m._id !== id));
            } else {
                alert(result.message);
            }
        }
    };

    const filteredMaterials = materials.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4 space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold">Resource Platform</h1>
                <Input
                    placeholder="🔎 Search by title..."
                    className="max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2">
                    <h2 className="text-xl font-semibold mb-4">
                        Available Materials
                    </h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredMaterials.length > 0 ? (
                                filteredMaterials.map((m) => (
                                    <MaterialCard
                                        key={m._id}
                                        material={m}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <p>No materials found.</p>
                            )}
                        </div>
                    )}
                </section>

                {user?.role === "teacher" && (
                    <aside className="lg:col-span-1">
                        <FileUploader
                            onUploadComplete={handleUploadComplete}
                            courses={courses}
                            batches={batches}
                        />
                    </aside>
                )}
            </main>
        </div>
    );
};

export default StudyMaterialsPage;
