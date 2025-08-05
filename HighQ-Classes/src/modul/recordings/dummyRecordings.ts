// export const recordings = [
//   {
//     id: 1,
//     subject: "Physics",
//     url: "https://dummyvideo.com/phy",
//     date: "2025-07-20",
//     topic: "Kinematics"
//   },
//   {
//     id: 2,
//     subject: "Math",
//     url: "https://dummyvideo.com/math",
//     date: "2025-07-21",
//     topic: "Quadratic Equations"
//   },
//   {
//     id: 3,
//     subject: "Chemistry",
//     url: "https://dummyvideo.com/chem",
//     date: "2025-07-19",
//     topic: "Acids & Bases"
//   },
//   {
//     id: 4,
//     subject: "Biology",
//     url: "https://dummyvideo.com/bio",
//     date: "2025-07-15",
//     topic: "Cell Division"
//   }
// ];






// src/modules/recordings/dummyRecordings.ts

// export interface Recording {
//   id: string;
//   title: string;
//   subject: string;
//   url: string;
//   date: string;
//   topic: string;
//   views: number;
//   accessExpires?: string;
//   isActive?: boolean;
// }

// const today = new Date();
// const format = (date: Date) => date.toISOString().split("T")[0];

// export const dummyRecordings: Recording[] = [
//   {
//     id: "1",
//     title: "Kinematics",
//     subject: "Physics",
//     url: "https://dummyvideo.com/phy",
//     date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)), // Yesterday
//     topic: "Kinematics",
//     views: 10,
//     isActive: true,
//   },
//   {
//     id: "2",
//     title: "Quadratic Equations",
//     subject: "Math",
//     url: "https://dummyvideo.com/math",
//     date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)), // 2 days ago
//     topic: "Quadratic Equations",
//     views: 5,
//     isActive: true,
//   },
//   {
//     id: "3",
//     title: "Acids & Bases",
//     subject: "Chemistry",
//     url: "https://dummyvideo.com/chem",
//     date: format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)), // Too old
//     topic: "Acids & Bases",
//     views: 2,
//     isActive: true,
//   },
// ];


// right code

export interface Recording {
  id: string;
  title: string;
  subject: string;
  url: string;
  date: string;
  topic: string;
  views: number;
  isActive: boolean;
}

// This is a shared mutable array
export const dummyRecordings: Recording[] = [
  {
    id: "1",
    title: "English Class - Tenses",
    subject: "English",
    url: "https://example.com/eng.mp4",
    date: new Date().toISOString(),
    topic: "Grammar",
    views: 10,
    isActive: true,
  },
];
