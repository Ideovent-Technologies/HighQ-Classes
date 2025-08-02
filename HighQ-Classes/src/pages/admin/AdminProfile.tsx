// src/pages/admin/AdminProfile.tsx

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminService from "@/API/services/AdminService";
import { AdminUser } from "@/types/admin.types";

// UI Components from shadcn/ui and lucide-react
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User, MapPin, Calendar, Shield, Users, BookOpen, Building, Camera, Edit, Save, X, Settings, BarChart3, UserCheck, Loader2
} from "lucide-react";

// Helper function to format date strings for input type="date"
const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    try {
        return new Date(dateString).toISOString().split('T')[0];
    } catch (error) {
        return "";
    }
};

const AdminProfile: React.FC = () => {
    const { state } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [isSaving, setIsSaving] = useState(false);
    
    const [profileData, setProfileData] = useState<Partial<AdminUser>>({});
    const [initialProfileData, setInitialProfileData] = useState<Partial<AdminUser>>({});

    useEffect(() => {
        async function fetchProfile() {
            if (state.user && state.user.role === 'admin') {
                try {
                    const response = await AdminService.getAdminProfile();
                    if (response.success && response.admin) {
                        setProfileData(response.admin);
                    } else {
                        console.error("Failed to fetch admin profile:", response.message);
                        // Fallback to auth context data if API fails
                        setProfileData(state.user as AdminUser);
                    }
                } catch (error) {
                    console.error("Unexpected error while fetching profile:", error);
                    setProfileData(state.user as AdminUser);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false); // Not an admin or no user
            }
        }
        
        fetchProfile();
    }, [state.user]);

    const handleEdit = () => {
        setInitialProfileData(profileData); // Save the current state before editing
        setIsEditing(true);
    };

    const handleCancel = () => {
        setProfileData(initialProfileData); // Restore the original state
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Uncomment the following line to make a real API call
            // const response = await AdminService.updateAdminProfile(profileData);
            
            // Simulating API call for demonstration
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = { success: true, admin: profileData, message: "Profile updated successfully!" };

            if (response.success) {
                setProfileData(response.admin ?? profileData);
                setIsEditing(false);
                // Here you would typically show a success toast/notification
                alert(response.message);
            } else {
                console.error("Failed to save profile:", response.message);
                alert(`Error: ${response.message}`);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("An unexpected error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof AdminUser, value: any) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field: keyof NonNullable<AdminUser['address']>, value: string) => {
        setProfileData((prev) => ({
            ...prev,
            address: { ...prev.address, [field]: value },
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!state.user || state.user.role !== "admin") {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
                <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your administrative information and system access.</p>
                </div>
                <div className="flex space-x-2">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleEdit}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="administrative">Administrative</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="system">System Overview</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="flex flex-col items-center justify-center p-6">
                            <Avatar className="h-32 w-32 border-4 border-primary/20">
                                <AvatarImage src={profileData.profilePicture} alt={profileData.name} />
                                <AvatarFallback className="text-4xl">
                                    {profileData.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <Button variant="outline" size="sm" className="mt-4">
                                    <Camera className="mr-2 h-4 w-4" /> Change Photo
                                </Button>
                            )}
                            <div className="flex flex-col items-center space-y-2 mt-4">
                                <Badge variant={profileData.status === "active" ? "default" : "secondary"}>
                                    {profileData.status?.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="text-primary border-primary">
                                    <Shield className="mr-1 h-3 w-3" /> ADMIN
                                </Badge>
                            </div>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center"><User className="mr-2 h-5 w-5" /> Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={profileData.name || ""} onChange={(e) => handleInputChange("name", e.target.value)} disabled={!isEditing} />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={profileData.email || ""} disabled // Email should not be editable
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="mobile">Mobile Number</Label>
                                    <Input id="mobile" value={profileData.mobile || ""} onChange={(e) => handleInputChange("mobile", e.target.value)} disabled={!isEditing} />
                                </div>
                                <div>
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select value={profileData.gender || ""} onValueChange={(value) => handleInputChange("gender", value)} disabled={!isEditing}>
                                        <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input id="dateOfBirth" type="date" value={formatDateForInput(profileData.dateOfBirth)} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} disabled={!isEditing} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5" /> Address Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input id="street" value={profileData.address?.street || ""} onChange={(e) => handleAddressChange("street", e.target.value)} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={profileData.address?.city || ""} onChange={(e) => handleAddressChange("city", e.target.value)} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="state">State / Province</Label>
                                <Input id="state" value={profileData.address?.state || ""} onChange={(e) => handleAddressChange("state", e.target.value)} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                                <Input id="zipCode" value={profileData.address?.zipCode || ""} onChange={(e) => handleAddressChange("zipCode", e.target.value)} disabled={!isEditing} />
                            </div>
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" value={profileData.address?.country || ""} onChange={(e) => handleAddressChange("country", e.target.value)} disabled={!isEditing} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Administrative Tab */}
                <TabsContent value="administrative" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5" /> Role & Department</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="employeeId">Employee ID</Label>
                                    <Input id="employeeId" value={profileData.employeeId || ""} disabled />
                                </div>
                                <div>
                                    <Label htmlFor="designation">Designation</Label>
                                    <Input id="designation" value={profileData.designation || ""} onChange={(e) => handleInputChange("designation", e.target.value)} disabled={!isEditing} />
                                </div>
                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Select value={profileData.department || ""} onValueChange={(value) => handleInputChange("department", value)} disabled={!isEditing}>
                                        <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="University Administration">University Administration</SelectItem>
                                            <SelectItem value="Admissions">Admissions</SelectItem>
                                            <SelectItem value="Academics">Academics</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="IT">Information Technology</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center"><Calendar className="mr-2 h-5 w-5" /> Account Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoField label="Join Date" value={profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : "N/A"} />
                                <InfoField label="Last Login" value={profileData.lastLogin ? new Date(profileData.lastLogin).toLocaleString() : "Never"} />
                                <InfoField label="Account Created" value={profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "N/A"} />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Email Verified</span>
                                    <Badge variant={profileData.emailVerified ? "default" : "destructive"}>
                                        {profileData.emailVerified ? "Verified" : "Not Verified"}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Shield className="mr-2 h-5 w-5" /> System Permissions & Roles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div>
                                <Label htmlFor="permissions">Permissions (comma-separated)</Label>
                                <Input
                                    id="permissions"
                                    value={(profileData.permissions || []).join(", ")}
                                    onChange={(e) => handleInputChange("permissions", e.target.value.split(',').map(p => p.trim()))}
                                    disabled={!isEditing}
                                    placeholder="e.g., user_management, course_management"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(profileData.permissions || []).map((permission) => (
                                        <Badge key={permission} variant="outline" className="text-primary border-primary">
                                            <Shield className="mr-1 h-3 w-3" /> {permission}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator/>
                            <div>
                                <Label htmlFor="managedDepartments">Managed Departments (comma-separated)</Label>
                                <Input
                                    id="managedDepartments"
                                    value={(profileData.managedDepartments || []).join(", ")}
                                    onChange={(e) => handleInputChange("managedDepartments", e.target.value.split(',').map(d => d.trim()))}
                                    disabled={!isEditing}
                                    placeholder="e.g., Admissions, Finance"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {(profileData.managedDepartments || []).map((dept) => (
                                        <Badge key={dept} variant="secondary">
                                            {dept}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* System Overview Tab */}
                <TabsContent value="system" className="space-y-6">
                    {profileData.systemStats ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <StatCard icon={Users} value={profileData.systemStats.totalStudents} label="Students" />
                            <StatCard icon={UserCheck} value={profileData.systemStats.totalTeachers} label="Teachers" color="text-green-600" />
                            <StatCard icon={BookOpen} value={profileData.systemStats.totalCourses} label="Courses" color="text-purple-600" />
                            <StatCard icon={Building} value={profileData.systemStats.totalBatches} label="Batches" color="text-orange-600" />
                            <StatCard icon={BarChart3} value={profileData.systemStats.activeUsers} label="Active Users" color="text-teal-600" />
                            <StatCard icon={Shield} value={profileData.systemStats.pendingApprovals} label="Pending" color="text-red-600" />
                        </div>
                    ) : (
                        <p>System statistics are not available.</p>
                    )}
                </TabsContent>

            </Tabs>
        </div>
    );
};

// Helper component for readable key-value info display
const InfoField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-900">{value}</span>
    </div>
);

// Helper component for statistics cards
const StatCard: React.FC<{ icon: React.ElementType; value: number; label: string; color?: string }> = ({ icon: Icon, value, label, color = "text-blue-600" }) => (
    <Card>
        <CardContent className="p-4 text-center">
            <Icon className={`mx-auto h-8 w-8 mb-2 ${color}`} />
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <p className="text-sm text-gray-600">{label}</p>
        </CardContent>
    </Card>
);

export default AdminProfile;