
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Public pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/auth/Profile";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import NotFound from "@/pages/NotFound";
import About from "./pages/About";

// Dashboard pages
import Dashboard from "@/pages/dashboard/Dashboard";
import FeeStatus from "@/pages/dashboard/FeeStatus";
import StudyMaterials from "@/pages/dashboard/StudyMaterials";
import AllStudents from "@/pages/dashboard/AllStudents";
// import UploadMaterials from "@/pages/dashboard/UploadMaterials";
import MyStudents from "@/components/dashboard/teacher/MyStudents";
import UploadMaterials from "@/components/dashboard/teacher/UploadMaterials";
import Schedule from "@/components/dashboard/teacher/Schedule";
import Recordings from "@/components/dashboard/teacher/Recordings";
import Batches from "@/components/dashboard/teacher/Batches";
import Notices from "@/components/dashboard/teacher/Notices";
import TeacherForm from "@/components/dashboard/teacher/TeacherForm";
import BatchForm from "@/components/dashboard/batch/BatchForm";
import TeacherManagementPage from "./pages/teacher/Teacher-Management";
import CourseManagementPage from "./pages/course/Course-management";



// Import Fee Management pages
import StudentFeeStatus from "@/modules/fees/FeeStatus";
import AdminFeeDashboard from "@/modules/fees/AdminFeeDashboard";

// Class Recordings
import StudentRecordings from "@/modul/recordings/StudentRecordings";
import TeacherRecording from "@/modul/recordings/TeacherRecording";
import RecordingCard from "@/modul/recordings/RecordingCard"; // ✅ Add this import

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (

  );
};

export default App;



