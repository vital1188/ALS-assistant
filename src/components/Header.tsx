import React from 'react';
import { Settings, VolumeX, Volume2, Moon, Sun, Battery } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  batteryLevel: number | null;
}

const Header: React.FC<HeaderProps> = ({ 
  onSettingsClick, 
  onToggleMute, 
  isMuted, 
  onToggleDarkMode, 
  isDarkMode,
  batteryLevel 
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-indigo-700">ALS Voice Assistant</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Battery indicator */}
          {batteryLevel !== null && (
            <div className="flex items-center text-gray-600 mr-2">
              <Battery className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">{batteryLevel}%</span>
            </div>
          )}
          
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </button>
          
          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-red-500" />
            ) : (
              <Volume2 className="h-5 w-5 text-green-500" />
            )}
          </button>
          
          {/* Settings button */}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
