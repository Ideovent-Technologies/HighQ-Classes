import React from "react";
import { Link } from "react-router-dom";
import {
    BookOpen,
    Clock,
    Users,
    Bell,
    FileText,
    Video,
    ClipboardCheck,
} from "lucide-react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { cn } from "@/lib/utils";

// Framer Motion variants for the card animations
const cardVariants: Variants = {
    initial: { scale: 0.95, y: 20, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1 },
    hover: {
        scale: 1.05,
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    },
};

const StatCard = ({
    icon,
    title,
    value,
    subtitle,
    to,
    gradient,
}: {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    subtitle?: string;
    to?: string;
    gradient?: string;
}) => {
    const Wrapper = to ? Link : "div";
    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full"
        >
            <Wrapper
                to={to || ""}
                className={cn(
                    "relative flex flex-col justify-between p-8 rounded-3xl overflow-hidden text-navy-800",
                    "border border-slate-200 dark:border-slate-700 backdrop-filter backdrop-blur-3xl",
                    "transform transition-all duration-300 group cursor-pointer h-full"
                )}
                style={{
                    background: `linear-gradient(135deg, ${gradient}, rgba(255, 255, 255, 0.4))`,
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                }}
            >
                {/* Subtle visual elements for depth */}
                <div className="absolute inset-0 bg-white/20 mix-blend-overlay rounded-3xl group-hover:bg-white/30 transition-colors" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />

                <div className="flex flex-col space-y-2 z-10">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
                        {title}
                    </h3>
                    <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-50 drop-shadow-sm">
                        {value}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic font-medium">
                        {subtitle}
                    </p>
                </div>
                <div className="flex justify-end mt-4 z-10">
                    <div className="p-4 bg-white/70 rounded-full shadow-lg text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md">
                        {icon}
                    </div>
                </div>
            </Wrapper>
        </motion.div>
    );
};

const TeacherDashboard = () => {
    const { data, loading, error } = useTeacherDashboard();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
                <div className="p-6 text-lg text-center font-medium text-gray-600 dark:text-gray-400 animate-pulse">
                    <GraduationCap className="h-16 w-16 mx-auto mb-4 text-indigo-500" />
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500 text-center bg-gray-50 dark:bg-gray-900 min-h-screen">
                <p>Error: {error}</p>
            </div>
        );
    }

    const {
        todaySchedule = [],
        recentNotices = [],
        materialsSummary = {},
        recordingsSummary = {},
        assignedStudents = {},
        assignedBatches = [],
    } = data || {};

    const totalStudents: number = (
        Object.values(assignedStudents) as Array<
            { _id: string; name: string; email: string }[]
        >
    ).reduce((acc, students) => acc + students.length, 0);

    const statCards = [
        {
            title: "Total Students",
            value: totalStudents,
            subtitle: `${Object.keys(assignedStudents).length} batches assigned`,
            to: "/dashboard/my-students",
            icon: <Users className="h-7 w-7" />,
            gradient: "#e0e7ff",
        },
        {
            title: "Classes Today",
            value: todaySchedule.length,
            subtitle: todaySchedule.length > 0 ? `Next: ${todaySchedule[0]?.courseId?.name}` : "No classes scheduled",
            to: "/dashboard/schedule",
            icon: <Clock className="h-7 w-7" />,
            gradient: "#d1fae5",
        },
        {
            title: "Study Materials",
            value: materialsSummary?.totalUploaded ?? 0,
            subtitle: "Uploaded by you",
            to: "/dashboard/materials",
            icon: <FileText className="h-7 w-7" />,
            gradient: "#fef9c3",
        },
        {
            title: "Recordings",
            value: recordingsSummary?.totalActive ?? 0,
            subtitle: "Currently active",
            to: "/dashboard/recordings",
            icon: <Video className="h-7 w-7" />,
            gradient: "#c7d2fe",
        },
        {
            title: "Notices",
            value: recentNotices?.length ?? 0,
            subtitle: "Recent notices posted",
            to: "/dashboard/notices",
            icon: <Bell className="h-7 w-7" />,
            gradient: "#fecaca",
        },
        {
            title: "Batches Assigned",
            value: assignedBatches?.length ?? 0,
            subtitle: "Managed by you",
            to: "/dashboard/batches",
            icon: <BookOpen className="h-7 w-7" />,
            gradient: "#dbeafe",
        },
        {
            title: "Attendance",
            value: "Manage",
            subtitle: "Mark & track attendance",
            to: "/dashboard/attendance",
            icon: <ClipboardCheck className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
        },
    ];

    return (
        <motion.div
            className="p-8 sm:p-12 space-y-10 max-w-8xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-800 dark:text-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            <header className="pb-6 border-b-4 border-indigo-200 dark:border-indigo-800 rounded-b-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <LayoutDashboard className="h-10 w-10 text-indigo-600" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                        Welcome, Teacher!
                    </h1>
                </div>
            </header>

            <section>
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-6">
                    Your Key Metrics
                </h2>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="initial"
                    animate="animate"
                    variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                >
                    {statCards.map((card, index) => (
                        <StatCard key={index} {...card} />
                    ))}
                </motion.div>
            </section>
        </motion.div>
    );
};

export default TeacherDashboard;