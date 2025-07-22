import Recording from "../models/Recording.js";

// Call when a student starts playing a recording
export const logRecordingView = async (req, res) => {
  try {
    const recordingId = req.params.recordingId;
    const studentId = req.user._id;

    await Recording.findByIdAndUpdate(recordingId, {
      $push: { views: { student: studentId } }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Unable to log recording view" });
  }
};
