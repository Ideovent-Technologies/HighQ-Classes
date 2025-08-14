import React from "react";

// The 'value' prop is now a union type, accepting both number and string.
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string; // Changed type to be more flexible
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div>{icon}</div>
      </div>
      {/* The value is rendered directly, accommodating both numbers and strings. */}
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;