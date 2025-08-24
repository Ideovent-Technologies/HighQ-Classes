import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClassSchedule } from "./MyClasses";

interface Props {
  schedules: ClassSchedule[];
}

const WeeklySchedule: React.FC<Props> = ({ schedules }) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Card className="rounded-3xl shadow-2xl overflow-hidden bg-white/70 backdrop-blur-md border-none">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-3xl px-6 py-4 sm:px-8 sm:py-6">
        <CardTitle className="flex items-center text-2xl sm:text-3xl font-extrabold tracking-tight">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 animate-pulse" /> Weekly Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-8 space-y-6 sm:space-y-8">
        {days.map((day) => {
          const classes = schedules.filter((s) => s.day === day);
          const isToday = day === today;
          return (
            <div key={day} className="flex flex-col gap-3 sm:gap-4">
              <h3
                className={`text-lg sm:text-xl font-bold tracking-wide ${
                  isToday ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {day}
              </h3>
              <div className="border-b border-gray-200" />
              {classes.length === 0 ? (
                <div className="flex items-center text-sm text-gray-500 py-2 px-2 sm:px-4">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>No classes scheduled.</span>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {classes.map((c) => (
                    <Card
                      key={c._id}
                      className="relative border-l-4 border-blue-500 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-blue-400"
                    >
                      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                        {/* Left Side: Class Details */}
                        <div className="flex flex-col gap-1">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                            {c.subject}
                          </h4>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-gray-400" />
                            <span>{c.time}</span>
                          </div>
                          {c.room && (
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                              <span>{c.room}</span>
                            </div>
                          )}
                        </div>
                        {/* Right Side: Teacher & Course Badge */}
                        <div className="flex flex-col items-start sm:items-end gap-1 sm:gap-2 mt-2 sm:mt-0">
                          <p className="text-xs sm:text-sm text-gray-600">
                            with {c.teacher}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-600 border-blue-600"
                          >
                            {c.course}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default WeeklySchedule;