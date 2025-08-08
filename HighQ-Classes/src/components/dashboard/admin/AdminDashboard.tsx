import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
    Users,
    UserCheck,
    BookOpen,
    ClipboardList,
    BarChart3,
    Bell,
    Loader2,
    CreditCard,
    MessageSquare,
} from "lucide-react";

import AdminService from "@/API/services/AdminService";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import QuickActions from "@/components/dashboard/Widgets/QuickActions";

// Helper function to format currency for readability
const formatToIndianCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
};

// A beautifully styled and animated card component
const GradientCard = ({
    title,
    value,
    subtitle,
    icon,
    to,
    gradientFrom,
    gradientTo,
}) => {
    // Framer Motion variants for animations
    const cardVariants = {
        initial: { scale: 0.95, y: 10, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        hover: {
            scale: 1.05,
            y: -5,
            boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
        },
    };

    return (
        <motion.a
            href={to}
            className={`relative flex flex-col justify-between p-6 rounded-3xl overflow-hidden text-white transition-all duration-300 transform-gpu`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
                backgroundImage: `linear-gradient(to right bottom, ${gradientFrom}, ${gradientTo})`,
            }}
        >
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold tracking-wide">{title}</h3>
                    <p className="text-sm text-white/80">{subtitle}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm">
                    {icon}
                </div>
            </div>
            <div className="relative z-10 mt-8">
                <p className="text-4xl font-extrabold">{value}</p>
            </div>
        </motion.a>
    );
};

// A card component for displaying notices
const NoticeCard = ({ title, content, date }) => (
    <motion.li
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        whileHover={{
            y: -5,
            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
        }}
        className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/60 hover:bg-indigo-100/70 transition-colors duration-300"
    >
        <div className="flex items-center space-x-3 mb-2">
            <Bell className="h-5 w-5 text-indigo-500" />
            <div>
                <h4 className="font-semibold text-indigo-900">{title}</h4>
                <span className="text-xs text-indigo-500 block">
                    {new Date(date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>
        </div>
        <p className="text-sm text-indigo-800 line-clamp-2">{content}</p>
    </motion.li>
);

// The main Admin Dashboard component
const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AdminService.getAdminData();
                if (response.success) {
                    setData(response.data);
                } else {
                    setError(response.message || "Failed to fetch dashboard data.");
                }
            } catch (err) {
                setError("An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Explicitly typing the variants object as `Variants`
    const pageVariants: Variants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 30 },
        },
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 text-indigo-900 p-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="h-20 w-20 text-indigo-500 mb-6" />
                </motion.div>
                <p className="text-2xl font-medium text-indigo-600">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-indigo-50 p-8">
                <Card className="bg-red-50 border-red-300 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                        <CardDescription className="text-red-500">{error}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

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
        {
            title: "Total Students",
            value: totalStudents,
            subtitle: "Across all batches",
            to: "/admin/students",
            icon: <Users className="h-6 w-6" />,
            gradientFrom: "#6366F1",
            gradientTo: "#8B5CF6",
        },
        {
            title: "Total Teachers",
            value: totalTeachers,
            subtitle: "Active faculty",
            to: "/admin/teachers",
            icon: <UserCheck className="h-6 w-6" />,
            gradientFrom: "#4ADE80",
            gradientTo: "#14B8A6",
        },
        {
            title: "Courses Offered",
            value: totalCourses,
            subtitle: "In the curriculum",
            to: "/admin/courses",
            icon: <BookOpen className="h-6 w-6" />,
            gradientFrom: "#F472B6",
            gradientTo: "#EC4899",
        },
        {
            title: "Total Revenue",
            value: formatToIndianCurrency(totalRevenue),
            subtitle: "This fiscal year",
            to: "/admin/finance",
            icon: <CreditCard className="h-6 w-6" />,
            gradientFrom: "#38BDF8",
            gradientTo: "#3B82F6",
        },
        {
            title: "Pending Approvals",
            value: pendingApprovals,
            subtitle: "Require attention",
            to: "/admin/approvals",
            icon: <ClipboardList className="h-6 w-6" />,
            gradientFrom: "#FBBF24",
            gradientTo: "#F59E0B",
        },
        {
            title: "Active Users",
            value: activeUsers,
            subtitle: "Online in last 24h",
            to: "/admin/analytics",
            icon: <BarChart3 className="h-6 w-6" />,
            gradientFrom: "#6366F1",
            gradientTo: "#A855F7",
        },
    ];

    return (
        <motion.div
            initial="initial"
            animate="animate"
            variants={pageVariants}
            className="p-4 sm:p-6 lg:p-8 space-y-12 max-w-7xl mx-auto bg-indigo-50 text-indigo-900 min-h-screen font-inter"
        >
            <header className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-indigo-900">
                    Admin Dashboard
                </h1>
                <p className="text-lg text-indigo-600 mt-2">
                    Welcome back, Admin. Your institution’s progress at a glance.
                </p>
            </header>

            {/* The outer flex container has been removed as it was not needed
                since there was only one child div. The main content now flows
                vertically using the `space-y-12` class.
            */}
            <div className="space-y-10 flex-1">
                {/* Key Statistics */}
                <section>
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6">
                        Key Statistics
                    </h2>
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {statCards.map((card) => (
                            <GradientCard key={card.title} {...card} />
                        ))}
                    </motion.div>
                </section>

                {/* Recent Notices */}
                <section>
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6">
                        Recent Notices
                    </h2>
                    <Card className="bg-white/90 text-indigo-900 border border-indigo-100 shadow-lg">
                        <CardHeader className="border-b border-indigo-100 pb-4">
                            <CardTitle className="text-xl font-bold">
                                Latest Announcements
                            </CardTitle>
                            <CardDescription>
                                Important updates from the administration.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentNotices.length > 0 ? (
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recentNotices.slice(0, 4).map((notice) => (
                                        <NoticeCard
                                            key={notice._id}
                                            title={notice.title}
                                            content={notice.content}
                                            date={notice.createdAt}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-indigo-500">
                                    <MessageSquare className="h-10 w-10 mb-4 text-indigo-400" />
                                    <p className="text-lg">No recent notices to display.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Quick Actions */}
                <section>
                    <h2 className="text-2xl font-bold text-indigo-800 mb-6">
                        Quick Actions
                    </h2>
                    <div className="bg-white/90 rounded-xl p-4 shadow-lg border border-indigo-100">
                        <QuickActions />
                    </div>
                </section>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
