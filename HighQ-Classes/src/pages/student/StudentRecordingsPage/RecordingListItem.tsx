import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { Recording } from "@/API/services/recordingService";
import { formatDuration } from "./timeUtils";

interface Props {
  recording: Recording;
  onPlay: () => void;
  onDownload: () => void;
}

const RecordingListItem: React.FC<Props> = ({ recording, onPlay, onDownload }) => {
  return (
    <div className="flex justify-between items-center p-3">
      <div>
        <h3 className="font-medium">{recording.title}</h3>
        <p className="text-sm text-gray-500">
          {recording.subject} • {formatDuration(recording.duration)} • {recording.views} views
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onPlay} size="sm">
          <Play className="h-4 w-4 mr-1" /> Play
        </Button>
        <Button onClick={onDownload} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
      </div>
    </div>
  );
};

export default RecordingListItem;
