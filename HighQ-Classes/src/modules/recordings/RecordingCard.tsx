import React from 'react';

type Props = {
  subject: string;
  url: string;
  date: string;
};

const RecordingCard: React.FC<Props> = ({ subject, url, date }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">{subject}</h2>
      <p className="text-sm text-gray-600">{date}</p>
    </div>
  );
};

export default RecordingCard;