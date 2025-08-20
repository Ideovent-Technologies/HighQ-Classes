import { Users, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AttendanceHeader({ userName }: { userName?: string }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-3">
        <Users className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Attendance
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track your attendance records and statistics
          </p>
        </div>
      </div>
      <Badge variant="outline" className="text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-2">
        <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        {userName}
      </Badge>
    </div>
  );
}