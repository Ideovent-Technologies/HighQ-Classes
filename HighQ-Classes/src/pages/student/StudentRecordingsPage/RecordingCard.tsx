import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { Recording } from "@/API/services/recordingService";
import { formatDuration } from "./timeUtils";

interface Props {
  recording: Recording;
  onPlay: () => void;
  onDownload: () => void;
}

const RecordingCard: React.FC<Props> = ({ recording, onPlay, onDownload }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{recording.title}</CardTitle>
        <p className="text-sm text-gray-500">{recording.subject}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">{recording.description}</p>
        <p className="text-xs text-gray-400">Duration: {formatDuration(recording.duration)}</p>
        <p className="text-xs text-gray-400">Views: {recording.views}</p>
        <div className="flex gap-2 mt-3">
          <Button onClick={onPlay} size="sm">
            <Play className="h-4 w-4 mr-1" /> Play
          </Button>
          <Button onClick={onDownload} size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingCard;
