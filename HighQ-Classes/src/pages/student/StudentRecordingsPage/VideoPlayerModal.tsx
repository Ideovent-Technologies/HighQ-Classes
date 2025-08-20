import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Recording } from "@/API/services/recordingService";

interface Props {
  recording: Recording;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<Props> = ({ recording, onClose }) => {
  return (
    <Dialog open={!!recording} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{recording.title}</DialogTitle>
          <p className="text-sm text-gray-500">{recording.subject}</p>
        </DialogHeader>
        <video controls className="w-full rounded-md">
          <source src={recording.fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
