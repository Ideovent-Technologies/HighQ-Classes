// import { recordings } from './../modul/recordings/dummyRecordings';
// import { Module } from 'module';
// // src/utils/storage.ts

// import { Recording } from " ../modul/recordings/dummyRecordings";

// const STORAGE_KEY = "recordings";

// export const getRecordings = (): Recording[] => {
//   const stored = localStorage.getItem(STORAGE_KEY);
//   return stored ? JSON.parse(stored) : [];
// };

// export const saveRecording = (newRecording: Recording) => {
//   const recordings = getRecordings();
//   recordings.unshift(newRecording);
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
// };



// src/utils/storage.ts
import { Recording } from "../modul/recordings/dummyRecordings";

const STORAGE_KEY = "recordings";

// Get all recordings
export const getRecordings = (): Recording[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Save a single new recording
export const saveRecording = (newRecording: Recording) => {
  const recordings = getRecordings();
  recordings.unshift(newRecording);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
};

// Save all recordings (overwrite)
export const saveAllRecordings = (recordings: Recording[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recordings));
};
