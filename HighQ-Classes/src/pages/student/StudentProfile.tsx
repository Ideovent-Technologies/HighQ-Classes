import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Users,
    BookOpen,
    Clock,
    Target,
    Camera,
    Edit,
    Save,
    X,
    Upload,
    AlertCircle,
    CheckCircle,
    Loader2,
    Lock,
} from "lucide-react";
import { StudentUser } from "@/types/student.types";
import { studentService } from "@/API/services/studentService";

const StudentProfile: React.FC = () => {
    const { state, updateProfile: authUpdateProfile } = useAuth();
    // Safe type conversion for student user
    const user =
        state.user && state.user.role === "student"
            ? (state.user as unknown as StudentUser)
            : null;
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<Partial<StudentUser>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
    const fetchProfile = async () => {
        if (!user?._id) return;

        try {
            const profile = await studentService.getProfile(user._id);
            console.log("Full Profile Data:", profile);
            console.log("Enrolled Courses:", profile.enrolledCourses);
            console.log("Batch Info:", profile.batch);

            // Optionally set this to state if you want to use it in UI
            setProfileData(profile);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    fetchProfile();
}, []);


    const showMessage = (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleProfileUpdate = async () => {
        if (!user?._id) return;

        setIsLoading(true);
        try {
            const updatedUser = await studentService.updateProfile(user._id, {
                email: profileData.email,
                phone: profileData.mobile,
                address: profileData.address?.street,
                dateOfBirth: profileData.dateOfBirth,
                emergencyContact: profileData.parentContact,
            });

            // Update auth context with new user data
            await authUpdateProfile({
                name: updatedUser.name,
                mobile: updatedUser.mobile,
            });
            setIsEditing(false);
            showMessage("success", "Profile updated successfully!");
        } catch (error: any) {
            showMessage("error", error.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!user?._id) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage("error", "New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage("error", "Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);
        try {
            await studentService.changePassword(user._id, passwordData);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setShowPasswordChange(false);
            showMessage("success", "Password changed successfully!");
        } catch (error: any) {
            showMessage("error", error.message || "Failed to change password");
        } finally {
            setIsLoading(false);
        }
    };


    const handleProfilePictureUpload = async (file: File) => {
        if (!user?._id) return;

        // Validate file type and size
        if (!file.type.startsWith("image/")) {
            showMessage("error", "Please select a valid image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            showMessage("error", "Image size should be less than 5MB");
            return;
        }

        setUploadingPicture(true);
        try {
            const updatedUser = await studentService.uploadProfilePicture(
                user._id,
                file
            );
            // Update local profile data
            setProfileData((prev) => ({
                ...prev,
                profilePicture: updatedUser.profilePicture,
            }));
            showMessage("success", "Profile picture updated successfully!");
        } catch (error: any) {
            showMessage(
                "error",
                error.message || "Failed to upload profile picture"
            );
        } finally {
            setUploadingPicture(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleProfilePictureUpload(file);
        }
    };

    const handleCancel = () => {
        setProfileData(user || {});
        setIsEditing(false);
    };

    const handleInputChange = (
        field: string,
        value: string | number | object
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

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Card className="p-6">
                    <CardContent>
                        <div className="text-center">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Please Login
                            </h3>
                            <p className="text-gray-600">
                                You need to be logged in as a student to view
                                your profile.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Student Profile
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your personal information and academic details
                    </p>
                </div>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <Button
                                onClick={handleProfileUpdate}
                                disabled={isLoading}
                            >
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
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
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
                                <Badge
                                    variant={
                                        user.status === "active"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {user.status?.toUpperCase()}
                                </Badge>
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

                    {/* Family Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Family Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="parentName">
                                        Parent/Guardian Name
                                    </Label>
                                    <Input
                                        id="parentName"
                                        value={profileData.parentName || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "parentName",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="parentContact">
                                        Parent Contact
                                    </Label>
                                    <Input
                                        id="parentContact"
                                        value={profileData.parentContact || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "parentContact",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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

                {/* Academic Information Tab */}
                <TabsContent value="academic" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* School Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <GraduationCap className="mr-2 h-5 w-5" />
                                    School Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="grade">Current Grade</Label>
                                    <Input
                                        id="grade"
                                        value={profileData.grade || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "grade",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="schoolName">
                                        School Name
                                    </Label>
                                    <Input
                                        id="schoolName"
                                        value={profileData.schoolName || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "schoolName",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>
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
                            </CardContent>
                        </Card>

                        {/* Batch & Course Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Batch & Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.batch && (
                                    <div>
                                        <Label>Current Batch</Label>
                                        <p className="font-medium">
                                            {user.batch.name}
                                        </p>
                                        {user.batch.startDate &&
                                            user.batch.endDate && (
                                                <p className="text-sm text-gray-600">
                                                    {new Date(
                                                        user.batch.startDate
                                                    ).toLocaleDateString()}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        user.batch.endDate
                                                    ).toLocaleDateString()}
                                                </p>
                                            )}
                                    </div>
                                )}
                                <Separator />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {user.totalCourses || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Total Courses
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">
                                            {user.activeCourses || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Active Courses
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enrolled Courses */}
                    {user.enrolledCourses &&
                        user.enrolledCourses.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enrolled Courses</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {user.enrolledCourses.map(
                                            (course, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 border rounded-lg"
                                                >
                                                    <div>
                                                        <h4 className="font-medium">
                                                            {course.courseName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">
                                                            Enrolled:{" "}
                                                            {new Date(
                                                                course.enrollmentDate
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            course.status ===
                                                            "active"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {course.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance" className="space-y-6">
                    {user.attendance && (
                        <>
                            {/* Attendance Overview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Clock className="mr-2 h-5 w-5" />
                                        Attendance Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                                {user.attendance.percentage}%
                                            </div>
                                            <p className="text-gray-600">
                                                Attendance Rate
                                            </p>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${user.attendance.percentage}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">
                                                {
                                                    user.attendance
                                                        .attendedClasses
                                                }
                                            </div>
                                            <p className="text-gray-600">
                                                Classes Attended
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-gray-600 mb-2">
                                                {user.attendance.totalClasses}
                                            </div>
                                            <p className="text-gray-600">
                                                Total Classes
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Attendance Records */}
                            {user.attendance.records &&
                                user.attendance.records.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Recent Attendance
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                {user.attendance.records
                                                    .slice(0, 10)
                                                    .map((record, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 border rounded-lg"
                                                        >
                                                            <div>
                                                                <p className="font-medium">
                                                                    {new Date(
                                                                        record.date
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                                {record.subject && (
                                                                    <p className="text-sm text-gray-600">
                                                                        {
                                                                            record.subject
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    record.status ===
                                                                    "present"
                                                                        ? "default"
                                                                        : record.status ===
                                                                          "late"
                                                                        ? "secondary"
                                                                        : "destructive"
                                                                }
                                                            >
                                                                {record.status.toUpperCase()}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                        </>
                    )}
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Target className="mr-2 h-5 w-5" />
                                Notification Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-gray-600">
                                            Receive updates via email
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            profileData.preferences
                                                ?.notifications?.email || false
                                        }
                                        onChange={(e) =>
                                            handleInputChange("preferences", {
                                                ...profileData.preferences,
                                                notifications: {
                                                    ...profileData.preferences
                                                        ?.notifications,
                                                    email: e.target.checked,
                                                },
                                            })
                                        }
                                        disabled={!isEditing}
                                        className="toggle"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>SMS Notifications</Label>
                                        <p className="text-sm text-gray-600">
                                            Receive updates via SMS
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            profileData.preferences
                                                ?.notifications?.sms || false
                                        }
                                        onChange={(e) =>
                                            handleInputChange("preferences", {
                                                ...profileData.preferences,
                                                notifications: {
                                                    ...profileData.preferences
                                                        ?.notifications,
                                                    sms: e.target.checked,
                                                },
                                            })
                                        }
                                        disabled={!isEditing}
                                        className="toggle"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Push Notifications</Label>
                                        <p className="text-sm text-gray-600">
                                            Receive browser notifications
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={
                                            profileData.preferences
                                                ?.notifications?.push || false
                                        }
                                        onChange={(e) =>
                                            handleInputChange("preferences", {
                                                ...profileData.preferences,
                                                notifications: {
                                                    ...profileData.preferences
                                                        ?.notifications,
                                                    push: e.target.checked,
                                                },
                                            })
                                        }
                                        disabled={!isEditing}
                                        className="toggle"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Display Preferences</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="theme">Theme</Label>
                                    <select
                                        id="theme"
                                        value={
                                            profileData.preferences?.theme ||
                                            "light"
                                        }
                                        onChange={(e) =>
                                            handleInputChange("preferences", {
                                                ...profileData.preferences,
                                                theme: e.target.value,
                                            })
                                        }
                                        disabled={!isEditing}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="language">Language</Label>
                                    <select
                                        id="language"
                                        value={
                                            profileData.preferences?.language ||
                                            "en"
                                        }
                                        onChange={(e) =>
                                            handleInputChange("preferences", {
                                                ...profileData.preferences,
                                                language: e.target.value,
                                            })
                                        }
                                        disabled={!isEditing}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default StudentProfile;
