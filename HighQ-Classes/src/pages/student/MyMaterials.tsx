import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Search,
    Download,
    Eye,
    FileText,
    Image,
    Video,
    File,
    Calendar,
    User,
    BookOpen,
    Filter,
    Grid,
    List,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { StudentUser } from "@/types/student.types";
import { studentService } from "@/API/services/studentService";

interface Material {
    _id: string;
    title: string;
    description?: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: string;
    course?: string;
    batch?: string;
    category: string;
    downloadCount: number;
    isActive: boolean;
}

const MyMaterials: React.FC = () => {
    const { state } = useAuth();
    const user =
        state.user && state.user.role === "student"
            ? (state.user as unknown as StudentUser)
            : null;

    const [materials, setMaterials] = useState<Material[]>([]);
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    useEffect(() => {
        const fetchMaterials = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                // Don't pass studentId - the backend uses the authenticated user's info
                const data = await studentService.getStudentMaterials();
                setMaterials(data);
                setFilteredMaterials(data);
                setError(null);
            } catch (err: any) {
                console.error("Materials fetch error:", err);
                setError(err.message || "Failed to load materials");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMaterials();
    }, [user]);

    useEffect(() => {
        let filtered = materials;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (material) =>
                    material.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    material.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (material.category &&
                        material.category
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (material) => material.category === selectedCategory
            );
        }

        setFilteredMaterials(filtered);
    }, [materials, searchTerm, selectedCategory]);

    const getFileIcon = (fileType: string) => {
        if (fileType.startsWith("image/")) return <Image className="h-6 w-6" />;
        if (fileType.startsWith("video/")) return <Video className="h-6 w-6" />;
        if (fileType.includes("pdf") || fileType.includes("document"))
            return <FileText className="h-6 w-6" />;
        return <File className="h-6 w-6" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleDownload = (material: Material) => {
        // Create a temporary link element and trigger download
        const link = document.createElement("a");
        link.href = material.fileUrl;
        link.download = material.title;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = (material: Material) => {
        // Open in new tab for viewing
        window.open(material.fileUrl, "_blank");
    };

    const categories = [
        "all",
        ...Array.from(
            new Set(materials.map((m) => m.category).filter(Boolean))
        ),
    ];

    if (!user) {
        return (
            <div className="flex justify-center items-center h-96">
                <Card className="p-6">
                    <CardContent>
                        <div className="text-center">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Please Login
                            </h3>
                            <p className="text-gray-600">
                                You need to be logged in as a student to view
                                materials.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your materials...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Materials
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Access your study materials and resources
                    </p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                        {filteredMaterials.length} Materials Available
                    </Badge>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search materials..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="md:w-48">
                            <select
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === "all"
                                            ? "All Categories"
                                            : category &&
                                              category.charAt(0).toUpperCase() +
                                                  category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex border border-gray-300 rounded-md">
                            <Button
                                variant={
                                    viewMode === "grid" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className="rounded-r-none"
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className="rounded-l-none"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Materials Display */}
            {filteredMaterials.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Materials Found
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your search or filter criteria."
                                : "No study materials have been uploaded for your courses yet."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                    }
                >
                    {filteredMaterials.map((material) => (
                        <Card
                            key={material._id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            {getFileIcon(material.fileType)}
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg line-clamp-2">
                                                {material.title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {material.category}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {material.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {material.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                    <div className="flex items-center space-x-4">
                                        <span>
                                            {formatFileSize(material.fileSize)}
                                        </span>
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(material.uploadedAt)}
                                        </span>
                                    </div>
                                    <span className="flex items-center">
                                        <Download className="h-3 w-3 mr-1" />
                                        {material.downloadCount}
                                    </span>
                                </div>

                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleView(material)}
                                        className="flex-1"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleDownload(material)}
                                        className="flex-1"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyMaterials;
