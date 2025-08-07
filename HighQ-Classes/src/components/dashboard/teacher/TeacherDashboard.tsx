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
                "rounded-3xl shadow-xl transform transition-all hover:scale-[1.05] duration-300",
                "bg-white/60 backdrop-blur-lg border border-slate-200 hover:shadow-2xl hover:bg-white/80",
                "flex items-center justify-between p-6 group cursor-pointer overflow-hidden relative"
            )}
            style={{
                backgroundImage: gradient,
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
            }}
        >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr from-white/30 to-transparent rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="flex flex-col space-y-2 z-10">
                <h3 className="text-xl font-semibold text-navy-800 tracking-wide">
                    {title}
                </h3>
                <p className="text-4xl font-extrabold text-navy-900 drop-shadow-sm">
                    {value}
                </p>
                <p className="text-sm text-slate-600 italic font-medium">
                    {subtitle}
                </p>
            </div>
            <div className="p-4 bg-white/90 rounded-full shadow-lg group-hover:scale-110 transition-transform z-10">
                {icon}
            </div>
        </Wrapper>
    );
};

const TeacherDashboard = () => {
    const { data, loading, error } = useTeacherDashboard();

    if (loading)
        return (
            <div className="p-6 text-lg text-center font-medium text-gray-600 animate-pulse">
                Loading your dashboard...
            </div>
        );
    if (error)
        return <p className="p-6 text-red-500 text-center">Error: {error}</p>;

    const {
        todaySchedule = [],
        recentNotices = [],
        attendanceSummary = {},
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
            subtitle: `${
                Object.keys(assignedStudents).length
            } batches assigned`,
            to: "/dashboard/my-students",
            icon: <Users className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #f0f9ff, #cbebff)",
        },
        {
            title: "Classes Today",
            value: todaySchedule.length,
            subtitle:
                todaySchedule.length > 0
                    ? todaySchedule[0]?.courseId?.name || "Scheduled class"
                    : "No classes scheduled",
            to: "/dashboard/schedule",
            icon: <Clock className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #e5fbea, #c6f6d5)",
        },
        {
            title: "Study Materials",
            value: materialsSummary?.totalUploaded ?? 0,
            subtitle: "Uploaded by you",
            to: "/dashboard/materials",
            icon: <FileText className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #fef9c3, #fde68a)",
        },
        {
            title: "Recordings",
            value: recordingsSummary?.totalActive ?? 0,
            subtitle: "Currently active",
            to: "/dashboard/recordings",
            icon: <Video className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
        },
        {
            title: "Notices",
            value: recentNotices?.length ?? 0,
            subtitle: "Recent notices posted",
            to: "/dashboard/notices",
            icon: <Bell className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #fff1f2, #fcdada)",
        },
        {
            title: "Batches Assigned",
            value: assignedBatches?.length ?? 0,
            subtitle: "Managed by you",
            to: "/dashboard/batches",
            icon: <BookOpen className="h-6 w-6 text-navy-500" />,
            gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
        },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="text-4xl font-bold text-navy-700 flex items-center gap-3">
                <span role="img" aria-label="bar-chart">
                    📊
                </span>{" "}
                Welcome, Teacher!
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {statCards.map((card) => (
                    <StatCard key={card.title} {...card} />
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;
