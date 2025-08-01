// src/components/common/PageHeader.tsx

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // For buttons or other elements
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-100">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 mb-2">{title}</h1>
        {description && <p className="text-gray-600 text-md">{description}</p>}
      </div>
      {children && <div className="mt-4 md:mt-0">{children}</div>}
    </div>
  );
};

export { PageHeader };
