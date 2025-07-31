import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Users,
  Bell,
  FileText,
  Video,
} from "lucide-react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { cn } from "@/lib/utils"; // Optional: class merging helper

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
        "rounded-2xl shadow-md transition-transform hover:scale-[1.03] duration-300",
        "bg-white/60 backdrop-blur border border-slate-200 hover:shadow-xl hover:bg-white/80",
        "flex items-center justify-between p-5 group cursor-pointer"
      )}
      style={{
        backgroundImage: gradient,
        backgroundSize: "cover",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="flex flex-col space-y-1">
        <h3 className="text-lg font-bold text-navy-800">{title}</h3>
        <p className="text-3xl font-extrabold text-navy-900">{value}</p>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="p-3 bg-white rounded-full shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </Wrapper>
  );
};

const TeacherDashboard = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading)
    return (
      <div className="p-6 text-lg text-center font-medium text-gray-600">
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
      subtitle: "Across all batches",
      to: "/dashboard/my-students",
      icon: <Users className="h-6 w-6 text-navy-500" />,
      gradient: "linear-gradient(135deg, #f0f9ff, #cbebff)",
    },
    {
      title: "Classes Today",
      value: todaySchedule.length,
      subtitle: todaySchedule[0]?.courseId?.title || "No classes scheduled",
      to: "/dashboard/schedule",
      icon: <Clock className="h-6 w-6 text-navy-500" />,
      gradient: "linear-gradient(135deg, #e5fbea, #c6f6d5)",
    },
    {
      title: "Study Materials",
      value: materialsSummary.totalUploaded || 0,
      subtitle: "Uploaded by you",
      to: "/dashboard/upload-materials",
      icon: <FileText className="h-6 w-6 text-navy-500" />,
      gradient: "linear-gradient(135deg, #fef9c3, #fde68a)",
    },
    {
      title: "Recordings",
      value: recordingsSummary.totalActive || 0,
      subtitle: "Currently active",
      to: "/dashboard/recordings",
      icon: <Video className="h-6 w-6 text-navy-500" />,
      gradient: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
    },
    {
      title: "Notices",
      value: recentNotices.length,
      subtitle: "Recent notices posted",
      to: "/dashboard/notices",
      icon: <Bell className="h-6 w-6 text-navy-500" />,
      gradient: "linear-gradient(135deg, #fff1f2, #fcdada)",
    },
    {
      title: "Batches Assigned",
      value: assignedBatches.length,
      subtitle: "Managed by you",
      to: "/dashboard/batches",
      icon: <BookOpen className="h-6 w-6 text-navy-500" />,
      gradient: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-3xl font-bold text-navy-700">📊 Teacher Dashboard</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;
