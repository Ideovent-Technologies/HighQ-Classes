import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Users,
  Bell,
  FileText,
  Video,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";
import { cn } from "@/lib/utils";

// More refined glassmorphism card for light theme
const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "relative p-6 rounded-2xl border border-gray-200 shadow-2xl backdrop-blur-xl bg-white/70 overflow-hidden",
      "transition-all duration-300 hover:shadow-3xl",
      className
    )}
  >
    {children}
  </div>
);

// Stat card with updated pastel gradients and interactive elements
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
        <div className="p-3 rounded-full shadow-lg bg-white/60 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        {to && (
          <ChevronRight className="h-6 w-6 text-gray-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20" />
        )}
      </div>
      <div className="mt-6 z-20">
        <p className="text-md font-semibold text-gray-700">{title}</p>
        <p className="mt-1 text-4xl font-extrabold text-gray-900 drop-shadow-sm">{value}</p>
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-gray-600 italic drop-shadow-sm z-20">{subtitle}</p>
      )}
    </>
  );

  return (
    <div
      className={cn(
        "group relative rounded-2xl transition-all duration-500 hover:scale-[1.03] overflow-hidden cursor-pointer shadow-xl border border-gray-200"
      )}
      style={{ backgroundImage: gradient }}
    >
      <Link to={to || "#"} className="block p-6">
        {CardContent}
      </Link>
      {/* Dynamic 3D blob effect for modern feel */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-50 bg-white/30 group-hover:w-60 group-hover:h-60 transition-all duration-500" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-50 bg-white/30 group-hover:w-60 group-hover:h-60 transition-all duration-500" />
    </div>
  );
};

// List card with improved hover and color contrast
const ListCard = ({
  title,
  items,
  to,
  icon: Icon,
  emptyMessage,
  iconColor,
}: {
  title: string;
  items: any[];
  to: string;
  icon: any;
  emptyMessage: string;
  iconColor: string;
}) => (
  <GlassCard className="col-span-1 md:col-span-2">
    <div className="flex items-center justify-between mb-4 z-20">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 drop-shadow-sm flex items-center gap-2">
        <Icon className={cn("h-6 w-6", iconColor)} /> {title}
      </h2>
      <Link
        to={to}
        className={cn("text-sm font-medium", iconColor, "hover:underline flex items-center z-20")}
      >
        View All
        <ChevronRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
    {items?.length > 0 ? (
      <ul className="space-y-3 z-20">
        {items.slice(0, 3).map((item, index) => (
          <li
            key={index}
            className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl transition-all duration-300 hover:bg-white/80"
          >
            <span
              className={cn(
                "flex items-center justify-center h-8 w-8 rounded-full bg-white/70 flex-shrink-0",
                iconColor
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-gray-900 truncate">{item.title || item.name}</p>
              <p className="text-xs text-gray-700 truncate">{item.description || item.subject || "No description"}</p>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-center py-6 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    )}
  </GlassCard>
);

const TeacherDashboard = () => {
  const { data, loading, error } = useTeacherDashboard();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
        <div className="p-10 rounded-xl bg-white shadow-xl text-xl text-center font-medium animate-pulse">
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
    materialsSummary = { totalUploaded: 0, recentMaterials: [] },
    recordingsSummary = { totalActive: 0 },
    assignedStudents = {},
    assignedBatches = [],
  } = data || {};

  const totalStudents = Object.values(assignedStudents).reduce((acc, students: any) => acc + students.length, 0);

  const statCards = [
    {
      title: "Total Students",
      value: totalStudents,
      subtitle: `${Object.keys(assignedStudents).length} batches assigned`,
      to: "/dashboard/my-students",
      icon: <Users className="h-6 w-6 text-gray-900" />,
      gradient: "linear-gradient(135deg, #d4f8d4, #6ee7b7)",
    },
    {
      title: "Study Materials",
      value: materialsSummary?.totalUploaded ?? 0,
      subtitle: "Total files uploaded by you",
      to: "/dashboard/materials",
      icon: <FileText className="h-6 w-6 text-gray-900" />,
      gradient: "linear-gradient(135deg, #fff3d4, #fcd34d)",
    },
    {
      title: "Recordings",
      value: recordingsSummary?.totalActive ?? 0,
      subtitle: "Archived & accessible recordings",
      to: "/dashboard/recordings",
      icon: <Video className="h-6 w-6 text-gray-900" />,
      gradient: "linear-gradient(135deg, #dbeafe, #60a5fa)",
    },
    {
      title: "Batches Assigned",
      value: assignedBatches?.length ?? 0,
      subtitle: "Batches managed by you",
      to: "/dashboard/batches",
      icon: <BookOpen className="h-6 w-6 text-gray-900" />,
      gradient: "linear-gradient(135deg, #ede9fe, #a78bfa)",
    },
    {
      title: "Notices",
      value: recentNotices?.length ?? 0,
      subtitle: "Recent notices from admin",
      to: "/dashboard/notices",
      icon: <Bell className="h-6 w-6 text-gray-900" />,
      gradient: "linear-gradient(135deg, #fee2e2, #f87171)",
    },
  ];

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      {/* Pastel Background Gradient */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 opacity-25"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, #e0e7ff, transparent 40%), 
            radial-gradient(circle at 90% 80%, #dcfce7, transparent 40%),
            radial-gradient(circle at 50% 50%, #fef3c7, transparent 30%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="pb-6 border-b border-gray-300 mb-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-sm">
            Welcome, Teacher 👋
          </h1>
          <p className="mt-2 text-md font-medium text-gray-700">
            A quick overview of your classes and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Schedule Card */}
          <GlassCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 z-20">
              <h2 className="text-2xl font-bold tracking-tight drop-shadow-sm flex items-center gap-2">
                <CalendarCheck className="h-6 w-6 text-teal-600" /> Today's Schedule
              </h2>
              <Link
                to="/dashboard/schedule"
                className="text-sm font-medium text-teal-600 hover:underline flex items-center z-20"
              >
                View All
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {todaySchedule?.length > 0 ? (
              <ul className="space-y-4 z-20">
                {todaySchedule.map((session, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-white/70 rounded-xl transition-all duration-300 hover:bg-white/90"
                  >
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-200 text-teal-700 flex-shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-gray-900 truncate">
                        {session.courseId?.name || "Unnamed Course"}
                      </p>
                      <p className="text-sm text-gray-700 truncate">
                        {session.batchId?.name || "Unnamed Batch"} • {session.startTime} - {session.endTime}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-600">
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
            iconColor="text-red-500"
            emptyMessage="No recent notices from the administration."
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;