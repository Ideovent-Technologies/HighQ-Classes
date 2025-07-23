import React from 'react';

type Recording = {
  title: string;
  date: string;
  time: string;
  duration: string;
  daysLeft: string;
  watched: boolean;
};

const recordings: Recording[] = [
  {
    title: 'Chemistry',
    date: 'July 18, 2025',
    time: '10:00 AM',
    duration: '45 min',
    daysLeft: '1 day left',
    watched: false,
  },
  {
    title: 'Mathematics Intro',
    date: 'July 19, 2025',
    time: '11:30 AM',
    duration: '1 hr',
    daysLeft: '2 days left',
    watched: false,
  },
  {
    title: 'Physics Basics',
    date: 'July 20, 2025',
    time: '2:00 PM',
    duration: '5-th',
    daysLeft: '3 days left',
    watched: false,

  },
];

const ClassRecordings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-600 p-3 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 012-2h9a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm14.5 3.5l4 3.5-4 3.5V8.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Class Recordings</h1>
      </div>

      {/* Features */}
      <ul className="text-gray-700 mb-6 space-y-2 text-sm">
        <li>✅ Upload class recordings</li>
        <li>✅ Organize by date and topic</li>
        <li>✅ Make available to students for limited time (3 days)</li>
        <li>✅ Monitor viewing statistics</li>
      </ul>

      <button className="bg-blue-600 text-white px-4 py-2 rounded-md mb-8 hover:bg-blue-700 transition">
        + Upload Recording
      </button>

      {/* Recordings List */}
      <div className="space-y-4">
        {recordings.map((rec, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg hover:scale-105"
          >
            <div>
              <h2 className="text-lg font-semibold">{rec.title}</h2>
              <p className="text-sm text-gray-500">
                {rec.date} | {rec.time} | {rec.duration}
              </p>
              <p className="text-sm text-orange-500 mt-1">⚠ {rec.daysLeft}</p>
            </div>

            <div className="flex items-center space-x-2 mt-3 md:mt-0 ">
              <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                Watch
              </button>
              <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
                Download
              </button>
              <span
                className={`text-sm font-medium ${
                  rec.watched ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {rec.watched ? 'Watched' : ' Watched'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassRecordings;
