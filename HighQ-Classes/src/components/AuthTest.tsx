import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import {
    BookOpen,
    Clock,
    Users,
    Bell,
    FileText,
    DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { state } = useAuth();
    const user = state.user;
    const location = useLocation();

    const renderDashboard = (): React.ReactNode => {
        switch (user?.role) {
            case "student":
                return <StudentDashboard />;
            case "teacher":
                return <TeacherDashboard />;
            case "admin":
                return <AdminDashboard />;
            default:
                return <div>Unknown user role</div>;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
                {renderDashboard()}
            </div>
        </DashboardLayout>
    );
};

const StudentDashboard = () => {
    const { state } = useAuth();
    const user = state.user;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentData = user as any; // TODO: Create proper Student interface

    const calculateFeePercentage = () => {
        if (!studentData?.feeStatus) return 0;
        const { paidAmount, totalFee } = studentData.feeStatus;
        return Math.round((paidAmount / totalFee) * 100);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Batch</h3>
                        <BookOpen className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                            {studentData?.batch || "Not assigned"}
                        </div>
                        <p className="text-xs text-gray-500">
                            Current enrollment
                        </p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Admission ID</h3>
                        <FileText className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                            {studentData?.admissionDetails?.admissionId || "N/A"}
                        </div>
                        <p className="text-xs text-gray-500">
                            Joined:{" "}
                            {studentData?.admissionDetails?.joiningDate || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Fee Status</h3>
                        <DollarSign className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">
                            {calculateFeePercentage()}% Paid
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className={`h-2.5 rounded-full ${
                                    calculateFeePercentage() === 100
                                        ? "bg-green-500"
                                        : calculateFeePercentage() > 50
                                        ? "bg-teal-500"
                                        : "bg-coral-500"
                                }`}
                                style={{
                                    width: `${calculateFeePercentage()}%`,
                                }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {studentData?.feeStatus?.pendingAmount
                                ? `₹${studentData.feeStatus.pendingAmount} remaining`
                                : "No fee information"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-2xl">Latest Notices</h3>
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            <div className="border-l-4 border-navy-500 pl-4 py-1">
                                <p className="font-medium">
                                    Physics test postponed
                                </p>
                                <p className="text-sm text-gray-600">
                                    The physics test scheduled for tomorrow has been postponed to next week.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Posted 2 hours ago
                                </p>
                            </div>
                            <div className="border-l-4 border-navy-500 pl-4 py-1">
                                <p className="font-medium">
                                    New study materials available
                                </p>
                                <p className="text-sm text-gray-600">
                                    New chemistry notes have been uploaded. Check the study materials section.
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Posted yesterday
                                </p>
                            </div>
                            <div className="text-center mt-4">
                                <Link
                                    to="/dashboard/notices"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    View all notices
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeacherDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Total Students</h3>
                        <Users className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">124</div>
                        <p className="text-xs text-gray-500">Across all batches</p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Classes Today</h3>
                        <Clock className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-gray-500">Next: 2:00 PM - Physics</p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Materials</h3>
                        <FileText className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-gray-500">Uploaded this month</p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Notices</h3>
                        <Bell className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-gray-500">Active notices</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-2xl">Recent Uploads</h3>
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-navy-500" />
                                    <div>
                                        <p className="font-medium">Physics - Wave Optics.pdf</p>
                                        <p className="text-xs text-gray-500">Uploaded 2 days ago</p>
                                    </div>
                                </div>
                                <Link
                                    to="#"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-navy-500" />
                                    <div>
                                        <p className="font-medium">Chemistry - Organic Reactions.pdf</p>
                                        <p className="text-xs text-gray-500">Uploaded 3 days ago</p>
                                    </div>
                                </div>
                                <Link
                                    to="#"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-navy-500" />
                                    <div>
                                        <p className="font-medium">Math - Integration Practice.pdf</p>
                                        <p className="text-xs text-gray-500">Uploaded 5 days ago</p>
                                    </div>
                                </div>
                                <Link
                                    to="#"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    View
                                </Link>
                            </div>
                            <div className="text-center mt-4">
                                <Link
                                    to="/dashboard/upload-materials"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    Upload new material
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-2xl">Upcoming Classes</h3>
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Physics - Wave Optics</p>
                                    <p className="text-sm text-gray-600">2:00 PM - 3:30 PM</p>
                                    <p className="text-xs text-gray-500">Room 103 • Physics Batch A</p>
                                </div>
                                <div className="bg-navy-100 text-navy-700 text-xs px-2 py-1 rounded">
                                    Today
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Chemistry - Organic Chemistry</p>
                                    <p className="text-sm text-gray-600">4:00 PM - 5:30 PM</p>
                                    <p className="text-xs text-gray-500">Room 104 • Chemistry Batch B</p>
                                </div>
                                <div className="bg-navy-100 text-navy-700 text-xs px-2 py-1 rounded">
                                    Today
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Mathematics - Calculus</p>
                                    <p className="text-sm text-gray-600">10:00 AM - 11:30 AM</p>
                                    <p className="text-xs text-gray-500">Room 101 • Mathematics Batch A</p>
                                </div>
                                <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                    Tomorrow
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Total Students</h3>
                        <Users className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">367</div>
                        <p className="text-xs text-gray-500">+24 this month</p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Fee Collection</h3>
                        <DollarSign className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">₹287,560</div>
                        <p className="text-xs text-gray-500">This month</p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Pending Dues</h3>
                        <DollarSign className="h-4 w-4 text-coral-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">₹124,890</div>
                        <p className="text-xs text-gray-500">From 42 students</p>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                        <h3 className="text-sm font-medium">Teachers</h3>
                        <Users className="h-4 w-4 text-navy-500" />
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-gray-500">Across all departments</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-2xl">Recent Fee Payments</h3>
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                        AS
                                    </div>
                                    <div>
                                        <p className="font-medium">Anuj Sharma</p>
                                        <p className="text-xs text-gray-500">Physics Batch A • ₹12,000</p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">Today, 11:23 AM</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                        RP
                                    </div>
                                    <div>
                                        <p className="font-medium">Riya Patel</p>
                                        <p className="text-xs text-gray-500">Chemistry Batch B • ₹8,000</p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">Yesterday, 3:45 PM</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                        VK
                                    </div>
                                    <div>
                                        <p className="font-medium">Vikram Kumar</p>
                                        <p className="text-xs text-gray-500">Mathematics Batch C • ₹10,000</p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">Yesterday, 1:12 PM</div>
                            </div>
                            <div className="text-center mt-4">
                                <Link
                                    to="/dashboard/fee-management"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    View all payments
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Replaced Card component */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    {/* Replaced CardHeader and CardTitle */}
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold tracking-tight text-2xl">Payment Due Students</h3>
                    </div>
                    {/* Replaced CardContent */}
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                        NK
                                    </div>
                                    <div>
                                        <p className="font-medium">Neha Khan</p>
                                        <p className="text-xs text-gray-500">Due: ₹6,000 • Due Date: 15th Apr</p>
                                    </div>
                                </div>
                                <button className="text-xs bg-coral-500 text-white px-2 py-1 rounded">
                                    Remind
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                        RJ
                                    </div>
                                    <div>
                                        <p className="font-medium">Rahul Joshi</p>
                                        <p className="text-xs text-gray-500">Due: ₹8,000 • Due Date: 18th Apr</p>
                                    </div>
                                </div>
                                <button className="text-xs bg-coral-500 text-white px-2 py-1 rounded">
                                    Remind
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium mr-3">
                                        SM
                                    </div>
                                    <div>
                                        <p className="font-medium">Sanjay Mehra</p>
                                        <p className="text-xs text-gray-500">Due: ₹4,000 • Due Date: 20th Apr</p>
                                    </div>
                                </div>
                                <button className="text-xs bg-coral-500 text-white px-2 py-1 rounded">
                                    Remind
                                </button>
                            </div>
                            <div className="text-center mt-4">
                                <Link
                                    to="/dashboard/fee-management"
                                    className="text-sm text-navy-600 hover:text-navy-800"
                                >
                                    View all pending dues
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;