import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    Users,
    Plus,
    Edit3,
    Trash2,
    Eye,
    Search,
    Filter,
    BookOpen,
    User,
    Loader2,
} from "lucide-react";
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
import AdminService from "@/API/services/AdminService";
import { useToast } from "@/hooks/use-toast";

interface Schedule {
    _id: string;
    title: string;
    subject: string;
    teacher: {
        _id: string;
        name: string;
    };
    batch: {
        _id: string;
        name: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    type: "lecture" | "lab" | "test" | "assignment";
    isActive: boolean;
    createdAt: string;
}

interface ScheduleFormData {
    title: string;
    subject: string;
    teacherId: string;
    batchId: string;
    date: string;
    startTime: string;
    endTime: string;
    type: "lecture" | "lab" | "test" | "assignment";
}

const ScheduleManagement: React.FC = () => {
    const { toast } = useToast();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const [formData, setFormData] = useState<ScheduleFormData>({
        title: "",
        subject: "",
        teacherId: "",
        batchId: "",
        date: "",
        startTime: "",
        endTime: "",
        type: "lecture",
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // TODO: Replace with actual schedule API when available
            // For now, create mock schedules using real teachers
            const teachersResponse = await AdminService.getAllTeachers();
            if (teachersResponse.success && teachersResponse.teachers) {
                setTeachers(teachersResponse.teachers);

                // Create mock schedules with real teacher data
                const mockSchedules: Schedule[] = teachersResponse.teachers
                    .slice(0, 5)
                    .map((teacher: any, index: number) => ({
                        _id: `schedule_${index + 1}`,
                        title: `Mathematics Class ${index + 1}`,
                        subject:
                            [
                                "Mathematics",
                                "Physics",
                                "Chemistry",
                                "Biology",
                                "English",
                            ][index] || "Mathematics",
                        teacher: {
                            _id: teacher._id,
                            name: teacher.name,
                        },
                        batch: {
                            _id: `batch_${index + 1}`,
                            name: `Batch ${String.fromCharCode(65 + index)}`,
                        },
                        date: new Date(Date.now() + index * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0],
                        startTime: `${9 + index}:00`,
                        endTime: `${10 + index}:00`,
                        duration: 60,
                        type: ["lecture", "lab", "test", "assignment"][
                            index % 4
                        ] as any,
                        isActive: true,
                        createdAt: new Date().toISOString(),
                    }));

                setSchedules(mockSchedules);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch schedule data",
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
            // TODO: Implement schedule creation API
            const newSchedule: Schedule = {
                _id: `schedule_${schedules.length + 1}`,
                title: formData.title,
                subject: formData.subject,
                teacher: teachers.find((t) => t._id === formData.teacherId) || {
                    _id: formData.teacherId,
                    name: "Unknown Teacher",
                },
                batch: { _id: formData.batchId, name: "Selected Batch" },
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                duration: 60,
                type: formData.type,
                isActive: true,
                createdAt: new Date().toISOString(),
            };

            setSchedules([...schedules, newSchedule]);

            toast({
                title: "Success",
                description: "Schedule created successfully!",
            });

            // Reset form
            setFormData({
                title: "",
                subject: "",
                teacherId: "",
                batchId: "",
                date: "",
                startTime: "",
                endTime: "",
                type: "lecture",
            });

            setIsDialogOpen(false);
        } catch (error: any) {
            console.error("Failed to create schedule:", error);
            toast({
                title: "Error",
                description: "Failed to create schedule",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSchedules = schedules.filter((schedule) => {
        const matchesSearch =
            schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            schedule.teacher.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesType =
            typeFilter === "all" || schedule.type === typeFilter;

        return matchesSearch && matchesType;
    });

    const getTypeBadge = (type: string) => {
        const colors = {
            lecture: "bg-blue-100 text-blue-800",
            lab: "bg-green-100 text-green-800",
            test: "bg-red-100 text-red-800",
            assignment: "bg-purple-100 text-purple-800",
        };
        return (
            <Badge
                className={
                    colors[type as keyof typeof colors] ||
                    "bg-gray-100 text-gray-800"
                }
            >
                {type}
            </Badge>
        );
    };

    const todaySchedules = schedules.filter(
        (s) => s.date === new Date().toISOString().split("T")[0]
    );
    const upcomingSchedules = schedules.filter(
        (s) => new Date(s.date) > new Date()
    );

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-indigo-600" />
                        Schedule Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage class schedules, lectures, and activities
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Schedule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Create New Schedule
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
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
                                        placeholder="Enter schedule title"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                subject: e.target.value,
                                            })
                                        }
                                        placeholder="Enter subject"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="teacher">Teacher</Label>
                                    <Select
                                        value={formData.teacherId}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                teacherId: value,
                                            })
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
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(
                                            value:
                                                | "lecture"
                                                | "lab"
                                                | "test"
                                                | "assignment"
                                        ) =>
                                            setFormData({
                                                ...formData,
                                                type: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lecture">
                                                Lecture
                                            </SelectItem>
                                            <SelectItem value="lab">
                                                Lab
                                            </SelectItem>
                                            <SelectItem value="test">
                                                Test
                                            </SelectItem>
                                            <SelectItem value="assignment">
                                                Assignment
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                date: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">
                                        Start Time
                                    </Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                startTime: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                endTime: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
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
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Create Schedule
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </motion.div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100">
                                    Total Schedules
                                </p>
                                <p className="text-2xl font-bold">
                                    {schedules.length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-indigo-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">
                                    Today's Classes
                                </p>
                                <p className="text-2xl font-bold">
                                    {todaySchedules.length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Upcoming</p>
                                <p className="text-2xl font-bold">
                                    {upcomingSchedules.length}
                                </p>
                            </div>
                            <BookOpen className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">
                                    Active Teachers
                                </p>
                                <p className="text-2xl font-bold">
                                    {teachers.length}
                                </p>
                            </div>
                            <User className="h-8 w-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search schedules..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="lecture">
                                    Lectures
                                </SelectItem>
                                <SelectItem value="lab">Labs</SelectItem>
                                <SelectItem value="test">Tests</SelectItem>
                                <SelectItem value="assignment">
                                    Assignments
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Schedules List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        All Schedules ({filteredSchedules.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        </div>
                    ) : filteredSchedules.length === 0 ? (
                        <div className="text-center p-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No schedules found
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || typeFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "Create your first schedule to get started"}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Title
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Subject
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Teacher
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Batch
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Date
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Time
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Type
                                        </th>
                                        <th className="py-3 px-4 text-center font-medium text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchedules.map((schedule) => (
                                        <tr
                                            key={schedule._id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4 font-medium">
                                                {schedule.title}
                                            </td>
                                            <td className="py-4 px-4">
                                                {schedule.subject}
                                            </td>
                                            <td className="py-4 px-4">
                                                {schedule.teacher.name}
                                            </td>
                                            <td className="py-4 px-4">
                                                {schedule.batch.name}
                                            </td>
                                            <td className="py-4 px-4">
                                                {new Date(
                                                    schedule.date
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                {schedule.startTime} -{" "}
                                                {schedule.endTime}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getTypeBadge(schedule.type)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ScheduleManagement;
