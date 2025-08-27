import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { AttendanceRecord } from "./types";
import { getStatusBadge, getStatusIcon } from "./StatusUtils";

export default function AttendanceRecords({ records }: { records: AttendanceRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <BarChart3 className="h-5 w-5 mr-2" />
          Attendance Records
          <Badge variant="secondary" className="ml-2">
            {records.length} records
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <CalendarIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Attendance Records</h3>
            <p className="text-sm text-gray-600">No records found for the selected date range.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {format(new Date(record.date), "EEEE, MMMM dd, yyyy")}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                      {record.markedBy && <span>Marked by: {record.markedBy.name}</span>}
                      {record.batchId && <span>Batch: {record.batchId.name}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  {getStatusBadge(record.status)}
                  <p className="text-xs text-gray-500 mt-1">
                    {format(new Date(record.createdAt), "HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}