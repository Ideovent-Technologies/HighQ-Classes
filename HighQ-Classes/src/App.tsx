import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Import layout and auth components
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
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

// Import dashboard pages
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
import CourseDetail from "@/components/dashboard/courses/CourseDetails";
import BatchManagementPage from "./pages/batch/Batch-management";

// Import Fee Management pages
import StudentFeeStatus from "@/modules/fees/FeeStatus";
import AdminFeeDashboard from "@/modules/fees/AdminFeeDashboard";
import BatchDetails from "./components/dashboard/batch/BatchDetsils";
import StudentDashboardTest from "@/components/debug/StudentDashboardTest";
import ComprehensiveTest from "@/components/debug/ComprehensiveTest";

// Import Attendance and Assignment Management pages
import AttendanceManagementPage from "@/pages/AttendanceManagementPage";
import AssignmentManagementPage from "@/pages/AssignmentManagementPage";

// Import Enhanced Management pages
import EnhancedMaterialsManagementPage from "@/pages/EnhancedMaterialsManagementPage";
import TeacherRecordingManagementPage from "@/pages/TeacherRecordingManagementPage";
import StudentRecordingsPage from "@/pages/StudentRecordingsPage";

// Import Student-specific pages
import StudentProfile from "@/pages/student/StudentProfile";

// Import Admin-specific pages
import AdminAnnouncementPage from "@/components/dashboard/admin/AdminAnnouncementPage";
import ManageNotices from "@/pages/dashboard/ManageNotices";
import FeeManagement from "@/pages/dashboard/FeeManagement";
import ScheduleManagement from "@/pages/dashboard/ScheduleManagement";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <Routes>
                            {/* Public pages */}
                            <Route
                                path="/"
                                element={
                                    <Layout>
                                        <Home />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/services"
                                element={
                                    <Layout>
                                        <Services />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/contact"
                                element={
                                    <Layout>
                                        <Contact />
                                    </Layout>
                                }
                            />
                            <Route
                                path="/about"
                                element={
                                    <Layout>
                                        <About />
                                    </Layout>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/test-dashboard"
                                element={<StudentDashboardTest />}
                            />
                            <Route
                                path="/test-comprehensive"
                                element={<ComprehensiveTest />}
                            />
                            <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
                            />
                            <Route
                                path="/reset-password"
                                element={<ResetPassword />}
                            />
                            {/* Protected auth pages */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Protected dashboard pages - accessible to all authenticated users */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />{" "}
                            {/* Student-specific routes */}
                            <Route
                                path="/student/dashboard"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/fee-status"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <FeeStatus />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/study-materials"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <StudyMaterials />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/profile"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <StudentProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/recordings"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <StudentRecordingsPage userRole="student" />
                                    </ProtectedRoute>
                                }
                            />
                            {/* -------------------- Teacher-specific routes -------------------- */}
                            <Route
                                path="/teacher/dashboard"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/my-students"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <MyStudents />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/upload-materials"
                                element={
                                    <ProtectedRoute
                                        roles={["teacher", "admin"]}
                                    >
                                        <UploadMaterials />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/schedule"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <Schedule />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/recordings"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <Recordings />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/batches"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <Batches />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/notices"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <Notices />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Admin-specific routes */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/announcements"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <AdminAnnouncementPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/manage-notices"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <ManageNotices />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/fee-management"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <FeeManagement />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/schedule-management"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <ScheduleManagement />
                                    </ProtectedRoute>
                                }
                            />
                            {/* <Route path="/admin/dashboard" element={<Dashboard />}/>
                             */}
                            <Route
                                path="/dashboard/all-students"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <AllStudents />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/teachers/add"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <TeacherForm />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/batches/add"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <BatchForm />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/batches/:batchId"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <BatchDetails />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/batches/manage"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <BatchManagementPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/teachers/manage"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <TeacherManagementPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/courses/manage"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <CourseManagementPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard/courses/:id"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <CourseDetail />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Attendance Management Routes */}
                            <Route
                                path="/dashboard/attendance"
                                element={
                                    <ProtectedRoute
                                        roles={["teacher", "admin"]}
                                    >
                                        <AttendanceManagementPage userRole="teacher" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/attendance"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <AttendanceManagementPage userRole="admin" />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Assignment Management Routes */}
                            <Route
                                path="/dashboard/assignments"
                                element={
                                    <ProtectedRoute
                                        roles={["teacher", "admin"]}
                                    >
                                        <AssignmentManagementPage userRole="teacher" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/assignments"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <AssignmentManagementPage userRole="admin" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/assignments"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <AssignmentManagementPage userRole="student" />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Enhanced Materials Management Routes */}
                            <Route
                                path="/dashboard/materials"
                                element={
                                    <ProtectedRoute
                                        roles={["teacher", "admin"]}
                                    >
                                        <EnhancedMaterialsManagementPage userRole="teacher" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/materials"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <EnhancedMaterialsManagementPage userRole="admin" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/materials"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <EnhancedMaterialsManagementPage userRole="student" />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Recording Management Routes */}
                            <Route
                                path="/dashboard/recordings"
                                element={
                                    <ProtectedRoute
                                        roles={["teacher", "admin"]}
                                    >
                                        <TeacherRecordingManagementPage teacherId="current-teacher-id" />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/student/recordings"
                                element={
                                    <ProtectedRoute roles={["student"]}>
                                        <StudentRecordingsPage userRole="student" />
                                    </ProtectedRoute>
                                }
                            />
                            {/* 404 Page */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </TooltipProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
};

export default App;
