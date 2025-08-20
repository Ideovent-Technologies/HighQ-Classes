import React from "react";
import { Recording } from "@/API/services/recordingService";
import RecordingCard from "./RecordingCard";

interface Props {
  recordings: Recording[];
  loading: boolean;
  onPlay: (recording: Recording) => void;
  onDownload: (recording: Recording) => void;
}

const RecordingGrid: React.FC<Props> = ({ recordings, loading, onPlay, onDownload }) => {
  if (loading) return <p>Loading recordings...</p>;
  if (recordings.length === 0) return <p>No recordings found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recordings.map((recording) => (
        <RecordingCard
          key={recording._id}
          recording={recording}
          onPlay={() => onPlay(recording)}
          onDownload={() => onDownload(recording)}
        />
      ))}
    </div>
  );
};

export default RecordingGrid;
