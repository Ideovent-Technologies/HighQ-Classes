// src/utils/storage.ts

import { Recording } from "@/modules/recordings/dummyRecordings";

const STORAGE_KEY = "recordings";

export const getRecordings = (): Recording[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveRecording = (newRecording: Recording) => {
  const recordings = getRecordings();
  recordings.unshift(newRecording);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
};
