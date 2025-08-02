
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



// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/hooks/useAuth";

// // Layout and Static
// import Layout from "@/components/Layout";

// // Public pages
// import Home from "@/pages/Home";
// import Services from "@/pages/Services";
// import Contact from "@/pages/Contact";
// import Login from "@/pages/Login";
// import Register from "@/pages/Register";
// import NotFound from "@/pages/NotFound";

// // Dashboard pages
// import Dashboard from "@/pages/dashboard/Dashboard";
// import FeeStatus from "@/pages/dashboard/FeeStatus";
// import StudyMaterials from "@/pages/dashboard/StudyMaterials";
// import AllStudents from "@/pages/dashboard/AllStudents";
// import UploadMaterials from "@/pages/dashboard/UploadMaterials";

// // Class Recordings
// import StudentRecordings from "@/modul/recordings/StudentRecordings";
// import TeacherRecording from "@/modul/recordings/TeacherRecording";
// import RecordingCard from "@/modul/recordings/RecordingCard";
// import RecordingWatchPage from "./modul/recordings/RecordingCard"; // ✅ Added

// const queryClient = new QueryClient();

// const App: React.FC = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Router>
//         <QueryClientProvider client={queryClient}>
//           <AuthProvider>
//             <TooltipProvider>
//               <Toaster />
//               <Sonner />

//               <Routes>
//                 {/* Public routes */}
//                 <Route path="/" element={<Layout><Home /></Layout>} />
//                 <Route path="/services" element={<Layout><Services /></Layout>} />
//                 <Route path="/contact" element={<Layout><Contact /></Layout>} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />

//                 {/* Dashboard routes */}
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/dashboard/fee-status" element={<FeeStatus />} />
//                 <Route path="/dashboard/study-materials" element={<StudyMaterials />} />
//                 <Route path="/dashboard/all-students" element={<AllStudents />} />
//                 <Route path="/dashboard/upload-materials" element={<UploadMaterials />} />

//                 {/* Recordings routes */}
//                 <Route path="/recordings" element={<StudentRecordings />} />
//                 <Route path="/recordings/watch/:id" element={<RecordingWatchPage />} />
//                 <Route path="/recordings/teacher" element={<TeacherRecording />} />

//                 {/* Optional test route */}
//                 <Route
//                   path="/recordings/card"
//                   element={
//                     <div className="p-10">
//                       <RecordingCard
//                         title="Test Recording"
//                         subject="Physics"
//                         date="2025-07-23"
//                         fileUrl="https://example.com/video.mp4"
//                         views={120}
//                       />
//                     </div>
//                   }
//                 />

//                 {/* 404 fallback */}
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </TooltipProvider>
//           </AuthProvider>
//         </QueryClientProvider>
//       </Router>
//     </div>
//   );
// };

// export default App;
