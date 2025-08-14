import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, Bell, FileText, Video, ChevronRight, FileUp, CalendarCheck } from "lucide-react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { cn } from "@/lib/utils";

// Reusable component for a single glassmorphism card
const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div
        className={cn(
            "relative p-6 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl bg-white/10 overflow-hidden",
            "before:absolute before:inset-0 before:bg-white/5 before:backdrop-blur-md before:z-10",
            className
        )}
    >
        {children}
    </div>
);

// Stat card with a dynamic gradient and a glowing effect
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
    gradient: string;
}) => {
    const CardContent = (
        <>
            <div className="flex items-center justify-between z-20">
                <div className="p-3 rounded-full shadow-lg bg-white/30 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                {to && <ChevronRight className="h-6 w-6 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />}
            </div>
            <div className="mt-6 z-20">
                <p className="text-sm font-medium text-white/80">{title}</p>
                <p className="mt-1 text-4xl font-extrabold text-white drop-shadow-md">{value}</p>
            </div>
            {subtitle && (
                <p className="mt-2 text-xs text-white/70 italic drop-shadow-sm z-20">
                    {subtitle}
                </p>
            )}
        </>
    );

    return (
        <div className={cn("group relative rounded-2xl transition-all duration-500 hover:scale-[1.03] overflow-hidden cursor-pointer", "shadow-xl border border-white/20")} style={{ backgroundImage: gradient }}>
            <Link to={to || "#"} className="block p-6">
                {CardContent}
            </Link>
            {/* 3D blob effect */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:w-60 group-hover:h-60 transition-all duration-500" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50 group-hover:w-60 group-hover:h-60 transition-all duration-500" />
        </div>
    );
};

// Reusable card for lists (e.g., Notices, Materials)
const ListCard = ({ title, items, to, icon: Icon, emptyMessage, iconColor }: {
    title: string;
    items: any[];
    to: string;
    icon: any;
    emptyMessage: string;
    iconColor: string;
}) => (
    <GlassCard className="col-span-1 md:col-span-2">
        <div className="flex items-center justify-between mb-4 z-20">
            <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center gap-2">
                <Icon className={cn("h-6 w-6", iconColor)} /> {title}
            </h2>
            <Link to={to} className={cn("text-sm font-medium", iconColor, "hover:underline flex items-center z-20")}>
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
        </div>
        {items?.length > 0 ? (
            <ul className="space-y-3 z-20">
                {items.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl transition-all duration-300 hover:bg-white/20">
                        <span className={cn("flex items-center justify-center h-8 w-8 rounded-full bg-white/20 flex-shrink-0", iconColor)}>
                            <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-white truncate">{item.title || item.name}</p>
                            <p className="text-xs text-white/70 truncate">{item.description || item.subject || "No description"}</p>
                        </div>
                        <span className="text-xs text-white/50 flex-shrink-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-6 text-white/60">
                <p>{emptyMessage}</p>
            </div>
        )}
    </GlassCard>
);

const TeacherDashboard = () => {
    const { data, loading, error } = useTeacherDashboard();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="p-10 rounded-xl bg-slate-800 shadow-xl text-xl text-center font-medium animate-pulse">
                Loading your personalized dashboard... 🚀
            </div>
        </div>
    );
    if (error) return (
        <div className="p-10 text-red-400 text-center text-lg font-bold bg-slate-800 rounded-xl shadow-xl m-8">
            🚨 Error: Failed to load dashboard data. Please try again later.
        </div>
    );

    // Provide robust default values to prevent undefined errors
    const {
        todaySchedule = [],
        recentNotices = [],
        materialsSummary = { totalUploaded: 0, recentMaterials: [] },
        recordingsSummary = { totalActive: 0 },
        assignedStudents = {},
        assignedBatches = [],
    } = data || {};

    const totalStudents = Object.values(assignedStudents).reduce((acc, students: any) => acc + students.length, 0);

    const statCards = [
        { title: "Total Students", value: totalStudents, subtitle: `${Object.keys(assignedStudents).length} batches assigned`, to: "/dashboard/my-students", icon: <Users className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #10b981, #065f46)" },
        { title: "Study Materials", value: materialsSummary?.totalUploaded ?? 0, subtitle: "Total files uploaded by you", to: "/dashboard/materials", icon: <FileText className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #f59e0b, #b45309)" },
        { title: "Recordings", value: recordingsSummary?.totalActive ?? 0, subtitle: "Archived & accessible recordings", to: "/dashboard/recordings", icon: <Video className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
        { title: "Batches Assigned", value: assignedBatches?.length ?? 0, subtitle: "Batches managed by you", to: "/dashboard/batches", icon: <BookOpen className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #8b5cf6, #5b21b6)" },
        { title: "Notices", value: recentNotices?.length ?? 0, subtitle: "Recent notices from admin", to: "/dashboard/notices", icon: <Bell className="h-6 w-6 text-white" />, gradient: "linear-gradient(135deg, #ef4444, #991b1b)" },
    ];

    return (
        <div className="p-6 md:p-10 min-h-screen bg-slate-900 font-sans text-white relative">
            {/* Background Gradient Effect */}
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20" style={{
                background: "radial-gradient(circle at 10% 20%, #4c1d95, transparent 50%), radial-gradient(circle at 90% 80%, #16a34a, transparent 50%)"
            }} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="pb-6 border-b border-white/10 mb-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        Welcome, Teacher 👋
                    </h1>
                    <p className="mt-2 text-md text-white/70 font-light">
                        A quick overview of your classes and resources.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Today's Schedule Card */}
                    <GlassCard className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4 z-20">
                            <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center gap-2">
                                <CalendarCheck className="h-6 w-6 text-teal-300" /> Today's Schedule
                            </h2>
                            <Link to="/dashboard/schedule" className="text-sm font-medium text-teal-300 hover:underline flex items-center z-20">
                                View All
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        {todaySchedule?.length > 0 ? (
                            <ul className="space-y-4 z-20">
                                {todaySchedule.map((session, index) => (
                                    <li key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl transition-all duration-300 hover:bg-white/20">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-500/20 text-teal-300 flex-shrink-0">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-semibold text-white truncate">{session.courseId?.name || "Unnamed Course"}</p>
                                            <p className="text-sm text-white/70 truncate">
                                                {session.batchId?.name || "Unnamed Batch"} • {session.startTime} - {session.endTime}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-white/60">
                                <p>🎉 No classes scheduled for today. Enjoy your day!</p>
                            </div>
                        )}
                    </GlassCard>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                        {statCards.slice(0, 2).map((card) => (
                            <StatCard key={card.title} {...card} />
                        ))}
                    </div>
                </div>

                {/* Second Row: More Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {statCards.slice(2).map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>

                {/* Third Row: Recent Activity Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ListCard
                        title="Recent Notices"
                        items={recentNotices}
                        to="/dashboard/notices"
                        icon={Bell}
                        iconColor="text-red-300"
                        emptyMessage="No recent notices from the administration."
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;