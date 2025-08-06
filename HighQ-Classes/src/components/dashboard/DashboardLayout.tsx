import { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="w-64 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex-grow overflow-auto">
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout; 
