import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Megaphone,
    Calendar,
    Send,
    Bell,
    Edit3,
    Trash2,
    Plus,
    Eye,
    Clock,
    Target,
    Loader2,
    CheckCircle,
} from "lucide-react";
import AdminService from "@/API/services/AdminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
    _id: string;
    title: string;
    description: string;
    targetAudience: "all" | "students" | "teachers" | "batch";
    targetBatchIds?: string[];
    scheduledAt?: Date;
    isScheduled: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface AnnouncementFormData {
    title: string;
    description: string;
    targetAudience: "all" | "students" | "teachers" | "batch";
    targetBatchIds: string[];
    scheduledAt?: Date;
    isScheduled: boolean;
}

const AdminAnnouncementPage: React.FC = () => {
    const { toast } = useToast();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterAudience, setFilterAudience] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: "",
        description: "",
        targetAudience: "all",
        targetBatchIds: [],
        isScheduled: false,
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            // Using notices as announcements for now
            const response = await AdminService.getAllNotices();
            if (response.success && response.notices) {
                const formattedAnnouncements: Announcement[] =
                    response.notices.map((notice: any) => ({
                        _id: notice._id,
                        title: notice.title,
                        description: notice.content || notice.description || "",
                        targetAudience: "all" as const,
                        isScheduled: false,
                        isActive: true,
                        createdAt: new Date(notice.createdAt),
                        updatedAt: new Date(notice.updatedAt),
                    }));
                setAnnouncements(formattedAnnouncements);
            }
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
            toast({
                title: "Error",
                description: "Failed to fetch announcements",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await AdminService.createAnnouncement({
                title: formData.title,
                description: formData.description,
                targetAudience: formData.targetAudience,
                targetBatchIds: formData.targetBatchIds,
                scheduledAt: formData.scheduledAt || null,
                isScheduled: formData.isScheduled,
            });

            if (response.success) {
                toast({
                    title: "Success",
                    description: "Announcement created successfully!",
                });

                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    targetAudience: "all",
                    targetBatchIds: [],
                    isScheduled: false,
                });

                setIsDialogOpen(false);
                fetchAnnouncements(); // Refresh the list
            } else {
                throw new Error(
                    response.message || "Failed to create announcement"
                );
            }
        } catch (error: any) {
            console.error("Failed to create announcement:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to create announcement",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAnnouncements = announcements.filter((announcement) => {
        const matchesSearch =
            announcement.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            announcement.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterAudience === "all" ||
            announcement.targetAudience === filterAudience;

        return matchesSearch && matchesFilter;
    });

    const getAudienceBadgeColor = (audience: string) => {
        switch (audience) {
            case "students":
                return "bg-blue-100 text-blue-800";
            case "teachers":
                return "bg-green-100 text-green-800";
            case "batch":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Megaphone className="h-8 w-8 text-purple-600" />
                        Announcements Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Create and manage system-wide announcements
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            New Announcement
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5" />
                                Create New Announcement
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Title</Label>
                                <Input
                                    id="name"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Enter announcement description"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="audience">
                                    Target Audience
                                </Label>
                                <Select
                                    value={formData.targetAudience}
                                    onValueChange={(
                                        value:
                                            | "all"
                                            | "students"
                                            | "teachers"
                                            | "batch"
                                    ) =>
                                        setFormData({
                                            ...formData,
                                            targetAudience: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Users
                                        </SelectItem>
                                        <SelectItem value="students">
                                            Students Only
                                        </SelectItem>
                                        <SelectItem value="teachers">
                                            Teachers Only
                                        </SelectItem>
                                        <SelectItem value="batch">
                                            Specific Batches
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Create Announcement
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Select
                            value={filterAudience}
                            onValueChange={setFilterAudience}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by audience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Audiences
                                </SelectItem>
                                <SelectItem value="students">
                                    Students
                                </SelectItem>
                                <SelectItem value="teachers">
                                    Teachers
                                </SelectItem>
                                <SelectItem value="batch">
                                    Specific Batches
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">
                                    Total Announcements
                                </p>
                                <p className="text-2xl font-bold">
                                    {announcements.length}
                                </p>
                            </div>
                            <Megaphone className="h-8 w-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Active</p>
                                <p className="text-2xl font-bold">
                                    {
                                        announcements.filter((a) => a.isActive)
                                            .length
                                    }
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">This Month</p>
                                <p className="text-2xl font-bold">
                                    {
                                        announcements.filter((a) => {
                                            const month = new Date().getMonth();
                                            const year =
                                                new Date().getFullYear();
                                            return (
                                                a.createdAt.getMonth() ===
                                                    month &&
                                                a.createdAt.getFullYear() ===
                                                    year
                                            );
                                        }).length
                                    }
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Scheduled</p>
                                <p className="text-2xl font-bold">
                                    {
                                        announcements.filter(
                                            (a) => a.isScheduled
                                        ).length
                                    }
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Announcements List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Announcements ({filteredAnnouncements.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                    ) : filteredAnnouncements.length === 0 ? (
                        <div className="text-center p-8">
                            <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No announcements found
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || filterAudience !== "all"
                                    ? "Try adjusting your filters"
                                    : "Create your first announcement to get started"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAnnouncements.map((announcement) => (
                                <motion.div
                                    key={announcement._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {announcement.title}
                                                </h3>
                                                <Badge
                                                    className={getAudienceBadgeColor(
                                                        announcement.targetAudience
                                                    )}
                                                >
                                                    {
                                                        announcement.targetAudience
                                                    }
                                                </Badge>
                                                {announcement.isActive && (
                                                    <Badge variant="default">
                                                        Active
                                                    </Badge>
                                                )}
                                                {announcement.isScheduled && (
                                                    <Badge variant="secondary">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Scheduled
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-3">
                                                {announcement.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {announcement.createdAt.toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Target className="h-4 w-4" />
                                                    {
                                                        announcement.targetAudience
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAnnouncementPage;
