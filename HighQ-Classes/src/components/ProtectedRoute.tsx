import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    roles,
    redirectTo = "/login",
}) => {
    const { state } = useAuth();
    const location = useLocation();

    // Show loading if auth is still being checked
    if (state.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!state.isAuthenticated || !state.user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access if roles are specified
    if (roles && roles.length > 0) {
        if (!roles.includes(state.user.role)) {
            // Redirect to appropriate dashboard based on user role
            const dashboardRoutes = {
                student: "/student/dashboard",
                teacher: "/teacher/dashboard",
                admin: "/admin/dashboard",
            };

            const userDashboard =
                dashboardRoutes[
                    state.user.role as keyof typeof dashboardRoutes
                ];
            return <Navigate to={userDashboard || "/unauthorized"} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
