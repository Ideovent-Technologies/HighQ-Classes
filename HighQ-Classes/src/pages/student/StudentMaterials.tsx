import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BookOpen,
    Download,
    Eye,
    FileText,
    Image,
    Video,
    File,
    Search,
    Filter,
    Calendar,
    User,
    ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import batchService from "@/API/services/batchService";
import { useBatchInfo } from "@/hooks/useBatch";

interface Material {
    _id: string;
    title: string;
    description?: string;
    type: "pdf" | "image" | "video" | "document" | "presentation" | "other";
    fileUrl: string;
    fileName: string;
    fileSize: number;
    uploadedBy: {
        _id: string;
        name: string;
        role: string;
    };
    uploadedAt: string;
    courseId: string;
    batchId?: string;
    isViewed?: boolean;
    viewedAt?: string;
    tags?: string[];
}

const StudentMaterials: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const { batchInfo, isAssigned } = useBatchInfo();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAssigned) {
            fetchMaterials();
        } else {
            setLoading(false);
        }
    }, [isAssigned]);

    useEffect(() => {
        filterMaterials();
    }, [materials, searchTerm, typeFilter]);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            setError(null);

            const materialsData = await batchService.getBatchMaterials();
            setMaterials(materialsData);
        } catch (err: any) {
            console.error("Error fetching materials:", err);
            setError(err.message || "Failed to load materials");
        } finally {
            setLoading(false);
        }
    };

    const filterMaterials = () => {
        let filtered = [...materials];

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
                    material.fileName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filter by type
        if (typeFilter !== "all") {
            filtered = filtered.filter(
                (material) => material.type === typeFilter
            );
        }

        setFilteredMaterials(filtered);
    };

    const handleViewMaterial = async (material: Material) => {
        try {
            // Mark as viewed
            await batchService.viewMaterial(material._id);

            // Update local state
            setMaterials((prev) =>
                prev.map((m) =>
                    m._id === material._id
                        ? {
                              ...m,
                              isViewed: true,
                              viewedAt: new Date().toISOString(),
                          }
                        : m
                )
            );

            // Open material based on type
            if (material.type === "video") {
                navigate(`/student/materials/video/${material._id}`);
            } else if (material.type === "pdf") {
                window.open(material.fileUrl, "_blank");
            } else {
                window.open(material.fileUrl, "_blank");
            }
        } catch (error) {
            console.error("Error viewing material:", error);
            // Still open the material even if tracking fails
            window.open(material.fileUrl, "_blank");
        }
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case "pdf":
            case "document":
                return <FileText className="h-6 w-6 text-red-600" />;
            case "image":
                return <Image className="h-6 w-6 text-green-600" />;
            case "video":
                return <Video className="h-6 w-6 text-purple-600" />;
            case "presentation":
                return <FileText className="h-6 w-6 text-blue-600" />;
            default:
                return <File className="h-6 w-6 text-gray-600" />;
        }
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!isAssigned) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert>
                    <AlertDescription>
                        You are not assigned to any batch yet. Please contact
                        your administrator to access materials.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                        {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const materialTypes = [
        "all",
        "pdf",
        "document",
        "image",
        "video",
        "presentation",
        "other",
    ];

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Study Materials
                    </h1>
                    <p className="text-gray-600">
                        Materials for {batchInfo?.name} -{" "}
                        {batchInfo?.course.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        {filteredMaterials.length} of {materials.length}{" "}
                        materials
                    </Badge>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchMaterials}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
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
                        <div className="w-full md:w-48">
                            <Select
                                value={typeFilter}
                                onValueChange={setTypeFilter}
                            >
                                <SelectTrigger>
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {materialTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type === "all"
                                                ? "All Types"
                                                : type.charAt(0).toUpperCase() +
                                                  type.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Materials Grid */}
            {filteredMaterials.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            {materials.length === 0
                                ? "No materials available"
                                : "No materials match your search"}
                        </h3>
                        <p className="text-gray-500">
                            {materials.length === 0
                                ? "Your teacher hasn't uploaded any materials yet."
                                : "Try adjusting your search terms or filters."}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.map((material) => (
                        <Card
                            key={material._id}
                            className="group hover:shadow-lg transition-shadow"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(material.type)}
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base font-medium truncate">
                                                {material.title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-500 capitalize">
                                                {material.type}
                                            </p>
                                        </div>
                                    </div>
                                    {material.isViewed && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            Viewed
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {material.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {material.description}
                                    </p>
                                )}

                                <div className="space-y-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <File className="h-3 w-3" />
                                        <span className="truncate">
                                            {material.fileName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        <span>
                                            {formatDate(material.uploadedAt)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-3 w-3" />
                                        <span>{material.uploadedBy.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>
                                            {formatFileSize(material.fileSize)}
                                        </span>
                                        {material.viewedAt && (
                                            <span className="text-green-600">
                                                Viewed:{" "}
                                                {formatDate(material.viewedAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {material.tags && material.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {material.tags.map((tag, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            handleViewMaterial(material)
                                        }
                                        className="flex-1"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            window.open(
                                                material.fileUrl,
                                                "_blank"
                                            )
                                        }
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            window.open(
                                                material.fileUrl,
                                                "_blank"
                                            )
                                        }
                                    >
                                        <ExternalLink className="h-4 w-4" />
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

export default StudentMaterials;
