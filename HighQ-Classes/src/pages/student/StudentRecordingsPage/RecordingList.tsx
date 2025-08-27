import React from "react";
import { Recording } from "@/API/services/recordingService";
import RecordingListItem from "./RecordingListItem";

interface Props {
  recordings: Recording[];
  onPlay: (recording: Recording) => void;
  onDownload: (recording: Recording) => void;
}

const RecordingList: React.FC<Props> = ({ recordings, onPlay, onDownload }) => {
  if (recordings.length === 0) return <p>No recordings found.</p>;

  return (
    <div className="divide-y border rounded-md">
      {recordings.map((recording) => (
        <RecordingListItem
          key={recording._id}
          recording={recording}
          onPlay={() => onPlay(recording)}
          onDownload={() => onDownload(recording)}
        />
      ))}
    </div>
  );
};

export default RecordingList;
