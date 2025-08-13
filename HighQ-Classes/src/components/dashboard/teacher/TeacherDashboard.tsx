import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Users, Bell, FileText, Video } from "lucide-react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { cn } from "@/lib/utils";

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
        <Wrapper
            to={to || ""}
            className={cn(
                "rounded-3xl shadow-2xl transform transition-all hover:scale-[1.03] duration-500",
                "bg-white/70 backdrop-blur-md border border-slate-200 hover:shadow-3xl hover:bg-white/90",
                "flex flex-col items-start justify-between p-8 group cursor-pointer relative overflow-hidden h-64",
                "before:absolute before:inset-0 before:opacity-0 before:bg-white/10 before:transition-opacity before:duration-500 group-hover:before:opacity-100"
            )}
            style={{
                backgroundImage: gradient,
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
            }}
        >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-tr from-white/40 to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="flex justify-between w-full z-10">
                <div className="p-4 bg-white/90 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500 z-10">
                    {icon}
                </div>
            </div>
            <div className="flex flex-col space-y-2 z-10 mt-auto">
                <h3 className="text-xl font-semibold text-gray-900 tracking-wide">
                    {title}
                </h3>
                <p className="text-5xl font-extrabold text-navy-900 drop-shadow-sm leading-tight">
                    {value}
                </p>
                <p className="text-sm text-slate-700 italic font-medium">
                    {subtitle}
                </p>
            </div>
        </Wrapper>
    );
};

const TeacherDashboard = () => {
    const { data, loading, error } = useTeacherDashboard();

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="p-10 rounded-xl bg-white shadow-xl text-xl text-center font-medium text-gray-700 animate-pulse">
                    Loading your personalized dashboard... 🚀
                </div>
            </div>
        );
    if (error)
        return (
            <div className="p-10 text-red-600 text-center text-lg font-bold bg-white rounded-xl shadow-xl m-8">
                🚨 Error: Failed to load dashboard data. Please try again later.
            </div>
        );

    const {
        todaySchedule = [],
        recentNotices = [],
        materialsSummary = {},
        recordingsSummary = {},
        assignedStudents = {},
        assignedBatches = [],
    } = data || {};

    const totalStudents = (
        Object.values(assignedStudents) as Array<
            { _id: string; name: string; email: string }[]
        >
    ).reduce((acc, students) => acc + students.length, 0);

    const statCards = [
        {
            title: "Total Students",
            value: totalStudents,
            subtitle: `${
                Object.keys(assignedStudents).length
            } batches assigned`,
            to: "/dashboard/my-students",
            icon: <Users className="h-7 w-7 text-indigo-600" />,
            gradient: "linear-gradient(135deg, #eef2ff, #c7d2fe)",
        },
        {
            title: "Classes Today",
            value: todaySchedule.length,
            subtitle:
                todaySchedule.length > 0
                    ? `Next: ${todaySchedule[0]?.courseId?.name || "Scheduled class"}`
                    : "No classes scheduled",
            to: "/dashboard/schedule",
            icon: <Clock className="h-7 w-7 text-green-600" />,
            gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        },
        {
            title: "Study Materials",
            value: materialsSummary?.totalUploaded ?? 0,
            subtitle: "Total files uploaded by you",
            to: "/dashboard/materials",
            icon: <FileText className="h-7 w-7 text-yellow-600" />,
            gradient: "linear-gradient(135deg, #fefce8, #fef08a)",
        },
        {
            title: "Recordings",
            value: recordingsSummary?.totalActive ?? 0,
            subtitle: "Archived & accessible recordings",
            to: "/dashboard/recordings",
            icon: <Video className="h-7 w-7 text-blue-600" />,
            gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)",
        },
        {
            title: "Notices",
            value: recentNotices?.length ?? 0,
            subtitle: "Recent notices posted by admin",
            to: "/dashboard/notices",
            icon: <Bell className="h-7 w-7 text-red-600" />,
            gradient: "linear-gradient(135deg, #fff1f2, #fecaca)",
        },
        {
            title: "Batches Assigned",
            value: assignedBatches?.length ?? 0,
            subtitle: "Batches managed by you",
            to: "/dashboard/batches",
            icon: <BookOpen className="h-7 w-7 text-purple-600" />,
            gradient: "linear-gradient(135deg, #f5f3ff, #e9d5ff)",
        },
    ];

    return (
        <div className="p-10 space-y-12 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight drop-shadow-sm flex items-center gap-4">
                    <span role="img" aria-label="waving hand">
                        👋
                    </span>{" "}
                    Welcome Back, Teacher!
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;