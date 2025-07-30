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
import NotFound from "@/pages/NotFound";
import About from "./pages/About";

// Import dashboard pages
import Dashboard from "@/pages/dashboard/Dashboard";
import FeeStatus from "@/pages/dashboard/FeeStatus";
import StudyMaterials from "@/pages/dashboard/StudyMaterials";
import AllStudents from "@/pages/dashboard/AllStudents";
import UploadMaterials from "@/pages/dashboard/UploadMaterials";

// Import Fee Management pages
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
                            <Route
                                path="/forgot-password"
                                element={<ForgotPassword />}
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

                            {/* Teacher-specific routes */}
                            <Route
                                path="/teacher/dashboard"
                                element={
                                    <ProtectedRoute roles={["teacher"]}>
                                        <Dashboard />
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
