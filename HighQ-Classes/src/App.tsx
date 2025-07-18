
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Import layout
import Layout from "@/components/Layout";

// Import pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

// Import dashboard pages
import Dashboard from "@/pages/dashboard/Dashboard";
import FeeStatus from "@/pages/dashboard/FeeStatus";
import StudyMaterials from "@/pages/dashboard/StudyMaterials";
import AllStudents from "@/pages/dashboard/AllStudents";
import UploadMaterials from "@/pages/dashboard/UploadMaterials";

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
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard pages */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/fee-status" element={<FeeStatus />} />
              <Route path="/dashboard/study-materials" element={<StudyMaterials />} />
              <Route path="/dashboard/all-students" element={<AllStudents />} />
              <Route path="/dashboard/upload-materials" element={<UploadMaterials />} />
              
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
