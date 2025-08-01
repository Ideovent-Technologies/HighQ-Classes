import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminService from "@/API/services/AdminService";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Users,
    BookOpen,
    Building,
    Camera,
    Edit,
    Save,
    X,
    IdCard,
    Settings,
    BarChart3,
    UserCheck,
} from "lucide-react";
import { AdminUser } from "@/types/admin.types";

const AdminProfile: React.FC = () => {
    const { state } = useAuth();
    const user = state.user as AdminUser;
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<Partial<AdminUser>>({});
    const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
    async function fetchProfile() {
        setIsLoading(true);
        try {
            const response = await AdminService.getAdminProfile();
            if (response.success && response.admin) {
                setProfileData(response.admin);
                console.log(response.admin)
            } else {
                console.error("Failed to fetch admin profile:", response.message);
            }
        } catch (error) {
            console.error("Unexpected error while fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    }

    fetchProfile();
}, []);


    const handleCancel = () => {
        setProfileData(user);
        setIsEditing(false);
    };

    const handleInputChange = (
        field: string,
        value: string | number | string[]
    ) => {
        setProfileData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddressChange = (field: string, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }));
    };

    const handlePermissionsChange = (permissions: string) => {
        const permissionArray = permissions
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
        handleInputChange("permissions", permissionArray);
    };

    const handleManagedDepartmentsChange = (departments: string) => {
        const departmentArray = departments
            .split(",")
            .map((d) => d.trim())
            .filter((d) => d.length > 0);
        handleInputChange("managedDepartments", departmentArray);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Profile
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your administrative information and system access
                    </p>
                </div>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} disabled={isLoading}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="administrative">
                        Administrative
                    </TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="system">System Overview</TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Picture Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Camera className="mr-2 h-5 w-5" />
                                    Profile Picture
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-4">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage
                                        src={profileData.profilePicture}
                                        alt={profileData.name}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {profileData.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <Button variant="outline" size="sm">
                                        <Camera className="mr-2 h-4 w-4" />
                                        Change Photo
                                    </Button>
                                )}
                                <div className="flex flex-col items-center space-y-2">
                                    <Badge
                                        variant={
                                            user.status === "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {user.status?.toUpperCase()}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="text-red-600 border-red-600"
                                    >
                                        <Shield className="mr-1 h-3 w-3" />
                                        ADMIN
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="employeeId">
                                            Employee ID
                                        </Label>
                                        <Input
                                            id="employeeId"
                                            value={profileData.employeeId || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "employeeId",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="mobile">
                                            Mobile Number
                                        </Label>
                                        <Input
                                            id="mobile"
                                            value={profileData.mobile || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "mobile",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <select
                                            id="gender"
                                            value={profileData.gender || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "gender",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">
                                                Select Gender
                                            </option>
                                            <option value="male">Male</option>
                                            <option value="female">
                                                Female
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="dateOfBirth">
                                            Date of Birth
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={
                                                profileData.dateOfBirth || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "dateOfBirth",
                                                    e.target.value
                                                )
                                            }
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5" />
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="street">
                                        Street Address
                                    </Label>
                                    <Input
                                        id="street"
                                        value={
                                            profileData.address?.street || ""
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "street",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={profileData.address?.city || ""}
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        value={profileData.address?.state || ""}
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "state",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="zipCode">ZIP Code</Label>
                                    <Input
                                        id="zipCode"
                                        value={
                                            profileData.address?.zipCode || ""
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "zipCode",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={
                                            profileData.address?.country || ""
                                        }
                                        onChange={(e) =>
                                            handleAddressChange(
                                                "country",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Administrative Information Tab */}
                <TabsContent value="administrative" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Role & Department */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Building className="mr-2 h-5 w-5" />
                                    Role & Department
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="designation">
                                        Designation
                                    </Label>
                                    <Input
                                        id="designation"
                                        value={profileData.designation || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "designation",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="e.g., System Administrator"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="department">
                                        Department
                                    </Label>
                                    <select
                                        id="department"
                                        value={profileData.department || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "department",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">
                                            Select Department
                                        </option>
                                        <option value="IT">
                                            Information Technology
                                        </option>
                                        <option value="Administration">
                                            Administration
                                        </option>
                                        <option value="Academic">
                                            Academic Affairs
                                        </option>
                                        <option value="Finance">Finance</option>
                                        <option value="HR">
                                            Human Resources
                                        </option>
                                        <option value="Operations">
                                            Operations
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="accessLevel">
                                        Access Level
                                    </Label>
                                    <select
                                        id="accessLevel"
                                        value={profileData.accessLevel || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "accessLevel",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        disabled={!isEditing}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">
                                            Select Access Level
                                        </option>
                                        <option value="1">
                                            Level 1 - Basic Admin
                                        </option>
                                        <option value="2">
                                            Level 2 - Departmental Admin
                                        </option>
                                        <option value="3">
                                            Level 3 - Senior Admin
                                        </option>
                                        <option value="4">
                                            Level 4 - Super Admin
                                        </option>
                                        <option value="5">
                                            Level 5 - System Admin
                                        </option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Join Date</Label>
                                    <p className="text-sm text-gray-600">
                                        {user.joinDate
                                            ? new Date(
                                                  user.joinDate
                                              ).toLocaleDateString()
                                            : "Not available"}
                                    </p>
                                </div>
                                <div>
                                    <Label>Last Login</Label>
                                    <p className="text-sm text-gray-600">
                                        {user.lastLogin
                                            ? new Date(
                                                  user.lastLogin
                                              ).toLocaleDateString()
                                            : "Never"}
                                    </p>
                                </div>
                                <div>
                                    <Label>Account Created</Label>
                                    <p className="text-sm text-gray-600">
                                        {user.createdAt
                                            ? new Date(
                                                  user.createdAt
                                              ).toLocaleDateString()
                                            : "Not available"}
                                    </p>
                                </div>
                                <div>
                                    <Label>Email Verified</Label>
                                    <Badge
                                        variant={
                                            user.emailVerified
                                                ? "default"
                                                : "destructive"
                                        }
                                    >
                                        {user.emailVerified
                                            ? "Verified"
                                            : "Not Verified"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Managed Departments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Building className="mr-2 h-5 w-5" />
                                Managed Departments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="managedDepartments">
                                    Departments (comma-separated)
                                </Label>
                                <Input
                                    id="managedDepartments"
                                    value={
                                        profileData.managedDepartments?.join(
                                            ", "
                                        ) || ""
                                    }
                                    onChange={(e) =>
                                        handleManagedDepartmentsChange(
                                            e.target.value
                                        )
                                    }
                                    disabled={!isEditing}
                                    placeholder="e.g., IT, Academic, Finance"
                                />
                                {profileData.managedDepartments &&
                                    profileData.managedDepartments.length >
                                        0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {profileData.managedDepartments.map(
                                                (dept, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                    >
                                                        {dept}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                System Permissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="permissions">
                                    Permissions (comma-separated)
                                </Label>
                                <Input
                                    id="permissions"
                                    value={
                                        profileData.permissions?.join(", ") ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        handlePermissionsChange(e.target.value)
                                    }
                                    disabled={!isEditing}
                                    placeholder="e.g., user_management, course_management, system_settings"
                                />
                                {profileData.permissions &&
                                    profileData.permissions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {profileData.permissions.map(
                                                (permission, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="text-blue-600 border-blue-600"
                                                    >
                                                        <Shield className="mr-1 h-3 w-3" />
                                                        {permission}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Access Level Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Settings className="mr-2 h-5 w-5" />
                                Access Level Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Current Access Level</span>
                                    <Badge
                                        variant="default"
                                        className="text-lg px-4 py-2"
                                    >
                                        Level {user.accessLevel || 1}
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium">
                                            System Access
                                        </h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>✓ User Management</li>
                                            <li>✓ Course Management</li>
                                            <li>✓ Batch Management</li>
                                            <li>✓ Fee Management</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium">
                                            Administrative Access
                                        </h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>✓ System Settings</li>
                                            <li>✓ Reports & Analytics</li>
                                            <li>✓ User Roles</li>
                                            <li>✓ System Logs</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Overview Tab */}
                <TabsContent value="system" className="space-y-6">
                    {user.systemStats && (
                        <>
                            {/* System Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                                        <div className="text-2xl font-bold text-blue-600">
                                            {user.systemStats.totalStudents}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Students
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <UserCheck className="mx-auto h-8 w-8 text-green-600 mb-2" />
                                        <div className="text-2xl font-bold text-green-600">
                                            {user.systemStats.totalTeachers}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Teachers
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <BookOpen className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                                        <div className="text-2xl font-bold text-purple-600">
                                            {user.systemStats.totalCourses}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Courses
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Building className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                                        <div className="text-2xl font-bold text-orange-600">
                                            {user.systemStats.totalBatches}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Batches
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <BarChart3 className="mx-auto h-8 w-8 text-teal-600 mb-2" />
                                        <div className="text-2xl font-bold text-teal-600">
                                            {user.systemStats.activeUsers}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Active Users
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Shield className="mx-auto h-8 w-8 text-red-600 mb-2" />
                                        <div className="text-2xl font-bold text-red-600">
                                            {user.systemStats.pendingApprovals}
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Pending
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="mr-2 h-5 w-5" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-20 flex flex-col"
                                        >
                                            <Users className="h-6 w-6 mb-2" />
                                            Manage Users
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-20 flex flex-col"
                                        >
                                            <BookOpen className="h-6 w-6 mb-2" />
                                            Courses
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-20 flex flex-col"
                                        >
                                            <BarChart3 className="h-6 w-6 mb-2" />
                                            Reports
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-20 flex flex-col"
                                        >
                                            <Settings className="h-6 w-6 mb-2" />
                                            Settings
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminProfile;
