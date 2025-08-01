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
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group";

  const navItem = (path: string, icon: JSX.Element, label: string) => (
    <li key={path}>
      <Link
        to={path}
        className={clsx(
          baseNavItemStyle,
          isActive(path)
            ? "bg-gradient-to-r from-teal-100 to-navy-100 text-navy-700 font-semibold shadow"
            : "text-gray-600 hover:bg-navy-50 hover:pl-5"
        )}
      >
        {icon}
        <span className="tracking-wide">{label}</span>
      </Link>
    </li>
  );

  const iconClass = "h-5 w-5";

  const commonItems = [
    navItem("/dashboard", <Home className={iconClass} />, "Dashboard"),
    navItem("/dashboard/profile", <User className={iconClass} />, "Profile"),
    navItem("/dashboard/notices", <Bell className={iconClass} />, "Notices"),
  ];

  const teacherItems = [
    navItem("/dashboard/upload-materials", <Upload className={iconClass} />, "Upload Materials"),
    navItem("/dashboard/my-students", <Users className={iconClass} />, "My Students"),
    navItem("/dashboard/recordings", <FileText className={iconClass} />, "Recordings"),
    navItem("/dashboard/schedule", <BookOpen className={iconClass} />, "My Schedule"),
  ];

  const studentItems = [
    navItem("/dashboard/fee-status", <DollarSign className={iconClass} />, "Fee Status"),
    navItem("/dashboard/study-materials", <FileText className={iconClass} />, "Study Materials"),
    navItem("/dashboard/recordings", <FileText className={iconClass} />, "Recordings"),
    navItem("/dashboard/schedule", <BookOpen className={iconClass} />, "Schedule"),
  ];

  const adminItems = [
    navItem("/dashboard/all-students", <Users className={iconClass} />, "All Students"),
    navItem("/dashboard/manage-notices", <Bell className={iconClass} />, "Manage Notices"),
    navItem("/dashboard/fee-management", <DollarSign className={iconClass} />, "Fee Management"),
    navItem("/dashboard/schedule-management", <BookOpen className={iconClass} />, "Schedule Management"),
  ];

  let roleBasedItems: JSX.Element[] = [];
  if (user?.role === "teacher") roleBasedItems = teacherItems;
  else if (user?.role === "student") roleBasedItems = studentItems;
  else if (user?.role === "admin") roleBasedItems = adminItems;

  return (
    <div className="h-screen bg-white/70 backdrop-blur-md border-r border-slate-200 w-[270px] flex flex-col">
      {/* Header Brand */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-center">
        <Link to="/" className="text-2xl font-bold text-navy-600">
          <span className="text-teal-500">Bloom</span>Scholar
        </Link>
      </div>

      {/* User Info */}
      <div className="p-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-navy-500 to-teal-500 flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-navy-700">{user?.name}</p>
          <p className="text-xs capitalize text-gray-500">{user?.role}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">{[...commonItems, ...roleBasedItems]}</ul>

        {/* Bottom Settings */}
        <div className="pt-8 border-t mt-8 space-y-1">
          <li>
            <Link
              to="/dashboard/settings"
              className={clsx(
                baseNavItemStyle,
                isActive("/dashboard/settings")
                  ? "bg-gradient-to-r from-teal-100 to-navy-100 text-navy-700 font-semibold"
                  : "text-gray-600 hover:bg-navy-50 hover:pl-5"
              )}
            >
              <Settings className={iconClass} />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={logout}
            >
              <LogOut className={iconClass + " mr-3"} />
              <span>Logout</span>
            </Button>
          </li>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
