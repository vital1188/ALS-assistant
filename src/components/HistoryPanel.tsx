import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';

interface HistoryPanelProps {
  history: string[];
  onSpeak: (text: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSpeak, onClear }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-800">Recent Messages</h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
            aria-label="Clear history"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <p className="text-gray-500 text-lg py-4">No recent messages</p>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-400px)] touch-pan-y">
          {history.map((text, index) => (
            <button 
              key={index}
              onClick={() => onSpeak(text)}
              className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 text-left text-lg border border-gray-200"
            >
              <span className="text-gray-700 mr-2">{text}</span>
              <RefreshCw className="h-5 w-5 text-indigo-500 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
