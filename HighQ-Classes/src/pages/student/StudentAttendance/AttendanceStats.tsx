import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { AttendanceStatistics } from "./types";

export default function AttendanceStats({ stats }: { stats: AttendanceStatistics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-4 sm:p-6 flex justify-between items-center">
          <div>
            <p className="text-green-100 text-sm sm:text-base">Present Days</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.presentDays}</p>
          </div>
          <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-200" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardContent className="p-4 sm:p-6 flex justify-between items-center">
          <div>
            <p className="text-red-100 text-sm sm:text-base">Absent Days</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.absentDays}</p>
          </div>
          <XCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-200" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-4 sm:p-6 flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm sm:text-base">Leave Days</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.leaveDays}</p>
          </div>
          <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-blue-200" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-4 sm:p-6 flex justify-between items-center">
          <div>
            <p className="text-purple-100 text-sm sm:text-base">Attendance %</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.attendancePercentage}%</p>
          </div>
          <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-purple-200" />
        </CardContent>
      </Card>
    </div>
  );
}