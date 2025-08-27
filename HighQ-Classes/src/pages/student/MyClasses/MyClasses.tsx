import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, User, AlertCircle, Sparkles } from "lucide-react";
import { StudentUser } from "@/types/student.types";
import { studentService } from "@/API/services/studentService";

import WeeklySchedule from "./WeeklySchedule";
import TodaySchedule from "./TodaySchedule";
import Recordings from "./Recordings";

export interface ClassSchedule {
  _id: string;
  subject: string;
  time: string;
  teacher: string;
  room?: string;
  day: string;
  duration?: string;
  course?: string;
  isActive: boolean;
}

export interface Recording {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: string;
  uploadedAt: string;
  course: string;
  teacher: string;
  viewCount: number;
  isActive: boolean;
}

const MyClasses: React.FC = () => {
  const { state } = useAuth();
  const user =
    state.user && state.user.role === "student"
      ? (state.user as unknown as StudentUser)
      : null;

  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("today");

  useEffect(() => {
    const fetchClassData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const [recordingsData, dashboardData] = await Promise.all([
          studentService.getStudentRecordings(),
          studentService.getDashboard(),
        ]);
        setRecordings(Array.isArray(recordingsData) ? recordingsData : []);
        const scheduleData = dashboardData.upcomingClasses.map((c: any) => ({
          _id: c._id,
          subject: c.subject,
          time: c.time,
          teacher: c.teacher,
          room: c.room,
          day: c.day,
          duration: c.duration,
          course: c.course,
          isActive: c.isActive,
        }));
        setSchedules(scheduleData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load class data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassData();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
        <Card className="max-w-md w-full p-6 sm:p-8 text-center bg-white text-gray-800 rounded-xl shadow-lg">
          <CardContent className="space-y-4">
            <User className="h-14 w-14 sm:h-16 sm:w-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold">
              Authentication Required
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Please log in as a student to view your classes and dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-600 p-4">
        <Loader2 className="h-16 w-16 sm:h-20 sm:w-20 animate-spin text-indigo-500 mb-4 sm:mb-6" />
        <p className="text-lg sm:text-xl font-medium text-center">
          Fetching your class data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
        <Alert className="max-w-md w-full bg-red-100 border-red-500 text-red-700">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
          <AlertTitle className="text-base sm:text-lg font-bold">
            Data Loading Error
          </AlertTitle>
          <AlertDescription className="mt-1 sm:mt-2 text-sm sm:text-base text-red-600">
            {error}. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-12 py-6 sm:py-10 space-y-10 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800">
            Hello, {user.name.split(" ")[0]}!
            <Sparkles className="inline h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ml-2 text-yellow-500" />
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">
            Welcome to your class dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-indigo-400 text-indigo-600 bg-indigo-50">
            {schedules.length} Classes
          </Badge>
          <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-purple-400 text-purple-600 bg-purple-50">
            {recordings.length} Recordings
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full flex overflow-x-auto scrollbar-hide gap-2 p-1 rounded-xl bg-gray-200 shadow-md">
          <TabsTrigger
            value="today"
            className="flex-1 whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-lg px-2 sm:px-4 py-2 transition-colors"
          >
            Today's Classes
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="flex-1 whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-lg px-2 sm:px-4 py-2 transition-colors"
          >
            Weekly Schedule
          </TabsTrigger>
          <TabsTrigger
            value="recordings"
            className="flex-1 whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-lg px-2 sm:px-4 py-2 transition-colors"
          >
            Recorded Lectures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-4 sm:mt-6">
          <TodaySchedule schedules={schedules} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-4 sm:mt-6">
          <WeeklySchedule schedules={schedules} />
        </TabsContent>

        <TabsContent value="recordings" className="mt-4 sm:mt-6">
          <Recordings recordings={recordings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyClasses;
