// DashboardLayout.tsx

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { X } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = ({ children, title = "Dashboard" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
  }, [isSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* BACKDROP */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden bg-black"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE SIDEBAR */}
    {/* MOBILE SIDEBAR */}
<motion.aside
  initial={false}
  animate={{ x: isSidebarOpen ? 0 : "-100%" }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:hidden"
>
  <div className="flex justify-end p-3 border-b">
    <button
      aria-label="Close sidebar"
      onClick={() => setIsSidebarOpen(false)}
      className="p-2 rounded-md hover:bg-gray-100"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
  <Sidebar
    isOpen={isSidebarOpen}
    onClose={() => setIsSidebarOpen(false)}
    isMobile={true}
  />
</motion.aside>

{/* DESKTOP SIDEBAR */}
<div className="hidden lg:block w-64 bg-white shadow-lg fixed inset-y-0">
  <Sidebar
    isOpen={true}
    onClose={() => {}} // or () => setIsSidebarOpen(false) if you want
    isMobile={false}
  />
</div>




      {/* MAIN CONTENT */}
      <div
        className={clsx(
          "flex-1 flex flex-col transition-all duration-300",
          "lg:ml-64"
        )}
      >
        {/* TOP BAR */}
        <header className="p-4 border-b flex items-center justify-between lg:hidden bg-white shadow-sm">
          <button
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="w-8" />
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
