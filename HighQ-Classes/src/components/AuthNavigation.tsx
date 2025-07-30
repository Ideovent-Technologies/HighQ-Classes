import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthNavigation: React.FC = () => {
    const { state, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    if (!state.isAuthenticated || !state.user) {
        return (
            <div className="flex space-x-4">
                <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                    Register
                </Link>
            </div>
        );
    }

    const getDashboardLink = () => {
        const dashboardRoutes = {
            student: "/student/dashboard",
            teacher: "/teacher/dashboard",
            admin: "/admin/dashboard",
        };
        return (
            dashboardRoutes[state.user.role as keyof typeof dashboardRoutes] ||
            "/dashboard"
        );
    };

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
                Welcome, {state.user.name}
            </span>
            <Link
                to={getDashboardLink()}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
                Dashboard
            </Link>
            <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
                Profile
            </Link>
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
                Logout
            </button>
        </div>
    );
};

export default AuthNavigation;
