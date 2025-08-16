import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    Users,
    Calendar,
    DollarSign,
    Clock,
    Star,
    Award,
    TrendingUp,
    Download,
    Loader2,
} from "lucide-react";
import AdminService from "@/API/services/AdminService";
import CourseService from "@/API/services/courseService";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Course {
    _id: string;
    title: string;
    description: string;
    subject: string;
    category: string;
    level: string;
    duration: number;
    fee: number;
    maxStudents: number;
    currentStudents: number;
    teacher: {
        _id: string;
        name: string;
    };
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
}

interface CourseFormData {
    title: string;
    description: string;
    subject: string;
    category: string;
    level: string;
    duration: number;
    fee: number;
    maxStudents: number;
    teacherId: string;
    startDate: string;
    endDate: string;
}

const AdminCourseManagement: React.FC = () => {
    const { toast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [formData, setFormData] = useState<CourseFormData>({
        title: "",
        description: "",
        subject: "",
        category: "",
        level: "",
        duration: 0,
        fee: 0,
        maxStudents: 30,
        teacherId: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch courses from API
            const coursesResponse = await CourseService.getAllCourses();
            if (coursesResponse.success && coursesResponse.courses) {
                // Map API response to expected format
                const mappedCourses = coursesResponse.courses.map(
                    (course: any) => ({
                        _id: course._id,
                        title: course.name || course.title,
                        description: course.description || "",
                        subject: course.subject || "",
                        category: course.category || "General",
                        level: course.level || "Beginner",
                        duration: course.duration || 0,
                        fee: course.fee || 0,
                        maxStudents: course.maxStudents || 50,
                        currentStudents: course.currentStudents || 0,
                        teacher: course.teacher || { _id: "", name: "TBA" },
                        startDate: new Date(course.startDate || Date.now()),
                        endDate: new Date(course.endDate || Date.now()),
                        isActive: course.isActive !== false,
                        createdAt: new Date(course.createdAt || Date.now()),
                    })
                );
                setCourses(mappedCourses);
            }

            const teachersResponse = await AdminService.getAllTeachers();
            if (teachersResponse.success && teachersResponse.teachers) {
                setTeachers(teachersResponse.teachers);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async () => {
        try {
            // Simulate course creation since we don't have the endpoint
            const newCourse: Course = {
                _id: Date.now().toString(),
                ...formData,
                currentStudents: 0,
                teacher: teachers.find((t) => t._id === formData.teacherId) || {
                    _id: "",
                    name: "Unknown",
                },
                startDate: new Date(formData.startDate),
                endDate: new Date(formData.endDate),
                isActive: true,
                createdAt: new Date(),
            };

            setCourses((prev) => [newCourse, ...prev]);

            toast({
                title: "Success!",
                description: "Course created successfully",
            });

            setIsCreateDialogOpen(false);
            setFormData({
                title: "",
                description: "",
                subject: "",
                category: "",
                level: "",
                duration: 0,
                fee: 0,
                maxStudents: 30,
                teacherId: "",
                startDate: "",
                endDate: "",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create course",
                variant: "destructive",
            });
        }
    };

    const filteredCourses = courses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            categoryFilter === "all" ||
            course.category.toLowerCase() === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryBadgeColor = (category: string) => {
        switch (category.toLowerCase()) {
            case "jee":
                return "bg-blue-100 text-blue-800";
            case "neet":
                return "bg-green-100 text-green-800";
            case "board":
                return "bg-purple-100 text-purple-800";
            case "foundation":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getLevelBadgeColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "beginner":
                return "bg-green-100 text-green-800";
            case "intermediate":
                return "bg-yellow-100 text-yellow-800";
            case "advanced":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading courses...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        Course Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage courses, subjects, and academic programs
                    </p>
                </div>

                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Course</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">
                                        Course Title *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter course title"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                subject: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter subject"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter course description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                category: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="JEE">
                                                JEE
                                            </SelectItem>
                                            <SelectItem value="NEET">
                                                NEET
                                            </SelectItem>
                                            <SelectItem value="Board">
                                                Board
                                            </SelectItem>
                                            <SelectItem value="Foundation">
                                                Foundation
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="level">Level</Label>
                                    <Select
                                        value={formData.level}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                level: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Beginner">
                                                Beginner
                                            </SelectItem>
                                            <SelectItem value="Intermediate">
                                                Intermediate
                                            </SelectItem>
                                            <SelectItem value="Advanced">
                                                Advanced
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="duration">
                                        Duration (months)
                                    </Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                duration: parseInt(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                        placeholder="Duration"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="fee">Course Fee (₹)</Label>
                                    <Input
                                        id="fee"
                                        type="number"
                                        value={formData.fee}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                fee: parseInt(e.target.value),
                                            }))
                                        }
                                        placeholder="Course fee"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="maxStudents">
                                        Max Students
                                    </Label>
                                    <Input
                                        id="maxStudents"
                                        type="number"
                                        value={formData.maxStudents}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                maxStudents: parseInt(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                        placeholder="Max students"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="teacherId">
                                        Assign Teacher
                                    </Label>
                                    <Select
                                        value={formData.teacherId}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                teacherId: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select teacher" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {teachers.map((teacher) => (
                                                <SelectItem
                                                    key={teacher._id}
                                                    value={teacher._id}
                                                >
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                startDate: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                endDate: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateCourse}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Create Course
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Courses
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {courses.length}
                                </p>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Active Courses
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {courses.filter((c) => c.isActive).length}
                                </p>
                            </div>
                            <Award className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Students
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {courses.reduce(
                                        (sum, course) =>
                                            sum + course.currentStudents,
                                        0
                                    )}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(
                                        courses.reduce(
                                            (sum, course) =>
                                                sum +
                                                course.fee *
                                                    course.currentStudents,
                                            0
                                        )
                                    )}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                <SelectItem value="jee">JEE</SelectItem>
                                <SelectItem value="neet">NEET</SelectItem>
                                <SelectItem value="board">Board</SelectItem>
                                <SelectItem value="foundation">
                                    Foundation
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Courses Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        All Courses ({filteredCourses.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Teacher</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead>Fee</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course._id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {course.title}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {course.subject}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getCategoryBadgeColor(
                                                    course.category
                                                )}
                                            >
                                                {course.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getLevelBadgeColor(
                                                    course.level
                                                )}
                                            >
                                                {course.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {course.teacher.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span>
                                                    {course.currentStudents}/
                                                    {course.maxStudents}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(course.fee)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span>
                                                    {course.duration} months
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    course.isActive
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {course.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminCourseManagement;
