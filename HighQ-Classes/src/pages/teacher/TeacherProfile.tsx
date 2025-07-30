import React, { useState, useEffect } from "react";
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
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    GraduationCap,
    Users,
    BookOpen,
    Award,
    Building,
    Camera,
    Edit,
    Save,
    X,
    IdCard,
} from "lucide-react";
import { TeacherUser } from "@/types/teacher.types";

const TeacherProfile: React.FC = () => {
    const { state } = useAuth();
    const user = state.user as TeacherUser;
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<Partial<TeacherUser>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData(user);
        }
    }, [user]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement API call to update profile
            // await authService.updateProfile(profileData);
            console.log("Saving profile:", profileData);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleSubjectsChange = (subjects: string) => {
        const subjectArray = subjects
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        handleInputChange("subjects", subjectArray);
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
                        Teacher Profile
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage your professional information and teaching
                        details
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
                    <TabsTrigger value="professional">Professional</TabsTrigger>
                    <TabsTrigger value="teaching">Teaching</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
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

                {/* Professional Information Tab */}
                <TabsContent value="professional" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Qualifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <GraduationCap className="mr-2 h-5 w-5" />
                                    Qualifications
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="qualification">
                                        Education
                                    </Label>
                                    <Input
                                        id="qualification"
                                        value={profileData.qualification || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "qualification",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="e.g., M.Sc Physics"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="specialization">
                                        Specialization
                                    </Label>
                                    <Input
                                        id="specialization"
                                        value={profileData.specialization || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "specialization",
                                                e.target.value
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="e.g., Quantum Physics"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="experience">
                                        Experience (Years)
                                    </Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        value={profileData.experience || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "experience",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        disabled={!isEditing}
                                        min="0"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Department & Role */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Building className="mr-2 h-5 w-5" />
                                    Department & Role
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                        <option value="Mathematics">
                                            Mathematics
                                        </option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Social Science">
                                            Social Science
                                        </option>
                                        <option value="Computer Science">
                                            Computer Science
                                        </option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">
                                            Chemistry
                                        </option>
                                        <option value="Biology">Biology</option>
                                        <option value="Other">Other</option>
                                    </select>
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Biography */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Biography
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="bio">Professional Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={profileData.bio || ""}
                                    onChange={(e) =>
                                        handleInputChange("bio", e.target.value)
                                    }
                                    disabled={!isEditing}
                                    placeholder="Tell us about your teaching philosophy, achievements, and interests..."
                                    className="min-h-[120px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Teaching Information Tab */}
                <TabsContent value="teaching" className="space-y-6">
                    {/* Subjects */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BookOpen className="mr-2 h-5 w-5" />
                                Teaching Subjects
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="subjects">
                                    Subjects (comma-separated)
                                </Label>
                                <Input
                                    id="subjects"
                                    value={
                                        profileData.subjects?.join(", ") || ""
                                    }
                                    onChange={(e) =>
                                        handleSubjectsChange(e.target.value)
                                    }
                                    disabled={!isEditing}
                                    placeholder="e.g., Physics, Mathematics, Chemistry"
                                />
                                {profileData.subjects &&
                                    profileData.subjects.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {profileData.subjects.map(
                                                (subject, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="secondary"
                                                    >
                                                        {subject}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned Batches */}
                    {user.batches && user.batches.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5" />
                                    Assigned Batches
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {user.batches.map((batch, index) => (
                                        <Card key={index} className="border">
                                            <CardContent className="p-4">
                                                <h4 className="font-semibold">
                                                    {batch.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {batch.subject}
                                                </p>
                                                <p className="text-sm text-blue-600 mt-1">
                                                    {batch.studentCount}{" "}
                                                    students
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Teaching Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5" />
                                    Students
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {user.performanceMetrics?.studentsCount ||
                                        0}
                                </div>
                                <p className="text-gray-600">Total Students</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Batches
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {user.performanceMetrics?.batchesCount ||
                                        user.batches?.length ||
                                        0}
                                </div>
                                <p className="text-gray-600">Active Batches</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Award className="mr-2 h-5 w-5" />
                                    Assignments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    {user.performanceMetrics
                                        ?.pendingAssignments || 0}
                                </div>
                                <p className="text-gray-600">Pending Reviews</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Experience Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Award className="mr-2 h-5 w-5" />
                                Experience Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Years of Teaching Experience</span>
                                    <Badge
                                        variant="default"
                                        className="text-lg px-4 py-2"
                                    >
                                        {user.experience} years
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span>Specialization</span>
                                    <span className="font-medium">
                                        {user.specialization}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Department</span>
                                    <span className="font-medium">
                                        {user.department}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Employee ID</span>
                                    <span className="font-medium">
                                        {user.employeeId}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TeacherProfile;
