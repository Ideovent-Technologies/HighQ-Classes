import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

import TeacherDashboard from "@/components/dashboard/teacher/TeacherDashboard";
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";

const Dashboard = () => {
  const { state } = useAuth();
  const user = state.user;
  const location = useLocation();

  const renderDashboard = (): React.ReactNode => {
    switch (user?.role) {
      case "student":
        return <StudentDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {renderDashboard()}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
