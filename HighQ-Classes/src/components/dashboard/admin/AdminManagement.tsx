import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    GraduationCap,
    Megaphone,
    Settings,
    UserPlus,
    FileText,
    BarChart3,
    Shield,
    ArrowLeft,
    BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminAnnouncementPage from "./AdminAnnouncementPage";
import AdminUserManagement from "./AdminUserManagement";
import AdminReportsPage from "./AdminReportsPage";
import AdminSystemSettings from "./AdminSystemSettings";
import AdminCourseManagement from "./AdminCourseManagement";

interface NavigationItem {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    badge?: string;
    color: string;
}

const AdminManagement: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>("overview");

    const navigationItems: NavigationItem[] = [
        {
            id: "users",
            title: "User Management",
            description: "Manage students, teachers, and staff accounts",
            icon: Users,
            badge: "Core",
            color: "blue",
        },
        {
            id: "courses",
            title: "Course Management",
            description: "Manage courses, subjects, and academic programs",
            icon: BookOpen,
            badge: "New",
            color: "green",
        },
        {
            id: "announcements",
            title: "Announcements",
            description: "Create and manage system-wide announcements",
            icon: Megaphone,
            badge: "Hot",
            color: "purple",
        },
        {
            id: "reports",
            title: "Reports & Analytics",
            description: "View detailed reports and analytics",
            icon: BarChart3,
            color: "orange",
        },
        {
            id: "settings",
            title: "System Settings",
            description: "Configure system preferences and security",
            icon: Settings,
            color: "gray",
        },
    ];

    const getColorClasses = (color: string) => {
        const colorMap = {
            blue: {
                bg: "bg-blue-50 hover:bg-blue-100",
                border: "border-blue-200 hover:border-blue-300",
                icon: "text-blue-600",
                title: "text-blue-900",
            },
            purple: {
                bg: "bg-purple-50 hover:bg-purple-100",
                border: "border-purple-200 hover:border-purple-300",
                icon: "text-purple-600",
                title: "text-purple-900",
            },
            green: {
                bg: "bg-green-50 hover:bg-green-100",
                border: "border-green-200 hover:border-green-300",
                icon: "text-green-600",
                title: "text-green-900",
            },
            gray: {
                bg: "bg-gray-50 hover:bg-gray-100",
                border: "border-gray-200 hover:border-gray-300",
                icon: "text-gray-600",
                title: "text-gray-900",
            },
        };
        return colorMap[color as keyof typeof colorMap] || colorMap.gray;
    };

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-900">
                        Admin Management
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Complete control center for managing your educational
                        institution
                    </p>
                </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-6 text-center">
                            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <h3 className="text-2xl font-bold text-blue-900">
                                150+
                            </h3>
                            <p className="text-blue-700">Total Users</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-6 text-center">
                            <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <h3 className="text-2xl font-bold text-green-900">
                                85%
                            </h3>
                            <p className="text-green-700">Success Rate</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-6 text-center">
                            <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <h3 className="text-2xl font-bold text-green-900">
                                25+
                            </h3>
                            <p className="text-green-700">Active Courses</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border-purple-200 bg-purple-50">
                        <CardContent className="p-6 text-center">
                            <Megaphone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <h3 className="text-2xl font-bold text-purple-900">
                                12
                            </h3>
                            <p className="text-purple-700">
                                Active Announcements
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="border-orange-200 bg-orange-50">
                        <CardContent className="p-6 text-center">
                            <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <h3 className="text-2xl font-bold text-orange-900">
                                98%
                            </h3>
                            <p className="text-orange-700">System Uptime</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Management Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {navigationItems.map((item, index) => {
                    const colors = getColorClasses(item.color);
                    const IconComponent = item.icon;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <Card
                                className={`${colors.bg} ${colors.border} border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <CardContent className="p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <IconComponent
                                            className={`h-12 w-12 ${colors.icon}`}
                                        />
                                        {item.badge && (
                                            <Badge className="bg-white text-gray-700 border">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <h3
                                        className={`text-xl font-bold ${colors.title} mb-2`}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {item.description}
                                    </p>
                                    <Button
                                        variant="outline"
                                        className={`w-full ${colors.border} ${colors.title} hover:bg-white`}
                                    >
                                        Access Module
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Admin Activities
                        </h3>
                        <div className="space-y-3">
                            {[
                                {
                                    action: "Created new teacher account",
                                    user: "Dr. Sarah Johnson",
                                    time: "2 hours ago",
                                },
                                {
                                    action: "Published system announcement",
                                    user: "Holiday Notice",
                                    time: "4 hours ago",
                                },
                                {
                                    action: "Generated monthly report",
                                    user: "Student Performance",
                                    time: "1 day ago",
                                },
                                {
                                    action: "Updated batch schedules",
                                    user: "JEE Advanced",
                                    time: "2 days ago",
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {activity.user}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "announcements":
                return <AdminAnnouncementPage />;
            case "users":
                return <AdminUserManagement />;
            case "courses":
                return <AdminCourseManagement />;
            case "reports":
                return <AdminReportsPage />;
            case "settings":
                return <AdminSystemSettings />;
            default:
                return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Navigation Header */}
                {activeSection !== "overview" && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => setActiveSection("overview")}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Admin Management
                        </Button>
                    </motion.div>
                )}

                {/* Content */}
                <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderContent()}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminManagement;
