import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
    id: number;
    description: string;
    timestamp: string;
    link: string;
}

const mockActivities: Activity[] = [
    {
        id: 1,
        description: "New teacher, Jane Doe, was added.",
        timestamp: "5 minutes ago",
        link: "/dashboard/teachers/T104",
    },
    {
        id: 2,
        description: "Course 'Advanced Calculus' was updated.",
        timestamp: "1 hour ago",
        link: "/dashboard/courses/MAT201",
    },
    {
        id: 3,
        description: "Batch 'Chem Batch C' created with 20 students.",
        timestamp: "3 hours ago",
        link: "/dashboard/batches/3",
    },
];

const RecentActivity: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockActivities.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between">
                            <p className="text-sm text-gray-800">{activity.description}</p>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{activity.timestamp}</span>
                                <Link to={activity.link} className="text-sm text-blue-600 hover:underline">
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentActivity;