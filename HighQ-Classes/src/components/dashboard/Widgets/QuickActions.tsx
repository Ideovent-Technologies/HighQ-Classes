import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    BookOpen,
    Building,
    Settings,
    Plus,
    DollarSign,
} from "lucide-react";

interface QuickActionsProps {
    className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
    return (
        <Card className={`rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 border border-indigo-200 ${className || ''}`}>
            <CardHeader className="p-6 border-b border-indigo-200 bg-gradient-to-r from-purple-100 to-indigo-100">
                <CardTitle className="text-3xl font-extrabold text-indigo-800 flex items-center gap-3">
                    <Settings className="h-8 w-8 text-indigo-600" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                {/* Changed from grid to flex-col for vertical stacking */}
                <div className="flex flex-col gap-6">
                    <Link to="/dashboard/teacher-management" className="w-full">
                        <Button
                            variant="default" // Using default variant to allow custom styling
                            className="h-28 w-full flex flex-col items-center justify-center text-lg font-semibold rounded-2xl shadow-lg
                                       bg-gradient-to-br from-teal-500 to-green-600 text-white
                                       hover:from-teal-600 hover:to-green-700 hover:scale-105 transition-all duration-300 ease-in-out
                                       transform focus:ring-4 focus:ring-teal-300 focus:outline-none"
                        >
                            <Plus className="h-8 w-8 mb-2" />
                            Manage Teacher
                        </Button>
                    </Link>
                    <Link to="/dashboard/course-management" className="w-full">
                        <Button
                            variant="default"
                            className="h-28 w-full flex flex-col items-center justify-center text-lg font-semibold rounded-2xl shadow-lg
                                       bg-gradient-to-br from-blue-500 to-cyan-600 text-white
                                       hover:from-blue-600 hover:to-cyan-700 hover:scale-105 transition-all duration-300 ease-in-out
                                       transform focus:ring-4 focus:ring-blue-300 focus:outline-none"
                        >
                            <BookOpen className="h-8 w-8 mb-2" />
                            Manage Course
                        </Button>
                    </Link>
                    <Link to="/dashboard/batches/manage" className="w-full">
                        <Button
                            variant="default"
                            className="h-28 w-full flex flex-col items-center justify-center text-lg font-semibold rounded-2xl shadow-lg
                                       bg-gradient-to-br from-red-500 to-pink-600 text-white
                                       hover:from-red-600 hover:to-pink-700 hover:scale-105 transition-all duration-300 ease-in-out
                                       transform focus:ring-4 focus:ring-red-300 focus:outline-none"
                        >
                            <Building className="h-8 w-8 mb-2" />
                            Manage Batch
                        </Button>
                    </Link>
                    <Link to="/dashboard/fee-management" className="w-full">
                        <Button
                            variant="default"
                            className="h-28 w-full flex flex-col items-center justify-center text-lg font-semibold rounded-2xl shadow-lg
                                       bg-gradient-to-br from-yellow-500 to-orange-600 text-white
                                       hover:from-yellow-600 hover:to-orange-700 hover:scale-105 transition-all duration-300 ease-in-out
                                       transform focus:ring-4 focus:ring-yellow-300 focus:outline-none"
                        >
                            <DollarSign className="h-8 w-8 mb-2" />
                            Manage Fees
                        </Button>
                    </Link>
                    <Link to="/dashboard/all-students" className="w-full">
                        <Button
                            variant="default"
                            className="h-28 w-full flex flex-col items-center justify-center text-lg font-semibold rounded-2xl shadow-lg
                                       bg-gradient-to-br from-purple-500 to-indigo-600 text-white
                                       hover:from-purple-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out
                                       transform focus:ring-4 focus:ring-purple-300 focus:outline-none"
                        >
                            <Users className="h-8 w-8 mb-2" />
                            Manage Students
                        </Button>
                    </Link>
                    {/* Add more quick actions if needed */}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
