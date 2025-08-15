import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

// Import layout and auth components (keep these as direct imports for performance)
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load pages for better performance
const Home = React.lazy(() => import("@/pages/Home"));
const Services = React.lazy(() => import("@/pages/Services"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const Login = React.lazy(() => import("@/pages/auth/Login"));
const Register = React.lazy(() => import("@/pages/auth/Register"));
const Profile = React.lazy(() => import("@/pages/auth/Profile"));
const ForgotPassword = React.lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("@/pages/auth/ResetPassword"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const About = React.lazy(() => import("./pages/About"));
const TicketList = React.lazy(
    () => import("@/components/dashboard/ticket/TicketList")
);

const TicketDetails = React.lazy(
    () => import("@/components/dashboard/ticket/TicketDetails")
);

// Lazy load dashboard pages
const Dashboard = React.lazy(() => import("@/pages/dashboard/Dashboard"));
const FeeStatus = React.lazy(() => import("@/pages/dashboard/FeeStatus"));
const StudyMaterials = React.lazy(
    () => import("@/pages/dashboard/StudyMaterials")
);
const AllStudents = React.lazy(() => import("@/pages/dashboard/AllStudents"));
const Settings = React.lazy(() => import("./pages/dashboard/ContactAdmin"));

// Lazy load teacher components
const MyStudents = React.lazy(
    () => import("@/components/dashboard/teacher/MyStudents")
);
const UploadMaterials = React.lazy(
    () => import("@/components/dashboard/teacher/UploadMaterials")
);
const Schedule = React.lazy(
    () => import("@/components/dashboard/teacher/Schedule")
);
const Recordings = React.lazy(
    () => import("@/components/dashboard/teacher/Recordings")
);
const Batches = React.lazy(
    () => import("@/components/dashboard/teacher/Batches")
);
const Notices = React.lazy(
    () => import("@/components/dashboard/teacher/Notices")
);
const TeacherForm = React.lazy(
    () => import("@/components/dashboard/teacher/TeacherForm")
);
const TeacherManagementPage = React.lazy(
    () => import("./pages/teacher/Teacher-Management")
);
const CourseManagementPage = React.lazy(
    () => import("./pages/course/Course-management")
);
const CourseDetail = React.lazy(
    () => import("@/components/dashboard/courses/CourseDetails")
);
const BatchManagementPage = React.lazy(
    () => import("./pages/batch/Batch-management")
);
const EditBatchPage = React.lazy(() => import("./pages/batch/EditBatchPage"));

// Lazy load fee management pages
const StudentFeeStatus = React.lazy(() => import("@/modules/fees/FeeStatus"));
const AdminFeeDashboard = React.lazy(
    () => import("@/components/admin/AdminFeeDashboard")
);
const BatchDetails = React.lazy(
    () => import("./components/dashboard/batch/BatchDetsils")
);
const StudentDashboardTest = React.lazy(
    () => import("@/components/debug/StudentDashboardTest")
);
const ComprehensiveTest = React.lazy(
    () => import("@/components/debug/ComprehensiveTest")
);

// Lazy load attendance and assignment management pages
const AttendanceManagementPage = React.lazy(
    () => import("@/pages/AttendanceManagementPage")
);
const AssignmentManagementPage = React.lazy(
    () => import("@/pages/AssignmentManagementPage")
);

// Lazy load enhanced management pages
const EnhancedMaterialsManagementPage = React.lazy(
    () => import("@/pages/EnhancedMaterialsManagementPage")
);
const TeacherRecordingManagementPage = React.lazy(
    () => import("@/pages/TeacherRecordingManagementPage")
);
const StudentRecordingsPage = React.lazy(
    () => import("@/pages/StudentRecordingsPage")
);

// Lazy load student-specific pages
const StudentProfile = React.lazy(
    () => import("@/pages/student/StudentProfile")
);
const MyMaterials = React.lazy(() => import("@/pages/student/MyMaterials"));
const MyClasses = React.lazy(() => import("@/pages/student/MyClasses"));
const MyFees = React.lazy(() => import("@/pages/student/MyFees"));
const StudentFeeDashboard = React.lazy(
    () => import("@/components/student/StudentFeeDashboard")
);
const StudentNotices = React.lazy(
    () => import("@/pages/student/StudentNotices")
);
const StudentAssignments = React.lazy(
    () => import("@/pages/student/StudentAssignments")
);
const AddStudentForm = React.lazy(
    () => import("./components/dashboard/student/StudentForm"));
const StudentAttendance = React.lazy(
    () => import("@/pages/student/StudentAttendance")
);

// Lazy load student batch components
const StudentBatch = React.lazy(() => import("@/pages/student/StudentBatch"));
const StudentMaterials = React.lazy(
    () => import("@/pages/student/StudentMaterials")
);

// Lazy load admin-specific pages
const AdminDashboard = React.lazy(
    () => import("@/components/dashboard/admin/AdminDashboard")
);
const AdminProfile = React.lazy(() => import("@/pages/admin/AdminProfile"));
const AdminAnnouncementPage = React.lazy(
    () => import("@/components/dashboard/admin/AdminAnnouncementPage")
);
const ManageNotices = React.lazy(
    () => import("@/pages/dashboard/ManageNotices")
);
const ScheduleManagement = React.lazy(
    () => import("@/pages/dashboard/ScheduleManagement")
);
const AddStudentsToBatchPage = React.lazy(
    () => import("./pages/batch/Addstudentpage")
);
const CourseForm = React.lazy(
    () => import("./components/dashboard/courses/CourseForm")
);
const PendingApprovalPage = React.lazy(
    () => import("./pages/admin/PendingApproval")
);
const AdminContactMessages = React.lazy(
    () => import("./pages/admin/AdminContactMessages")
);
const AdminStudentTeacherMessages = React.lazy(
    () => import("./pages/admin/AdminStudentTeacherMessages")
);
const BatchForm = React.lazy(
    () => import("./components/dashboard/batch/BatchForm")
);
const ActiveUserPage = React.lazy(() => import("@/pages/admin/ActiveUser"));

const CustomerSupport = React.lazy(
    () => import("@/components/dashboard/admin/CustomerSupport")
);

const UserSupport = React.lazy(
    () => import("@/components/dashboard/admin/UserSupport")
);

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <Suspense fallback={<LoadingSpinner />}>
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
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
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
                                    path="/dashboard/UserSupport"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <TicketList />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/batch"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentBatch />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/materials"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentMaterials />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/classes"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <MyClasses />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/fees"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentFeeDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/notices"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentNotices />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/assignments"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentAssignments />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/attendance"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentAttendance />
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
                                <Route
                                    path="/dashboard/contact-admin"
                                    element={
                                        <ProtectedRoute
                                            roles={["student", "teacher"]}
                                        >
                                            <Settings />
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
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/profile"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <AdminProfile />
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
                                    path="/admin/tickets/:id"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <TicketDetails />
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
                                            <AdminFeeDashboard />
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
                                <Route
                                    path="/admin/contact-messages"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <AdminContactMessages />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/student-teacher-messages"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <AdminStudentTeacherMessages />
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
                                    path="/dashbaord/batches/add-student"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <AddStudentsToBatchPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/batches/edit/:batchId"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <EditBatchPage />
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
                                    path="/dashboard/teacher-management"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <TeacherManagementPage />
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
                                    path="/dashboard/course-management"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <CourseManagementPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/courses/add"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <CourseForm />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/courses/:id/edit"
                                    element={<CourseForm />}
                                />
                                <Route
                                    path="/dashboard/courses/add"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <CourseForm />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/courses/:id/edit"
                                    element={<CourseForm />}
                                />
                                <Route
                                    path="/admin/approvals"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <PendingApprovalPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/analytics"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <ActiveUserPage />
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
                                path="/dashboard/students/add"
                                element={
                                    <ProtectedRoute roles={["admin"]}>
                                        <AddStudentForm />
                                    </ProtectedRoute>
                                }/>
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
                                            <AssignmentManagementPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/assignments"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <AssignmentManagementPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/student/assignments"
                                    element={
                                        <ProtectedRoute roles={["student"]}>
                                            <StudentAssignments />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/CustomerSupport"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <CustomerSupport />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard/UserSupport"
                                    element={
                                        <ProtectedRoute roles={["admin"]}>
                                            <UserSupport />
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
                        </Suspense>
                    </TooltipProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
};

export default App;
