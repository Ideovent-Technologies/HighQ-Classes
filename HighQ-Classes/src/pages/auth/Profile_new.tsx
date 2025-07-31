import React from "react";
import { useAuth } from "../../hooks/useAuth";
import StudentProfile from "../student/StudentProfile";
import TeacherProfile from "../teacher/TeacherProfile";
import AdminProfile from "../admin/AdminProfile";

const Profile: React.FC = () => {
    const { state } = useAuth();
    const user = state.user;

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Route to role-specific profile component
    switch (user.role) {
        case "student":
            return <StudentProfile />;
        case "teacher":
            return <TeacherProfile />;
        case "admin":
            return <AdminProfile />;
        default:
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Unknown User Role
                        </h2>
                        <p className="text-gray-600">
                            Unable to determine the appropriate profile page for
                            role: {user.role}
                        </p>
                    </div>
                </div>
            );
    }
};

export default Profile;
