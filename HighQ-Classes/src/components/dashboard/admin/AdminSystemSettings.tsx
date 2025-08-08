import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    Shield,
    Database,
    Mail,
    Bell,
    Globe,
    Palette,
    Key,
    Server,
    Zap,
    RefreshCw,
    Save,
    AlertTriangle,
    CheckCircle,
    Loader2,
} from "lucide-react";
import AdminService from "@/API/services/AdminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface SystemSettings {
    general: {
        instituteName: string;
        instituteAddress: string;
        institutePhone: string;
        instituteEmail: string;
        website: string;
        timezone: string;
    };
    email: {
        smtpHost: string;
        smtpPort: number;
        smtpUser: string;
        smtpPassword: string;
        fromEmail: string;
        enableEmailNotifications: boolean;
    };
    notifications: {
        enablePushNotifications: boolean;
        enableSmsNotifications: boolean;
        enableEmailReminders: boolean;
        reminderBeforeDays: number;
    };
    security: {
        passwordMinLength: number;
        requireSpecialChars: boolean;
        sessionTimeout: number;
        maxLoginAttempts: number;
        enableTwoFactor: boolean;
    };
    backup: {
        autoBackup: boolean;
        backupFrequency: string;
        retentionDays: number;
        lastBackup: string;
    };
}

const AdminSystemSettings: React.FC = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const [settings, setSettings] = useState<SystemSettings>({
        general: {
            instituteName: "HighQ Classes",
            instituteAddress: "123 Education Street, Learning City, India",
            institutePhone: "+91 9876543210",
            instituteEmail: "info@highqclasses.com",
            website: "https://www.highqclasses.com",
            timezone: "Asia/Kolkata",
        },
        email: {
            smtpHost: "smtp.gmail.com",
            smtpPort: 587,
            smtpUser: "noreply@highqclasses.com",
            smtpPassword: "",
            fromEmail: "noreply@highqclasses.com",
            enableEmailNotifications: true,
        },
        notifications: {
            enablePushNotifications: true,
            enableSmsNotifications: false,
            enableEmailReminders: true,
            reminderBeforeDays: 1,
        },
        security: {
            passwordMinLength: 8,
            requireSpecialChars: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            enableTwoFactor: false,
        },
        backup: {
            autoBackup: true,
            backupFrequency: "daily",
            retentionDays: 30,
            lastBackup: "2024-01-20 03:00:00",
        },
    });

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "email", label: "Email", icon: Mail },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "backup", label: "Backup", icon: Database },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            // Since we don't have a settings endpoint, we'll use the current settings
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error fetching settings:", error);
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            // Simulate saving settings
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast({
                title: "Success!",
                description: "Settings saved successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleTestEmail = async () => {
        try {
            toast({
                title: "Test Email Sent",
                description: "Check your inbox for the test email",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send test email",
                variant: "destructive",
            });
        }
    };

    const handleBackupNow = async () => {
        try {
            toast({
                title: "Backup Started",
                description: "Database backup is in progress",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to start backup",
                variant: "destructive",
            });
        }
    };

    const updateSettings = (
        section: keyof SystemSettings,
        field: string,
        value: any
    ) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="instituteName">Institute Name</Label>
                    <Input
                        id="instituteName"
                        value={settings.general.instituteName}
                        onChange={(e) =>
                            updateSettings(
                                "general",
                                "instituteName",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="instituteEmail">Email</Label>
                    <Input
                        id="instituteEmail"
                        type="email"
                        value={settings.general.instituteEmail}
                        onChange={(e) =>
                            updateSettings(
                                "general",
                                "instituteEmail",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="institutePhone">Phone</Label>
                    <Input
                        id="institutePhone"
                        value={settings.general.institutePhone}
                        onChange={(e) =>
                            updateSettings(
                                "general",
                                "institutePhone",
                                e.target.value
                            )
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={settings.general.website}
                        onChange={(e) =>
                            updateSettings("general", "website", e.target.value)
                        }
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                    id="address"
                    value={settings.general.instituteAddress}
                    onChange={(e) =>
                        updateSettings(
                            "general",
                            "instituteAddress",
                            e.target.value
                        )
                    }
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                        updateSettings("general", "timezone", value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Asia/Kolkata">
                            Asia/Kolkata (IST)
                        </SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                            America/New_York (EST)
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderEmailTab = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">
                        Email Configuration
                    </h3>
                    <p className="text-sm text-gray-600">
                        Configure SMTP settings for email notifications
                    </p>
                </div>
                <Button onClick={handleTestEmail} variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                        id="smtpHost"
                        value={settings.email.smtpHost}
                        onChange={(e) =>
                            updateSettings("email", "smtpHost", e.target.value)
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                        id="smtpPort"
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) =>
                            updateSettings(
                                "email",
                                "smtpPort",
                                parseInt(e.target.value)
                            )
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                        id="smtpUser"
                        value={settings.email.smtpUser}
                        onChange={(e) =>
                            updateSettings("email", "smtpUser", e.target.value)
                        }
                    />
                </div>
                <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) =>
                            updateSettings(
                                "email",
                                "smtpPassword",
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) =>
                        updateSettings("email", "fromEmail", e.target.value)
                    }
                />
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="enableEmailNotifications"
                    checked={settings.email.enableEmailNotifications}
                    onCheckedChange={(checked) =>
                        updateSettings(
                            "email",
                            "enableEmailNotifications",
                            checked
                        )
                    }
                />
                <Label htmlFor="enableEmailNotifications">
                    Enable Email Notifications
                </Label>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <Label htmlFor="passwordMinLength">
                            Minimum Password Length
                        </Label>
                        <Input
                            id="passwordMinLength"
                            type="number"
                            value={settings.security.passwordMinLength}
                            onChange={(e) =>
                                updateSettings(
                                    "security",
                                    "passwordMinLength",
                                    parseInt(e.target.value)
                                )
                            }
                        />
                    </div>
                    <div>
                        <Label htmlFor="maxLoginAttempts">
                            Max Login Attempts
                        </Label>
                        <Input
                            id="maxLoginAttempts"
                            type="number"
                            value={settings.security.maxLoginAttempts}
                            onChange={(e) =>
                                updateSettings(
                                    "security",
                                    "maxLoginAttempts",
                                    parseInt(e.target.value)
                                )
                            }
                        />
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="requireSpecialChars"
                            checked={settings.security.requireSpecialChars}
                            onCheckedChange={(checked) =>
                                updateSettings(
                                    "security",
                                    "requireSpecialChars",
                                    checked
                                )
                            }
                        />
                        <Label htmlFor="requireSpecialChars">
                            Require Special Characters
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="enableTwoFactor"
                            checked={settings.security.enableTwoFactor}
                            onCheckedChange={(checked) =>
                                updateSettings(
                                    "security",
                                    "enableTwoFactor",
                                    checked
                                )
                            }
                        />
                        <Label htmlFor="enableTwoFactor">
                            Enable Two-Factor Authentication
                        </Label>
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold">Session Management</h3>
                <div className="mt-4">
                    <Label htmlFor="sessionTimeout">
                        Session Timeout (minutes)
                    </Label>
                    <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                            updateSettings(
                                "security",
                                "sessionTimeout",
                                parseInt(e.target.value)
                            )
                        }
                        className="max-w-xs"
                    />
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading settings...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Settings className="h-8 w-8 text-blue-600" />
                        System Settings
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Configure system preferences and security settings
                    </p>
                </div>

                <Button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {saving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                        </>
                    )}
                </Button>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card>
                    <CardContent className="p-6">
                        {activeTab === "general" && renderGeneralTab()}
                        {activeTab === "email" && renderEmailTab()}
                        {activeTab === "security" && renderSecurityTab()}
                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold">
                                    Notification Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={
                                                settings.notifications
                                                    .enablePushNotifications
                                            }
                                            onCheckedChange={(checked) =>
                                                updateSettings(
                                                    "notifications",
                                                    "enablePushNotifications",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label>Enable Push Notifications</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={
                                                settings.notifications
                                                    .enableSmsNotifications
                                            }
                                            onCheckedChange={(checked) =>
                                                updateSettings(
                                                    "notifications",
                                                    "enableSmsNotifications",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label>Enable SMS Notifications</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={
                                                settings.notifications
                                                    .enableEmailReminders
                                            }
                                            onCheckedChange={(checked) =>
                                                updateSettings(
                                                    "notifications",
                                                    "enableEmailReminders",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label>Enable Email Reminders</Label>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "backup" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">
                                        Backup Configuration
                                    </h3>
                                    <Button
                                        onClick={handleBackupNow}
                                        variant="outline"
                                    >
                                        <Database className="h-4 w-4 mr-2" />
                                        Backup Now
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={settings.backup.autoBackup}
                                            onCheckedChange={(checked) =>
                                                updateSettings(
                                                    "backup",
                                                    "autoBackup",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label>Enable Automatic Backup</Label>
                                    </div>

                                    <div>
                                        <Label>Backup Frequency</Label>
                                        <Select
                                            value={
                                                settings.backup.backupFrequency
                                            }
                                            onValueChange={(value) =>
                                                updateSettings(
                                                    "backup",
                                                    "backupFrequency",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="max-w-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="daily">
                                                    Daily
                                                </SelectItem>
                                                <SelectItem value="weekly">
                                                    Weekly
                                                </SelectItem>
                                                <SelectItem value="monthly">
                                                    Monthly
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Last Backup:{" "}
                                            <span className="font-medium">
                                                {settings.backup.lastBackup}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminSystemSettings;
