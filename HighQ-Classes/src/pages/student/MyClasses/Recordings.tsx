import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Video, Play, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Recording } from "./MyClasses";

interface Props {
  recordings: Recording[];
}

const Recordings: React.FC<Props> = ({ recordings }) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Card className="rounded-3xl shadow-2xl overflow-hidden bg-white/70 backdrop-blur-md border-none">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-3xl px-8 py-6">
        <CardTitle className="flex items-center text-3xl font-extrabold tracking-tight">
          <Video className="h-8 w-8 mr-3 animate-pulse" /> Recorded Lectures
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        {recordings.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Video className="h-20 w-20 text-purple-500 mx-auto mb-6 opacity-80" />
            <h3 className="text-3xl font-extrabold text-gray-700">
              No Recordings Available
            </h3>
            <p className="mt-3 text-lg">
              Check back soon for uploaded class lectures.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recordings.map((rec) => (
              <Card
                key={rec._id}
                className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="relative w-full h-44">
                  {rec.thumbnailUrl ? (
                    <img
                      src={rec.thumbnailUrl}
                      alt={rec.title}
                      className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-400 flex items-center justify-center rounded-t-lg">
                      <Video className="h-12 w-12 text-white" />
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-16 w-16 text-white/90 transform transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
                <CardContent className="p-4 flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-gray-800 line-clamp-1">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {rec.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3 mt-auto">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-400" />{" "}
                      {rec.teacher}
                    </span>
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-400" />{" "}
                      {rec.viewCount} views
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    Uploaded: {formatDate(rec.uploadedAt)}
                  </p>
                  <Button
                    onClick={() => window.open(rec.videoUrl, "_blank")}
                    className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600 transition-colors"
                  >
                    <Play className="h-4 w-4 mr-2" /> Watch Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Recordings;