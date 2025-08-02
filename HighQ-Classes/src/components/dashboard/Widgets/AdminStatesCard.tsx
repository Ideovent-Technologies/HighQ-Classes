import React from "react";
import { Users, UserCheck, BookOpen, Building, BarChart3, Shield, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminUser } from "@/types/admin.types";

interface AdminStatsCardsProps {
    stats: AdminUser["systemStats"];
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
                <CardContent className="p-4 text-center">
                    <Users className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{stats?.totalStudents}</div>
                    <p className="text-sm text-gray-600">Students</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <UserCheck className="mx-auto h-8 w-8 text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-600">{stats?.totalTeachers}</div>
                    <p className="text-sm text-gray-600">Teachers</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-purple-600">{stats?.totalCourses}</div>
                    <p className="text-sm text-gray-600">Courses</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <Building className="mx-auto h-8 w-8 text-orange-600 mb-2" />
                    <div className="text-2xl font-bold text-orange-600">{stats?.totalBatches}</div>
                    <p className="text-sm text-gray-600">Batches</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <BarChart3 className="mx-auto h-8 w-8 text-teal-600 mb-2" />
                    <div className="text-2xl font-bold text-teal-600">{stats?.activeUsers}</div>
                    <p className="text-sm text-gray-600">Active Users</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <Shield className="mx-auto h-8 w-8 text-red-600 mb-2" />
                    <div className="text-2xl font-bold text-red-600">{stats?.pendingApprovals}</div>
                    <p className="text-sm text-gray-600">Pending</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminStatsCards;