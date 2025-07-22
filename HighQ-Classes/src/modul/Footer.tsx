import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-3xl mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} HighQ Classes. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="/about" className="hover:text-gray-900">About</a>
          <a href="/privacy" className="hover:text-gray-900">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-900">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
