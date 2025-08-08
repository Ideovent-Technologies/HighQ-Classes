import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminService from "@/API/services/AdminService";
import { AdminUser } from "@/types/admin.types"; // Using your defined type

// UI Components from shadcn/ui and lucide-react
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    User,
    Calendar,
    Shield,
    Building,
    Edit,
    Save,
    X,
    Settings,
    Loader2,
    Lock,
    Unlock,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    KeyRound,
    Briefcase,
    AtSign,
    Fingerprint,
} from "lucide-react";

// =================================================================================
// 1. HELPER COMPONENTS FOR ENHANCED DESIGN
// =================================================================================

/**
 * A visually appealing list item with an icon for displaying user details.
 */
const InfoListItem: React.FC<{
    icon: React.ElementType;
    label: string;
    value?: React.ReactNode;
}> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-4 py-3">
        <Icon className="h-5 w-5 mt-1 text-muted-foreground" />
        <div className="flex-grow">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-md font-medium">{value || "Not specified"}</p>
        </div>
    </div>
);

/**
 * A styled card to clearly indicate boolean access rights (granted/denied).
 */
const AccessRightCard: React.FC<{ label: string; granted?: boolean }> = ({
    label,
    granted,
}) => (
    <div
        className={`flex items-center space-x-3 p-4 rounded-lg border ${
            granted
                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
        }`}
    >
        {granted ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
        ) : (
            <XCircle className="h-6 w-6 text-red-600" />
        )}
        <span
            className={`font-medium ${
                granted
                    ? "text-green-800 dark:text-green-300"
                    : "text-red-800 dark:text-red-300"
            }`}
        >
            {label}
        </span>
    </div>
);

// =================================================================================
// 2. MAIN ADMIN PROFILE COMPONENT WITH NEW DESIGN
// =================================================================================

const AdminProfile: React.FC = () => {
    const { state } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [profileData, setProfileData] = useState<Partial<AdminUser>>({});
    const [initialProfileData, setInitialProfileData] = useState<
        Partial<AdminUser>
    >({});

    useEffect(() => {
        async function fetchProfile() {
            if (state.user && state.user.role === "admin") {
                try {
                    const response = await AdminService.getAdminProfile();
                    if (response.success && response.admin) {
                        setProfileData(response.admin);
                        setInitialProfileData(response.admin);
                    } else {
                        // Safely convert User to AdminUser with default values
                        const userAsAdmin: AdminUser = {
                            ...(state.user as any),
                            designation:
                                (state.user as any).designation ||
                                "Administrator",
                            department: (state.user as any).department || "IT",
                        };
                        setProfileData(userAsAdmin);
                        setInitialProfileData(userAsAdmin);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    // Safely convert User to AdminUser with default values
                    const userAsAdmin: AdminUser = {
                        ...(state.user as any),
                        designation:
                            (state.user as any).designation || "Administrator",
                        department: (state.user as any).department || "IT",
                    };
                    setProfileData(userAsAdmin);
                    setInitialProfileData(userAsAdmin);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [state.user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setProfileData(initialProfileData); // Restore original data
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        console.log("Saving changes:", profileData);
        try {
            // In a real app: await AdminService.updateAdminProfile(profileData);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Profile saved successfully!");
            setInitialProfileData(profileData); // Update the base data after save
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof AdminUser, value: any) => {
        setProfileData((prev) => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!state.user || state.user.role !== "admin") {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* === Profile Header Card === */}
                <Card className="w-full mb-8 shadow-sm overflow-hidden border-none bg-card">
                    <div className="relative h-32 bg-gradient-to-r from-slate-800 to-slate-900">
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        size="sm"
                                        className="bg-white text-slate-900 hover:bg-slate-200"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Save
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        size="sm"
                                        className="text-white hover:bg-white/20 hover:text-white"
                                    >
                                        <X className="mr-2 h-4 w-4" /> Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={handleEdit}
                                    size="sm"
                                    variant="outline"
                                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                    Profile
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="p-6 pt-0 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
                        <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-800 shadow-lg">
                            <AvatarImage
                                src={profileData.profilePicture}
                                alt={profileData.name}
                            />
                            <AvatarFallback className="text-3xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                                {profileData.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-grow text-center sm:text-left pt-16 sm:pt-4">
                            <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100">
                                {profileData.name}
                            </h1>
                            <p className="text-md text-muted-foreground">
                                {profileData.designation}
                            </p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                <Badge variant="default">
                                    <Shield className="mr-1.5 h-3 w-3" />
                                    {profileData.role?.toUpperCase()}
                                </Badge>
                                <Badge
                                    variant={
                                        profileData.status === "active"
                                            ? "secondary"
                                            : "destructive"
                                    }
                                >
                                    {profileData.status?.toUpperCase()}
                                </Badge>
                                <Badge
                                    variant={
                                        profileData.status === "suspended"
                                            ? "destructive"
                                            : "secondary"
                                    }
                                >
                                    {profileData.status === "suspended" ? (
                                        <Lock className="mr-1.5 h-3 w-3" />
                                    ) : (
                                        <Unlock className="mr-1.5 h-3 w-3" />
                                    )}
                                    {profileData.status === "suspended"
                                        ? "Locked"
                                        : "Active"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-background/60 backdrop-blur-sm border rounded-lg p-1.5">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="edit">
                            Edit Profile & Access
                        </TabsTrigger>
                        <TabsTrigger value="settings">Security</TabsTrigger>
                    </TabsList>

                    {/* === Overview Tab === */}
                    <TabsContent value="overview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Access Rights</CardTitle>
                                <CardDescription>
                                    Key permissions granted to this
                                    administrative account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <AccessRightCard
                                    label="Manage Users"
                                    granted={profileData.permissions?.includes(
                                        "manage_users"
                                    )}
                                />
                                <AccessRightCard
                                    label="Manage Roles"
                                    granted={profileData.permissions?.includes(
                                        "manage_roles"
                                    )}
                                />
                                <AccessRightCard
                                    label="Access Reports"
                                    granted={profileData.permissions?.includes(
                                        "access_reports"
                                    )}
                                />
                                <AccessRightCard
                                    label="Manage System"
                                    granted={profileData.permissions?.includes(
                                        "manage_system"
                                    )}
                                />
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                </CardHeader>
                                <CardContent className="divide-y divide-border">
                                    <InfoListItem
                                        icon={AtSign}
                                        label="Email Address"
                                        value={profileData.email}
                                    />
                                    <InfoListItem
                                        icon={Phone}
                                        label="Mobile Number"
                                        value={profileData.mobile}
                                    />
                                    <InfoListItem
                                        icon={Fingerprint}
                                        label="Employee ID"
                                        value={profileData.employeeId}
                                    />
                                    <InfoListItem
                                        icon={Briefcase}
                                        label="Department"
                                        value={profileData.department}
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="divide-y divide-border">
                                    <InfoListItem
                                        icon={Calendar}
                                        label="Account Created"
                                        value={
                                            profileData.createdAt
                                                ? new Date(
                                                      profileData.createdAt
                                                  ).toLocaleDateString(
                                                      "en-GB",
                                                      {
                                                          day: "numeric",
                                                          month: "long",
                                                          year: "numeric",
                                                      }
                                                  )
                                                : "N/A"
                                        }
                                    />
                                    <InfoListItem
                                        icon={Calendar}
                                        label="Last Login"
                                        value={
                                            profileData.lastLogin
                                                ? new Date(
                                                      profileData.lastLogin
                                                  ).toLocaleString()
                                                : "Never"
                                        }
                                    />
                                    <InfoListItem
                                        icon={Mail}
                                        label="Email Verified"
                                        value={
                                            profileData.emailVerified
                                                ? "Yes"
                                                : "No"
                                        }
                                    />
                                    <InfoListItem
                                        icon={Building}
                                        label="Access Level"
                                        value={
                                            profileData.accessLevel ||
                                            "Standard"
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* === Edit Profile & Access Tab === */}
                    <TabsContent value="edit" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Profile Information</CardTitle>
                                <CardDescription>
                                    Update basic contact and role information.
                                    Click "Edit Profile" in the header to enable
                                    fields.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
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
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="department">
                                        Department
                                    </Label>
                                    <Select
                                        value={profileData.department || ""}
                                        onValueChange={(value) =>
                                            handleInputChange(
                                                "department",
                                                value
                                            )
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IT">
                                                Information Technology
                                            </SelectItem>
                                            <SelectItem value="University Administration">
                                                University Administration
                                            </SelectItem>
                                            <SelectItem value="Admissions">
                                                Admissions
                                            </SelectItem>
                                            <SelectItem value="Academics">
                                                Academics
                                            </SelectItem>
                                            <SelectItem value="Finance">
                                                Finance
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Custom Access</CardTitle>
                                <CardDescription>
                                    Assign specific permissions or departmental
                                    management roles.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-2">
                                <div>
                                    <Label htmlFor="permissions">
                                        Custom Permissions (comma-separated)
                                    </Label>
                                    <Input
                                        id="permissions"
                                        value={(
                                            profileData.permissions || []
                                        ).join(", ")}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "permissions",
                                                e.target.value
                                                    .split(",")
                                                    .map((p) => p.trim())
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="e.g., can_edit_invoices"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="managedDepartments">
                                        Managed Departments (comma-separated)
                                    </Label>
                                    <Input
                                        id="managedDepartments"
                                        value={(
                                            profileData.managedDepartments || []
                                        ).join(", ")}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "managedDepartments",
                                                e.target.value
                                                    .split(",")
                                                    .map((d) => d.trim())
                                            )
                                        }
                                        disabled={!isEditing}
                                        placeholder="e.g., Admissions, Finance"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* === Settings Tab === */}
                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>
                                    Manage your account security and
                                    authentication.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-2">
                                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700">
                                    <div>
                                        <p className="font-medium">
                                            Change Password
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            It's a good practice to use a
                                            strong, unique password.
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        <KeyRound className="mr-2 h-4 w-4" />
                                        Change Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminProfile;
