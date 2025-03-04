import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-indigo-700">ALS Voice Assistant</h1>
        </div>
        <button
          onClick={onSettingsClick}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;
