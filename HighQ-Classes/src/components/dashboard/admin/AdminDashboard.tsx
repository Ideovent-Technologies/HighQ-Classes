import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    UserCheck,
    BookOpen,
    DollarSign,
    ClipboardList,
    BarChart3,
    Settings,
    Bell,
    Loader2,
} from "lucide-react";
import AdminService from "@/API/services/AdminService";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard"; // Assuming this is the path to your component

// =================================================================================
// 1. REUSABLE COMPONENTS
// =================================================================================

/**
 * A card for quick navigation to key administrative sections.
 */
const QuickActionCard = ({ icon, title, description, to }: { icon: React.ReactNode; title: string; description: string; to: string; }) => (
    <Link to={to} className="group flex items-center space-x-4 rounded-xl p-4 transition-colors bg-slate-100/70 hover:bg-slate-200/60 dark:bg-slate-800/70 dark:hover:bg-slate-700/60">
        <div className="rounded-lg bg-white p-3 dark:bg-slate-900 shadow-sm">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </Link>
);

/**
 * Formats a number into the Indian currency system (Lakhs & Crores).
 */
const formatToIndianCurrency = (amount: number) => {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(1)}k`;
    }
    return `₹${amount}`;
};


// =================================================================================
// 2. MAIN ADMIN DASHBOARD COMPONENT
// =================================================================================

const AdminDashboard = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await AdminService.getAdminData();
                if (response.success) {
                    setData(response.data);
                } else {
                    setError(response.message || "Failed to fetch dashboard data.");
                }
            } catch (err) {
                setError("An unexpected error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 min-h-[400px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <p className="p-8 text-center text-red-500">Error: {error}</p>;
    }

    // Default values for dashboard data
    const {
        totalStudents = 0,
        totalTeachers = 0,
        totalCourses = 0,
        totalRevenue = 0,
        pendingApprovals = 0,
        activeUsers = 0,
        recentNotices = [],
    } = data || {};

    const statCards = [
        { title: "Total Students", value: totalStudents, subtitle: "Across all batches", to: "/admin/students", icon: <Users className="h-6 w-6 text-blue-500" /> },
        { title: "Total Teachers", value: totalTeachers, subtitle: "Active faculty", to: "/admin/teachers", icon: <UserCheck className="h-6 w-6 text-green-500" /> },
        { title: "Courses Offered", value: totalCourses, subtitle: "In the curriculum", to: "/admin/courses", icon: <BookOpen className="h-6 w-6 text-purple-500" /> },
        { title: "Total Revenue", value: formatToIndianCurrency(totalRevenue), subtitle: "This fiscal year", to: "/admin/finance",  },
        { title: "Pending Approvals", value: pendingApprovals, subtitle: "Require your attention", to: "/admin/approvals", icon: <ClipboardList className="h-6 w-6 text-amber-500" /> },
        { title: "Active Users", value: activeUsers, subtitle: "Online in last 24h", to: "/admin/analytics", icon: <BarChart3 className="h-6 w-6 text-sky-500" /> },
    ];
    
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto bg-slate-50 dark:bg-slate-900 rounded-lg">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, Admin. Here's a summary of your institution's status.</p>
            </header>

            {/* === Key Statistics Grid === */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* === Quick Actions Section === */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Navigate to key management areas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <QuickActionCard icon={<Users className="text-blue-500" />} title="Manage Users" description="Add, edit, or suspend users" to="/admin/users" />
                        <QuickActionCard icon={<BookOpen className="text-purple-500" />} title="Manage Courses" description="Oversee curriculum and batches" to="/admin/courses" />
                        <QuickActionCard icon={<Settings className="text-slate-500" />} title="System Settings" description="Configure platform-wide options" to="/admin/settings" />
                    </CardContent>
                </Card>

                {/* === Recent Notices Section === */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Notices</CardTitle>
                        <CardDescription>Latest announcements and updates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentNotices.length > 0 ? (
                            <ul className="space-y-4">
                                {recentNotices.slice(0, 4).map((notice: any) => (
                                    <li key={notice._id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 pt-1">
                                            <Bell className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{notice.title}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{notice.content.substring(0, 100)}...</p>
                                            <span className="text-xs text-slate-400">{new Date(notice.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-slate-500 py-8">No recent notices found.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
