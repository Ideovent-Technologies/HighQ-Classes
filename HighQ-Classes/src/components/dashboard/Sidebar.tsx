import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
    Home,
    BookOpen,
    Users,
    FileText,
    Bell,
    Settings,
    LogOut,
    User,
    Upload,
    DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const baseNavItemStyle =
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group";

    const navItem = (path: string, icon: JSX.Element, label: string) => (
        <li key={path}>
            <Link
                to={path}
                className={clsx(
                    baseNavItemStyle,
                    isActive(path)
                        ? "bg-gradient-to-r from-teal-200 via-white to-navy-100 text-navy-800 font-semibold shadow-inner border-l-4 border-teal-500"
                        : "text-gray-600 hover:bg-white hover:border-l-4 hover:border-teal-400 hover:pl-5"
                )}
            >
                {icon}
                <span className="tracking-wide group-hover:scale-105 transition-transform duration-300">
                    {label}
                </span>
            </Link>
        </li>
    );

    const iconClass = "h-5 w-5";

    const commonItems = [
        navItem("/dashboard", <Home className={iconClass} />, "Dashboard"),
        navItem("/profile", <User className={iconClass} />, "Profile"),
        navItem(
            "/dashboard/notices",
            <Bell className={iconClass} />,
            "Notices"
        ),
    ];

    const teacherItems = [
        navItem(
            "/dashboard/materials",
            <Upload className={iconClass} />,
            "Study Materials"
        ),
        navItem(
            "/dashboard/my-students",
            <Users className={iconClass} />,
            "My Students"
        ),
        navItem(
            "/dashboard/recordings",
            <FileText className={iconClass} />,
            "Recordings"
        ),
        navItem(
            "/dashboard/schedule",
            <BookOpen className={iconClass} />,
            "My Schedule"
        ),
        navItem(
            "/dashboard/attendance",
            <FileText className={iconClass} />,
            "Attendance"
        ),
        navItem(
            "/dashboard/assignments",
            <FileText className={iconClass} />,
            "Assignments"
        ),
    ];

    const studentItems = [
        navItem(
            "/dashboard/fee-status",
            <DollarSign className={iconClass} />,
            "Fee Status"
        ),
        navItem(
            "/student/materials",
            <FileText className={iconClass} />,
            "Study Materials"
        ),
        navItem(
            "/student/recordings",
            <FileText className={iconClass} />,
            "Recordings"
        ),
        navItem(
            "/student/assignments",
            <FileText className={iconClass} />,
            "Assignments"
        ),
        // navItem(
        //     "/student/profile",
        //     <User className={iconClass} />,
        //     "My Profile"
        // ),
        navItem(
            "/dashboard/schedule",
            <BookOpen className={iconClass} />,
            "Schedule"
        ),
    ];

    const adminItems = [
        navItem(
            "/dashboard/all-students",
            <Users className={iconClass} />,
            "All Students"
        ),
        navItem(
            "/dashboard/manage-notices",
            <Bell className={iconClass} />,
            "Manage Notices"
        ),
        navItem(
            "/dashboard/fee-management",
            <DollarSign className={iconClass} />,
            "Fee Management"
        ),
        navItem(
            "/dashboard/schedule-management",
            <BookOpen className={iconClass} />,
            "Schedule Management"
        ),
        navItem(
            "/admin/materials",
            <FileText className={iconClass} />,
            "Materials Management"
        ),
        navItem(
            "/admin/attendance",
            <FileText className={iconClass} />,
            "Attendance Management"
        ),
        navItem(
            "/admin/assignments",
            <FileText className={iconClass} />,
            "Assignment Management"
        ),
    ];

    let roleBasedItems: JSX.Element[] = [];
    if (user?.role === "teacher") roleBasedItems = teacherItems;
    else if (user?.role === "student") roleBasedItems = studentItems;
    else if (user?.role === "admin") roleBasedItems = adminItems;

  return (
    <div className="h-screen bg-white/60 backdrop-blur-xl border-r border-slate-200 w-[270px] flex flex-col shadow-xl">
      {/* Brand */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-center">
        <Link to="/" className="text-3xl font-bold text-navy-700 tracking-tight">
          <span className="text-teal-500">High</span>Q
        </Link>
      </div>

            {/* User Info */}
            <div className="p-5 border-b border-slate-200 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-500 to-navy-600 flex items-center justify-center text-white font-bold text-lg shadow">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-navy-800">{user?.name}</p>
                    <p className="text-xs capitalize text-gray-500">
                        {user?.role}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <ul className="space-y-1">
                    {[...commonItems, ...roleBasedItems]}
                </ul>

                {/* Settings & Logout */}
                <div className="pt-8 border-t mt-8 space-y-1 list-none">
                    <div>
                        <Link
                            to="/dashboard/settings"
                            className={clsx(
                                baseNavItemStyle,
                                isActive("/dashboard/settings")
                                    ? "bg-gradient-to-r from-teal-200 via-white to-navy-100 text-navy-800 font-semibold border-l-4 border-teal-500"
                                    : "text-gray-600 hover:bg-white hover:border-l-4 hover:border-teal-400 hover:pl-5"
                            )}
                        >
                            <Settings className={iconClass} />
                            <span>Settings</span>
                        </Link>
                    </div>
                    <div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={logout}
                        >
                            <LogOut className={iconClass + " mr-3"} />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
