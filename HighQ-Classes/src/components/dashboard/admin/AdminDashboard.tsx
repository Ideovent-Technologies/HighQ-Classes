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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import { motion } from "framer-motion";

const QuickActionCard = ({ icon, title, description, to }) => (
  <Link
    to={to}
    className="group flex items-center space-x-4 rounded-2xl p-4 shadow-lg transition-all bg-white/60 dark:bg-slate-800/60 hover:shadow-xl backdrop-blur-md ring-1 ring-slate-200 dark:ring-slate-700"
  >
    <motion.div
      whileHover={{ rotate: 6, scale: 1.1 }}
      className="rounded-xl bg-gradient-to-tr from-slate-50 to-slate-200 p-3 dark:from-slate-900 dark:to-slate-800 shadow"
    >
      {icon}
    </motion.div>
    <div>
      <h4 className="font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  </Link>
);

const formatToIndianCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${amount}`;
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminService.getAdminData();
        if (response.success) setData(response.data);
        else setError(response.message || "Failed to fetch dashboard data.");
      } catch {
        setError("An unexpected error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 p-6">Error: {error}</p>;
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
      icon: <Users className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Total Teachers",
      value: totalTeachers,
      subtitle: "Active faculty",
      to: "/admin/teachers",
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
    },
    {
      title: "Courses Offered",
      value: totalCourses,
      subtitle: "In the curriculum",
      to: "/admin/courses",
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
    },
    {
      title: "Total Revenue",
      value: formatToIndianCurrency(totalRevenue),
      subtitle: "This fiscal year",
      to: "/admin/finance",
      icon: <DollarSign className="h-6 w-6 text-rose-500" />,
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals,
      subtitle: "Require your attention",
      to: "/admin/approvals",
      icon: <ClipboardList className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Active Users",
      value: activeUsers,
      subtitle: "Online in last 24h",
      to: "/admin/analytics",
      icon: <BarChart3 className="h-6 w-6 text-sky-500" />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#d8e9ff] via-[#f7f0ff] to-[#dff9fb] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a] overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] h-[300px] w-[300px] bg-indigo-400 opacity-30 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-100px] h-[300px] w-[300px] bg-rose-400 opacity-30 rounded-full filter blur-3xl animate-ping" />

      <div className="relative z-10 px-4 md:px-8 py-10 space-y-8 max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-8 p-6 md:p-8 rounded-3xl overflow-hidden bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#a78bfa]/30 via-[#f472b6]/20 to-[#38bdf8]/30 blur-2xl opacity-60 animate-pulse z-0" />
          <div className="relative z-10 space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              👋 Welcome back, <span className="text-blue-600 dark:text-blue-400">Admin</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Here's a bird’s-eye view of your institution’s activity, stats, and updates.
            </p>
          </div>
        </motion.header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {statCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.05 }}
            >
              <StatCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate to management areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickActionCard icon={<Users className="text-blue-500" />} title="Manage Users" description="Add, edit, or suspend users" to="/admin/users" />
              <QuickActionCard icon={<BookOpen className="text-purple-500" />} title="Manage Courses" description="Curriculum & batch control" to="/admin/courses" />
              <QuickActionCard icon={<Settings className="text-slate-500" />} title="System Settings" description="Platform configurations" to="/admin/settings" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 bg-white/30 dark:bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle>Recent Notices</CardTitle>
              <CardDescription>Latest announcements</CardDescription>
            </CardHeader>
            <CardContent>
              {recentNotices.length > 0 ? (
                <ul className="space-y-5">
                  {recentNotices.slice(0, 4).map((notice) => (
                    <motion.li
                      key={notice._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="flex items-start space-x-3 hover:scale-[1.02] transition-transform"
                    >
                      <Bell className="h-5 w-5 text-amber-500 mt-1 animate-pulse" />
                      <div className="bg-white/50 dark:bg-slate-800/30 p-3 rounded-xl shadow-inner">
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {notice.title}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                          {notice.content.substring(0, 100)}...
                        </p>
                        <span className="text-xs text-slate-400">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-slate-500 py-8">No recent notices found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;