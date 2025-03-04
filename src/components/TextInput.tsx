import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCw, ChevronDown, ChevronUp, Repeat } from 'lucide-react';
import { Phrase } from '../types';

interface TextInputProps {
  onSend: (text: string) => void;
  onTextChange: (text: string) => void;
  onRequestCompletion: () => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  quickPhrases: Phrase[];
  onPhraseClick: (phrase: Phrase) => void;
  onRepeatLastPhrase?: () => void;
  lastSpokenText: string | null;
  isDarkMode?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ 
  onSend, 
  onTextChange, 
  onRequestCompletion,
  suggestions,
  onSuggestionClick,
  quickPhrases,
  onPhraseClick,
  onRepeatLastPhrase,
  lastSpokenText,
  isDarkMode = false
}) => {
  const [text, setText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
    
    // Reset typing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Set a new timer to detect when typing pauses
    if (newText.trim().length > 0) {
      typingTimerRef.current = setTimeout(() => {
        onRequestCompletion();
      }, 1000); // 1 second pause triggers completion
    }
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearText = () => {
    setText('');
    onTextChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleCompletionRequest = () => {
    if (text.trim()) {
      onRequestCompletion();
      setShowSuggestions(true);
    }
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow`}>
      {/* Suggestions Bar - Compact and Collapsible */}
      {suggestions.length > 0 && (
        <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between px-4 py-2">
            <button 
              onClick={toggleSuggestions}
              className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-1 hover:text-indigo-600`}
            >
              Suggestions {showSuggestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{suggestions.length} available</span>
              {/* Moved refresh button to suggestion section corner */}
              {text && (
                <button
                  onClick={handleCompletionRequest}
                  className={`p-2 rounded-full ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900' : 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-100'}`}
                  aria-label="Refresh suggestions"
                  title="Refresh suggestions"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          
          {showSuggestions && (
            <div className="px-3 pb-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className={`${
                    isDarkMode 
                      ? 'bg-indigo-900 text-indigo-100 hover:bg-indigo-800' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  } px-3 py-2 rounded-lg text-base transition-colors`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Text Input - Large and Centered */}
      <div className="p-4">
        <div className="relative mb-4">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`w-full p-4 pr-24 ${
              isDarkMode 
                ? 'bg-gray-700 border-indigo-700 text-white placeholder-gray-400 focus:ring-indigo-400' 
                : 'border-indigo-300 focus:ring-indigo-500'
            } border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent resize-none text-xl min-h-[100px] max-h-[150px]`}
            rows={3}
          />
          
          <div className="absolute bottom-3 right-3 flex space-x-2">
            {text && (
              <button
                onClick={clearText}
                className={`p-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} rounded-full`}
                aria-label="Clear text"
              >
                <X className="h-6 w-6" />
              </button>
            )}
            {onRepeatLastPhrase && lastSpokenText && (
              <button
                onClick={onRepeatLastPhrase}
                className={`p-3 ${isDarkMode ? 'text-green-400 hover:text-green-300 hover:bg-green-900' : 'text-green-500 hover:text-green-700 hover:bg-green-100'} rounded-full`}
                aria-label="Repeat last phrase"
                title="Repeat last phrase"
              >
                <Repeat className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={`p-3 rounded-full ${
                text.trim() 
                  ? isDarkMode 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : isDarkMode
                    ? 'bg-gray-700 text-gray-500'
                    : 'bg-gray-200 text-gray-400'
              }`}
              aria-label="Send message"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Quick Phrases - Large Buttons */}
        <div>
          <h2 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quick Phrases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {quickPhrases.map(phrase => (
              <button
                key={phrase.id}
                onClick={() => onPhraseClick(phrase)}
                className={`${
                  isDarkMode 
                    ? 'bg-indigo-900 text-indigo-100 hover:bg-indigo-800' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                } px-4 py-3 rounded-lg text-lg transition-colors text-center min-h-[70px] flex items-center justify-center`}
              >
                {phrase.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
