import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

interface HistoryPanelProps {
  history: string[];
  onSpeak: (text: string) => void;
  onClear: () => void;
  isDarkMode?: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  history, 
  onSpeak, 
  onClear,
  isDarkMode = false
}) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow h-full`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Recent Messages</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className={`${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'} p-2 rounded-full`}
            aria-label="Clear history"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg py-4`}>No recent messages</p>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-400px)] touch-pan-y">
          {history.map((text, index) => (
            <button 
              key={index}
              onClick={() => onSpeak(text)}
              className={`w-full flex justify-between items-center p-3 rounded-lg ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-200 border border-gray-700' 
                  : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
              } text-left text-lg`}
            >
              <span className="mr-2">{text}</span>
              <RefreshCw className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} flex-shrink-0`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
