// QuickActions.tsx

import React from "react";
import { Link } from "react-router-dom";
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

// Add className to the component's props
interface QuickActionsProps {
    className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className }) => {
    // Destructure className here
    return (
        // Apply the className to the root Card element
        <Card className={className}>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* The rest of your component remains the same... */}
                    <Link to="/dashboard/teacher-management">
                        <Button
                            variant="outline"
                            className="h-20 w-full flex flex-col items-center justify-center"
                        >
                            <Plus className="h-6 w-6 mb-2" />
                            Manage Teacher
                        </Button>
                    </Link>
                    <Link to="/dashboard/course-management">
                        <Button
                            variant="outline"
                            className="h-20 w-full flex flex-col items-center justify-center"
                        >
                            <BookOpen className="h-6 w-6 mb-2" />
                            Manage Course
                        </Button>
                    </Link>
                    <Link to="/dashboard/batches/manage">
                        <Button
                            variant="outline"
                            className="h-20 w-full flex flex-col items-center justify-center"
                        >
                            <Building className="h-6 w-6 mb-2" />
                            Manage Batch
                        </Button>
                    </Link>
                    <Link to="/dashboard/fee-management">
                        <Button
                            variant="outline"
                            className="h-20 w-full flex flex-col items-center justify-center"
                        >
                            <DollarSign className="h-6 w-6 mb-2" />
                            Manage Fees
                        </Button>
                    </Link>
                    <Link to="/dashboard/all-students">
                        <Button
                            variant="outline"
                            className="h-20 w-full flex flex-col items-center justify-center"
                        >
                            <Users className="h-6 w-6 mb-2" />
                            Manage students
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuickActions;
