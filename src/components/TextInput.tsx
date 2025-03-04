import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Phrase } from '../types';

interface TextInputProps {
  onSend: (text: string) => void;
  onTextChange: (text: string) => void;
  onRequestCompletion: () => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  quickPhrases: Phrase[];
  onPhraseClick: (phrase: Phrase) => void;
}

const TextInput: React.FC<TextInputProps> = ({ 
  onSend, 
  onTextChange, 
  onRequestCompletion,
  suggestions,
  onSuggestionClick,
  quickPhrases,
  onPhraseClick
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
    <div className="w-full bg-white rounded-lg shadow">
      {/* Suggestions Bar - Compact and Collapsible */}
      {suggestions.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-2">
            <button 
              onClick={toggleSuggestions}
              className="text-sm font-medium text-gray-600 flex items-center gap-1 hover:text-indigo-600"
            >
              Suggestions {showSuggestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <span className="text-xs text-gray-500">{suggestions.length} available</span>
          </div>
          
          {showSuggestions && (
            <div className="px-3 pb-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-base hover:bg-indigo-100 transition-colors"
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
            className="w-full p-4 pr-24 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-xl min-h-[100px] max-h-[150px]"
            rows={3}
          />
          
          <div className="absolute bottom-3 right-3 flex space-x-2">
            {text && (
              <button
                onClick={clearText}
                className="p-3 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Clear text"
              >
                <X className="h-6 w-6" />
              </button>
            )}
            {text && (
              <button
                onClick={handleCompletionRequest}
                className="p-3 text-indigo-500 hover:text-indigo-700 rounded-full hover:bg-indigo-100"
                aria-label="Get suggestions"
              >
                <RefreshCw className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={`p-3 rounded-full ${
                text.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
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
          <h2 className="text-lg font-medium mb-2 text-gray-600">Quick Phrases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {quickPhrases.map(phrase => (
              <button
                key={phrase.id}
                onClick={() => onPhraseClick(phrase)}
                className="bg-indigo-50 text-indigo-700 px-4 py-3 rounded-lg text-lg hover:bg-indigo-100 transition-colors text-center min-h-[70px] flex items-center justify-center"
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
