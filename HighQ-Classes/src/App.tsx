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

// Student dashboard nested pages
import StudentDashboard from "@/components/dashboard/student/StudentDashboard";
import NoticesPage from "@/components/student/NoticesPage";
import AttendancePage from "@/components/student/AttendancePage";
import RecordingsPage from "@/components/student/RecordingsPage";
import SchedulePage from "@/components/student/SchedulePage";
import ProfilePage from "@/components/student/ProfilePage";

// Fee Management pages
import StudentFeeStatus from "@/modules/fees/FeeStatus";
import AdminFeeDashboard from "@/modules/fees/AdminFeeDashboard";

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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

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
              />

              {/* -------------------- Student Dashboard Routing with nested routes -------------------- */}
              <Route
                path="/student/dashboard/*"
                element={
                  <ProtectedRoute roles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={
                  // Optionally, you can create and import a DashboardHome component for student dashboard default view
                  <div>
                    <h2>Welcome to your Student Dashboard</h2>
                    <p>Please select a section from the sidebar.</p>
                  </div>
                } />
                <Route path="notices" element={<NoticesPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="recordings" element={<RecordingsPage />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Other Student Dashboard Dashboard related routes */}
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
                  <ProtectedRoute roles={["teacher", "admin"]}>
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
                path="/dashboard/all-students"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <AllStudents />
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
