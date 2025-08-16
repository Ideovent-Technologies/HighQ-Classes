import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Edit3,
    Trash2,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Award,
    Shield,
    Eye,
    Download,
    Loader2,
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
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: "student" | "teacher" | "admin";
    isActive: boolean;
    createdAt: Date;
    lastLogin?: Date;
}

const AdminUserManagement: React.FC = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        mobile: "",
        role: "student" as "student" | "teacher" | "admin",
        password: "",
        // Student specific fields
        parentName: "",
        parentContact: "",
        grade: "",
        schoolName: "",
        // Teacher specific fields
        employeeId: "",
        qualification: "",
        experience: 0,
        specialization: "",
        department: "",
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([fetchStudents(), fetchTeachers()]);
        setLoading(false);
    };

    const fetchStudents = async () => {
        try {
            const response = await AdminService.getAllStudents();
            if (response.success && response.students) {
                setStudents(response.students);
                // Convert students to User format for the combined list
                const studentUsers: User[] = response.students.map(
                    (student) => ({
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        phone: student.mobile || "",
                        role: "student" as const,
                        isActive: true, // Assume active if not specified
                        createdAt: new Date(student.createdAt || Date.now()),
                        lastLogin: student.lastLogin
                            ? new Date(student.lastLogin)
                            : undefined,
                    })
                );
                setUsers((prev) => [
                    ...prev.filter((u) => u.role !== "student"),
                    ...studentUsers,
                ]);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({
                title: "Error",
                description: "Failed to fetch students",
                variant: "destructive",
            });
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await AdminService.getAllTeachers();
            if (response.success && response.teachers) {
                setTeachers(response.teachers);
                // Convert teachers to User format for the combined list
                const teacherUsers: User[] = response.teachers.map(
                    (teacher) => ({
                        _id: teacher._id,
                        name: teacher.name,
                        email: teacher.email,
                        phone: teacher.mobile || "",
                        role: "teacher" as const,
                        isActive: true, // Assume active if not specified
                        createdAt: new Date(teacher.createdAt || Date.now()),
                        lastLogin: teacher.lastLogin
                            ? new Date(teacher.lastLogin)
                            : undefined,
                    })
                );
                setUsers((prev) => [
                    ...prev.filter((u) => u.role !== "teacher"),
                    ...teacherUsers,
                ]);
            }
        } catch (error) {
            console.error("Error fetching teachers:", error);
            toast({
                title: "Error",
                description: "Failed to fetch teachers",
                variant: "destructive",
            });
        }
    };

    const handleCreateUser = async () => {
        try {
            // Only allow creating students and teachers through the user creation endpoint
            if (newUser.role === "admin") {
                toast({
                    title: "Error",
                    description:
                        "Admin users cannot be created through this interface",
                    variant: "destructive",
                });
                return;
            }

            // Prepare user data based on role
            const userData = {
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                mobile: newUser.mobile,
                role: newUser.role as "student" | "teacher",
                ...(newUser.role === "student" && {
                    parentName: newUser.parentName,
                    parentContact: newUser.parentContact,
                    grade: newUser.grade,
                    schoolName: newUser.schoolName,
                }),
                ...(newUser.role === "teacher" && {
                    employeeId: newUser.employeeId,
                    qualification: newUser.qualification,
                    experience: newUser.experience,
                    specialization: newUser.specialization,
                    department: newUser.department,
                }),
            };

            const response = await AdminService.createUser(userData);
            if (response.success) {
                toast({
                    title: "Success!",
                    description: "User created successfully",
                });
                setIsCreateDialogOpen(false);
                setNewUser({
                    name: "",
                    email: "",
                    phone: "",
                    mobile: "",
                    role: "student",
                    password: "",
                    // Student specific fields
                    parentName: "",
                    parentContact: "",
                    grade: "",
                    schoolName: "",
                    // Teacher specific fields
                    employeeId: "",
                    qualification: "",
                    experience: 0,
                    specialization: "",
                    department: "",
                });
                fetchAllData(); // Refresh all data
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to create user",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin":
                return "bg-red-100 text-red-800";
            case "teacher":
                return "bg-blue-100 text-blue-800";
            case "student":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
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
                <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage students, teachers, and admin accounts
                    </p>
                </div>

                <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    value={newUser.phone}
                                    onChange={(e) =>
                                        setNewUser((prev) => ({
                                            ...prev,
                                            phone: e.target.value,
                                            mobile: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">Role *</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value) =>
                                        setNewUser((prev) => ({
                                            ...prev,
                                            role: value as
                                                | "student"
                                                | "teacher"
                                                | "admin",
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">
                                            Student
                                        </SelectItem>
                                        <SelectItem value="teacher">
                                            Teacher
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            Admin
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser((prev) => ({
                                            ...prev,
                                            password: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter password"
                                />
                            </div>

                            {/* Student specific fields */}
                            {newUser.role === "student" && (
                                <>
                                    <div>
                                        <Label htmlFor="parentName">
                                            Parent Name *
                                        </Label>
                                        <Input
                                            id="parentName"
                                            value={newUser.parentName}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    parentName: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter parent's full name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="parentContact">
                                            Parent Contact *
                                        </Label>
                                        <Input
                                            id="parentContact"
                                            value={newUser.parentContact}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    parentContact:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Enter parent's contact number"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="grade">Grade *</Label>
                                        <Input
                                            id="grade"
                                            value={newUser.grade}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    grade: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter grade (e.g., 10th, 12th)"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="schoolName">
                                            School Name *
                                        </Label>
                                        <Input
                                            id="schoolName"
                                            value={newUser.schoolName}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    schoolName: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter school name"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Teacher specific fields */}
                            {newUser.role === "teacher" && (
                                <>
                                    <div>
                                        <Label htmlFor="employeeId">
                                            Employee ID *
                                        </Label>
                                        <Input
                                            id="employeeId"
                                            value={newUser.employeeId}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    employeeId: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter employee ID"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="qualification">
                                            Qualification *
                                        </Label>
                                        <Input
                                            id="qualification"
                                            value={newUser.qualification}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    qualification:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Enter qualification (e.g., B.Tech, M.Sc)"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="experience">
                                            Experience (Years) *
                                        </Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            value={newUser.experience}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    experience:
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0,
                                                }))
                                            }
                                            placeholder="Enter years of experience"
                                            min="0"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="specialization">
                                            Specialization *
                                        </Label>
                                        <Input
                                            id="specialization"
                                            value={newUser.specialization}
                                            onChange={(e) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    specialization:
                                                        e.target.value,
                                                }))
                                            }
                                            placeholder="Enter specialization"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="department">
                                            Department *
                                        </Label>
                                        <Select
                                            value={newUser.department}
                                            onValueChange={(value) =>
                                                setNewUser((prev) => ({
                                                    ...prev,
                                                    department: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Mathematics">
                                                    Mathematics
                                                </SelectItem>
                                                <SelectItem value="Science">
                                                    Science
                                                </SelectItem>
                                                <SelectItem value="English">
                                                    English
                                                </SelectItem>
                                                <SelectItem value="Hindi">
                                                    Hindi
                                                </SelectItem>
                                                <SelectItem value="Social Science">
                                                    Social Science
                                                </SelectItem>
                                                <SelectItem value="Computer Science">
                                                    Computer Science
                                                </SelectItem>
                                                <SelectItem value="Physics">
                                                    Physics
                                                </SelectItem>
                                                <SelectItem value="Chemistry">
                                                    Chemistry
                                                </SelectItem>
                                                <SelectItem value="Biology">
                                                    Biology
                                                </SelectItem>
                                                <SelectItem value="Other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateUser}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Create User
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
                                    Total Users
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.length}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Students
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {
                                        users.filter(
                                            (u) => u.role === "student"
                                        ).length
                                    }
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
                                    Teachers
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {
                                        users.filter(
                                            (u) => u.role === "teacher"
                                        ).length
                                    }
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Admins
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {
                                        users.filter((u) => u.role === "admin")
                                            .length
                                    }
                                </p>
                            </div>
                            <Shield className="h-8 w-8 text-red-600" />
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
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-[180px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="student">
                                    Students
                                </SelectItem>
                                <SelectItem value="teacher">
                                    Teachers
                                </SelectItem>
                                <SelectItem value="admin">Admins</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                {user.phone}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getRoleBadgeColor(
                                                    user.role
                                                )}
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.isActive
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {user.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.lastLogin
                                                ? formatDate(user.lastLogin)
                                                : "Never"}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(user.createdAt)}
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

export default AdminUserManagement;
