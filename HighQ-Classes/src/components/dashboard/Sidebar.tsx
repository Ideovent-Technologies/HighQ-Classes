import { useEffect, useState } from "react";
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
    Megaphone,
    GraduationCap,
    UserCheck,
    Building,
    X,
    ClipboardCheck,
    MessageSquare,
    UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
}

const Sidebar = ({ isOpen, onClose, isMobile }: SidebarProps) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobile) {
            document.body.style.overflow = isOpen ? "hidden" : "";
        }
        return () => {
            // Clean up scroll lock on unmount
            document.body.style.overflow = "";
        };
    }, [isOpen, isMobile]);

    const isActive = (path: string) => location.pathname === path;
    const iconClass = "h-5 w-5 shrink-0";

    // Helper function to create a navigation item
    const createNavItem = (path: string, Icon: any, label: string) => (
        <li key={path}>
            <motion.div whileHover={{ x: 4 }}>
                <Link
                    to={path}
                    className={clsx(
                        "flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200",
                        isActive(path)
                            ? "bg-teal-500 text-white shadow-md font-semibold"
                            : "text-slate-600 hover:bg-slate-100"
                    )}
                    onClick={isMobile ? onClose : undefined}
                >
                    <Icon
                        className={clsx(
                            iconClass,
                            isActive(path)
                                ? ""
                                : "text-slate-400 group-hover:text-slate-600 mr-3"
                        )}
                    />
                    <span
                        className={clsx("ml-3", isActive(path) && "text-white")}
                    >
                        {label}
                    </span>
                </Link>
            </motion.div>
        </li>
    );

    const commonItems = [
        createNavItem(
            user?.role === "admin" ? "/admin/dashboard" : "/dashboard",
            Home,
            "Dashboard"
        ),
        createNavItem(
            user?.role === "admin" ? "/admin/profile" : "/profile",
            User,
            "Profile"
        ),
        createNavItem(
            user?.role === "student"
                ? "/student/notices"
                : "/dashboard/notices",
            Bell,
            "Notices"
        ),
    ];

    const teacherItems = [
        createNavItem("/dashboard/materials", Upload, "Study Materials"),
        createNavItem("/dashboard/my-students", Users, "My Students"),
        createNavItem("/dashboard/recordings", FileText, "Recordings"),
        createNavItem("/dashboard/schedule", BookOpen, "My Schedule"),
        createNavItem("/dashboard/attendance", ClipboardCheck, "Attendance"),
        createNavItem("/dashboard/assignments", FileText, "Assignments"),
        createNavItem("/dashboard/contact-admin", Settings, "Contact Admin"),
    ];

    const studentItems = [
        createNavItem("/student/batch", GraduationCap, "My Batch"),
        createNavItem("/student/materials", FileText, "Study Materials"),
        createNavItem("/student/classes", BookOpen, "My Classes"),
        createNavItem("/student/recordings", FileText, "Video Lectures"),
        createNavItem("/student/assignments", FileText, "My Assignments"),
        createNavItem("/student/attendance", Users, "My Attendance"),
        createNavItem("/student/fees", DollarSign, "Fee Details"),
        createNavItem("/dashboard/contact-admin", Settings, "Contact Admin"),
    ];

    const adminItems = [
        createNavItem("/dashboard/all-students", Users, "All Students"),
        createNavItem(
            "/dashboard/teacher-management",
            UserCheck,
            "Manage Teachers"
        ),
        createNavItem(
            "/dashboard/course-management",
            GraduationCap,
            "Manage Courses"
        ),
        createNavItem("/dashboard/batches/manage", Building, "Manage Batches"),
        createNavItem("/dashboard/batches/add", Building, "Create Batch"),
        createNavItem("/dashboard/manage-notices", Bell, "Manage Notices"),
        createNavItem("/admin/announcements", Megaphone, "Announcements"),
        createNavItem(
            "/dashboard/fee-management",
            DollarSign,
            "Fee Management"
        ),
        createNavItem(
            "/dashboard/schedule-management",
            BookOpen,
            "Schedule Management"
        ),
        createNavItem("/admin/materials", FileText, "Materials Management"),
        createNavItem(
            "/admin/attendance",
            ClipboardCheck,
            "Attendance Management"
        ),
        createNavItem("/admin/assignments", FileText, "Assignment Management"),
        createNavItem(
            "/admin/contact-messages",
            MessageSquare,
            "Contact Messages"
        ),
        createNavItem(
            "/admin/student-teacher-messages",
            UserCog,
            "Student/Teacher Messages"
        ),
        createNavItem(
            "/dashboard/CustomerSupport",
            Settings,
            "Customer Support"
        ),
        createNavItem("/dashboard/UserSupport", FileText, "User Support"),
    ];

    let roleBasedItems: JSX.Element[] = [];
    if (user?.role === "teacher") roleBasedItems = teacherItems;
    else if (user?.role === "student") roleBasedItems = studentItems;
    else if (user?.role === "admin") roleBasedItems = adminItems;

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {(isOpen || !isMobile) && (
                    <motion.aside
                        initial={{ x: isMobile ? "-100%" : 0 }}
                        animate={{ x: 0 }}
                        exit={{ x: isMobile ? "-100%" : 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                        }}
                        className={clsx(
                            "top-0 left-0 bg-white/95 backdrop-blur-lg border-r border-slate-200 flex flex-col shadow-2xl z-50",
                            isMobile
                                ? "fixed h-full w-64"
                                : "static h-screen w-64"
                        )}
                    >
                        {/* Brand & Close */}
                        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                            <Link
                                to="/"
                                className="text-2xl font-extrabold text-navy-700"
                            >
                                <span className="text-teal-500">High</span>Q
                            </Link>
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="p-5 border-b border-slate-200 flex items-center gap-3 hover:bg-white/60 rounded-lg">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-500 to-navy-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="truncate">
                                <p className="font-semibold text-navy-800 truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs capitalize text-gray-500 truncate">
                                    {user?.role}
                                </p>
                            </div>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <ul className="space-y-1">
                                {[...commonItems, ...roleBasedItems]}
                            </ul>

                            {/* Settings & Logout */}
                            <div className="pt-8 border-t mt-8 space-y-1 list-none">
                                <motion.div whileHover={{ x: 4 }}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
                                        onClick={logout}
                                    >
                                        <LogOut
                                            className={iconClass + " mr-3"}
                                        />
                                        <span>Logout</span>
                                    </Button>
                                </motion.div>
                            </div>
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
