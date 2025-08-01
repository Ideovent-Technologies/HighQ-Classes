import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";
import {
    BookOpen,
    Clock,
    Users,
    Bell,
    FileText,
    DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
    const { state } = useAuth();
    const user = state.user;
    const location = useLocation();

    const renderDashboard = (): React.ReactNode => {
        switch (user?.role) {
            //   case "student":
            //     return <StudentDashboard />;
            case "teacher":
                return <TeacherDashboard />;
            //   case "admin":
            //     return <AdminDashboard />;
            default:
                return <div>Unknown user role</div>;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>

                {renderDashboard()}
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
