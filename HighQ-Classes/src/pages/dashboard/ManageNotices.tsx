import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    Plus,
    Edit3,
    Trash2,
    Eye,
    Calendar,
    Users,
    Search,
    Filter,
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

interface Notice {
    _id: string;
    title: string;
    content: string;
    isImportant: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface NoticeFormData {
    title: string;
    content: string;
    isImportant: boolean;
}

const ManageNotices: React.FC = () => {
    const { toast } = useToast();
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");

    const [formData, setFormData] = useState<NoticeFormData>({
        title: "",
        content: "",
        isImportant: false,
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllNotices();
            if (response.success && response.notices) {
                setNotices(response.notices);
            } else {
                // For now, show empty state instead of error
                setNotices([]);
                console.warn(
                    "Notice endpoint not available:",
                    response.message
                );
            }
        } catch (error) {
            console.error("Failed to fetch notices:", error);
            // Show empty state instead of error toast
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // TODO: Implement proper admin notice creation once backend API is ready
            toast({
                title: "Info",
                description:
                    "Notice creation will be available once backend API is configured.",
                variant: "default",
            });

            setIsDialogOpen(false);
        } catch (error: any) {
            console.error("Failed to create notice:", error);
            toast({
                title: "Error",
                description: "Notice creation not available yet",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredNotices = notices.filter((notice) => {
        const matchesSearch =
            notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterType === "all" ||
            (filterType === "important" && notice.isImportant) ||
            (filterType === "active" && notice.isActive);

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Bell className="h-8 w-8 text-blue-600" />
                        Manage Notices
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Create and manage system notices for all users
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Notice
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Create New Notice
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
                                    placeholder="Enter notice title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            content: e.target.value,
                                        })
                                    }
                                    placeholder="Enter notice content"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="important"
                                    checked={formData.isImportant}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isImportant: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <Label htmlFor="important">
                                    Mark as Important
                                </Label>
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
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Create Notice
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
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search notices..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={filterType}
                            onValueChange={setFilterType}
                        >
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter notices" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Notices</SelectItem>
                                <SelectItem value="important">
                                    Important
                                </SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Notices</p>
                                <p className="text-2xl font-bold">
                                    {notices.length}
                                </p>
                            </div>
                            <Bell className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Active Notices</p>
                                <p className="text-2xl font-bold">
                                    {notices.filter((n) => n.isActive).length}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Important</p>
                                <p className="text-2xl font-bold">
                                    {
                                        notices.filter((n) => n.isImportant)
                                            .length
                                    }
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notices List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        All Notices ({filteredNotices.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredNotices.length === 0 ? (
                        <div className="text-center p-8">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Notice Management
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm || filterType !== "all"
                                    ? "Try adjusting your filters"
                                    : "Admin notice management system is ready for use."}
                            </p>
                            <p className="text-sm text-blue-600">
                                Backend API integration pending - notices will
                                appear here once connected.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredNotices.map((notice) => (
                                <motion.div
                                    key={notice._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {notice.title}
                                                </h3>
                                                {notice.isImportant && (
                                                    <Badge variant="destructive">
                                                        Important
                                                    </Badge>
                                                )}
                                                {notice.isActive && (
                                                    <Badge variant="default">
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-600 mb-3">
                                                {notice.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(
                                                        notice.createdAt
                                                    ).toLocaleDateString()}
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

export default ManageNotices;
