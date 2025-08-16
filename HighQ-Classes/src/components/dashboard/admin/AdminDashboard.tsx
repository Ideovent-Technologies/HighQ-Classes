import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom"; // Added Link import
import {
    Users,
    UserCheck,
    BookOpen,
    ClipboardList,
    BarChart3,
    Bell,
    Loader2,
    LayoutDashboard, // Added for Dashboard Header
    ArrowRight, // Added for "View All" button
    DollarSign // Ensure DollarSign is imported if used
} from "lucide-react";

// The following imports are external to this compilation unit and are assumed to be provided by the environment.
// They are not 'mocked' but rather treated as external dependencies.
import AdminService from "@/API/services/AdminService";

import QuickActions from "@/components/dashboard/Widgets/QuickActions";
import { useToast } from "@/hooks/use-toast";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";

// Helper function to format currency for readability
const formatToIndianCurrency = (amount: number): string => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
};

// A beautifully styled and animated card component for statistics
interface GradientCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    to: string;
    gradientFrom: string;
    gradientTo: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    to,
    gradientFrom,
    gradientTo,
}) => {
    // Framer Motion variants for animations
    const cardVariants: Variants = {
        initial: { scale: 0.95, y: 10, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        hover: {
            scale: 1.03, // Slightly less aggressive scale for subtle effect
            y: -5,
            boxShadow: "0 18px 36px rgba(0,0,0,0.2)", // More pronounced shadow on hover
        },
    };

    return (
        <motion.a
            href={to}
            className={`relative flex flex-col justify-between p-6 rounded-3xl overflow-hidden text-white transition-all duration-300 transform-gpu cursor-pointer`}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 25 }} // Adjusted damping for smoother spring
            style={{
                backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`, // Changed gradient direction
            }}
        >
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-black/15 mix-blend-overlay rounded-3xl"></div>
            
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-wide">{title}</h3>
                    <p className="text-sm sm:text-base text-white/85 mt-1">{subtitle}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm shadow-md">
                    {icon}
                </div>
            </div>
            <div className="relative z-10 mt-8">
                <p className="text-4xl sm:text-5xl font-extrabold drop-shadow-md">{value}</p>
            </div>
        </motion.a>
    );
};

// A card component for displaying notices
interface NoticeCardProps {
    title: string;
    content: string;
    date: string;
    _id: string; // Add _id for key prop
}

const NoticeCard: React.FC<NoticeCardProps> = ({ title, content, date, _id }) => (
    <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
            y: -3, // Slightly less aggressive hover lift
            boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
            backgroundColor: "#edf2f7" // Lighter hover background
        }}
        className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
        <div className="flex items-start space-x-4 mb-2">
            <Bell className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-1" />
            <div className="flex-grow">
                <h4 className="font-bold text-lg text-gray-900 leading-snug">{title}</h4>
                <span className="text-xs text-gray-500 block mt-1">
                    {new Date(date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2 mt-2">{content}</p>
    </motion.li>
);

// The main Admin Dashboard component
const AdminDashboard: React.FC = () => {
    const [data, setData] = useState<any>(null); // Use a more specific type if available
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AdminService.getAdminData();
                if (response.success) {
                    setData(response.data);
                    console.log("Dashboard data fetched successfully:", response.data);
                } else {
                    setError(
                        response.message || "Failed to fetch dashboard data."
                    );
                    toast({
                        title: "Error",
                        description: response.message || "Failed to fetch dashboard data.",
                        variant: "destructive"
                    });
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("An unexpected error occurred while fetching dashboard data.");
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while fetching dashboard data.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);

    const pageVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.1 },
        },
    };

    if (loading) {
        return (
            
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 to-purple-100 text-indigo-900 p-8 rounded-lg">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader2 className="h-20 w-20 text-indigo-500 mb-6" />
                    </motion.div>
                    <p className="text-2xl font-medium text-indigo-700">
                        Loading dashboard...
                    </p>
                    <p className="text-base text-indigo-600 mt-2">Gathering the latest insights for you.</p>
                </div>
       
        );
    }

    if (error) {
        return (
         
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-lg">
                    <Card className="bg-red-50 border-red-300 shadow-xl text-center p-6">
                        <CardHeader>
                            <CardTitle className="text-red-600 text-2xl font-bold">Error Loading Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-red-500 text-lg mt-2">{error}</CardDescription>
                            <p className="text-red-400 text-sm mt-4">Please try refreshing the page or contact support if the issue persists.</p>
                        </CardContent>
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
            to: "/dashboard/all-students",
            icon: <Users className="h-7 w-7 text-white" />,
            gradientFrom: "#5b21b6", // deep purple
            gradientTo: "#7c3aed",   // lighter purple
        },
        {
            title: "Total Teachers",
            value: totalTeachers,
            subtitle: "Active faculty",
            to: "/dashboard/teacher-management",
            icon: <UserCheck className="h-7 w-7 text-white" />,
            gradientFrom: "#065f46", // dark green
            gradientTo: "#10b981",   // emerald green
        },
        {
            title: "Courses Offered",
            value: totalCourses,
            subtitle: "In the curriculum",
            to: "/dashboard/course-management",
            icon: <BookOpen className="h-7 w-7 text-white" />,
            gradientFrom: "#4338ca", // indigo
            gradientTo: "#6366f1",   // light indigo
        },
        {
            title: "Total Revenue",
            value: formatToIndianCurrency(totalRevenue),
            subtitle: "This fiscal year",
            to: "/admin/finance",
            icon: <DollarSign className="h-7 w-7 text-white" />, // Changed to DollarSign for revenue
            gradientFrom: "#15803d", // dark lime green
            gradientTo: "#22c55e",   // lime green
        },
        {
            title: "Pending Approvals",
            value: pendingApprovals,
            subtitle: "Require your attention",
            to: "/admin/approvals",
            icon: <ClipboardList className="h-7 w-7 text-white" />,
            gradientFrom: "#a16207", // dark amber
            gradientTo: "#eab308",   // amber
        },
        {
            title: "Active Users",
            value: activeUsers,
            subtitle: "Online in last 24h",
            to: "/admin/analytics",
            icon: <BarChart3 className="h-7 w-7 text-white" />,
            gradientFrom: "#0e7490", // dark cyan
            gradientTo: "#06b6d4",   // light cyan
        },
    ];

    return (
     
            <motion.div
                className="p-6 sm:p-8 space-y-10 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-lg"
                variants={pageVariants}
                initial="initial"
                animate="animate"
            >
                {/* Dashboard Header */}
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <LayoutDashboard className="h-10 w-10 text-indigo-600" />
                            Admin Overview
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                            Welcome back! Here's a snapshot of your institution's performance.
                        </p>
                    </div>
                </header>

                <div className="space-y-10">
                    {/* Key Statistics Section */}
                    <section>
                        <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-6">
                            Key Statistics
                        </h2>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                            initial="initial"
                            animate="animate"
                            variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                        >
                            {statCards.map((card) => (
                                <GradientCard key={card.title} {...card} />
                            ))}
                        </motion.div>
                    </section>

                    {/* Quick Actions and Recent Notices Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Actions Card - takes 1/3 width on large screens */}
                        <QuickActions className="lg:col-span-1 rounded-3xl shadow-xl" />

                        {/* Recent Notices Section - takes 2/3 width on large screens */}
                        <Card className="lg:col-span-2 rounded-3xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                    <Bell className="h-7 w-7 text-purple-600" />
                                    Recent Announcements
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                                    Stay informed with the latest updates and important notices.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {recentNotices && recentNotices.length > 0 ? (
                                    <ul className="space-y-4">
                                        {recentNotices
                                            .slice(0, 4) // Show up to 4 recent notices
                                            .map((notice: any) => ( // Using 'any' for notice type as it's not strictly defined here
                                                <NoticeCard
                                                    key={notice._id}
                                                    title={notice.title || "Untitled Notice"}
                                                    content={notice.content || "No content available."}
                                                    date={notice.createdAt || new Date().toISOString()} // Fallback to current date
                                                    _id={notice._id}
                                                />
                                            ))}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <img src="https://placehold.co/100x100/e0e7ff/4f46e5?text=📢" alt="No Notices" className="mx-auto mb-4 opacity-80" />
                                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                            No recent announcements found.
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            Everything seems quiet on the notice board!
                                        </p>
                                    </div>
                                )}
                                {recentNotices.length > 4 && (
                                    <div className="mt-6 text-center">
                                        <Link to="/dashboard/notices">
                                            <motion.button
                                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                View All Notices
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </motion.button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
      
    );
};

export default AdminDashboard;
