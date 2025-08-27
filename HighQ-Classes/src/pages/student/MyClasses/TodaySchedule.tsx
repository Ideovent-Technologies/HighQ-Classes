import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, User, MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClassSchedule } from "./MyClasses";

interface Props {
  schedules: ClassSchedule[];
}

const TodaySchedule: React.FC<Props> = ({ schedules }) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayClasses = schedules.filter((s) => s.day === today);

  return (
    <Card className="rounded-3xl shadow-xl overflow-hidden backdrop-blur-md bg-white/70">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-t-3xl px-8 py-6">
        <CardTitle className="flex items-center text-3xl font-extrabold tracking-tight">
          <Clock className="h-8 w-8 mr-3 animate-pulse" /> Today's Agenda
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        {todayClasses.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <CheckCircle className="h-20 w-20 text-teal-500 mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-extrabold text-gray-700">All Clear!</h3>
            <p className="mt-3 text-lg">No classes scheduled for today. Take a break.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {todayClasses.map((c) => (
              <Card
                key={c._id}
                className="relative border border-gray-200 shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-blue-300"
              >
                <div className="absolute top-0 left-0 h-full w-2 bg-gradient-to-b from-teal-400 to-blue-500 rounded-l-xl" />
                <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left Side: Class Details */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-bold text-gray-800">{c.subject}</h4>
                    <div className="flex items-center text-md text-gray-600">
                      <User className="h-5 w-5 mr-3 text-gray-400" />
                      <span>{c.teacher}</span>
                    </div>
                    {c.room && (
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{c.room}</span>
                      </div>
                    )}
                  </div>
                  {/* Right Side: Time & Course Badge */}
                  <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
                    <div className="text-3xl font-extrabold text-blue-600 tracking-wide">{c.time}</div>
                    <Badge variant="outline" className="text-sm px-3 py-1 bg-teal-100 text-teal-600 border-teal-600 font-semibold rounded-full">
                      {c.course}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;