import React, { useState, useEffect } from 'react';
import { Phrase, Category } from '../types';
import { Search, Star, Clock, Heart } from 'lucide-react';
import { getCategoryIcon } from '../data/phrases';

interface PhrasesPanelProps {
  categories: Category[];
  phrases: Phrase[];
  frequentPhrases: Phrase[];
  onPhraseClick: (phrase: Phrase) => void;
  isDarkMode?: boolean;
}

const PhrasesPanel: React.FC<PhrasesPanelProps> = ({ 
  categories, 
  phrases, 
  frequentPhrases,
  onPhraseClick,
  isDarkMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [recentPhrases, setRecentPhrases] = useState<Phrase[]>([]);

  // Track recently used phrases (last 5)
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentPhrases');
    if (savedRecent) {
      try {
        const parsed = JSON.parse(savedRecent);
        setRecentPhrases(parsed);
      } catch (e) {
        console.error("Error parsing recent phrases:", e);
      }
    }
  }, []);

  // Update recent phrases when a phrase is clicked
  const handlePhraseClick = (phrase: Phrase) => {
    // Add to recent phrases
    const updatedRecent = [phrase, ...recentPhrases.filter(p => p.id !== phrase.id)].slice(0, 5);
    setRecentPhrases(updatedRecent);
    localStorage.setItem('recentPhrases', JSON.stringify(updatedRecent));
    
    // Call the original click handler
    onPhraseClick(phrase);
  };

  const allPhrases = [...phrases, ...frequentPhrases.filter(fp => 
    !phrases.some(p => p.text === fp.text)
  )];

  const filteredPhrases = allPhrases.filter(phrase => {
    const matchesSearch = searchQuery === '' || 
      phrase.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === null || 
      phrase.category === activeCategory || 
      (activeCategory === 'frequent' && frequentPhrases.some(fp => fp.text === phrase.text)) ||
      (activeCategory === 'recent' && recentPhrases.some(rp => rp.id === phrase.id));
    return matchesSearch && matchesCategory;
  });

  // Get phrases for the active category or all if none selected
  const displayPhrases = activeCategory 
    ? (activeCategory === 'frequent' 
        ? filteredPhrases.filter(p => frequentPhrases.some(fp => fp.text === p.text))
        : activeCategory === 'recent'
          ? recentPhrases.filter(p => filteredPhrases.some(fp => fp.id === p.id))
          : filteredPhrases.filter(p => p.category === activeCategory))
    : filteredPhrases;

  // Group phrases by length for better organization
  const shortPhrases = displayPhrases.filter(p => p.text.length <= 15);
  const mediumPhrases = displayPhrases.filter(p => p.text.length > 15 && p.text.length <= 30);
  const longPhrases = displayPhrases.filter(p => p.text.length > 30);

  // Prioritize emergency phrases
  const emergencyPhrases = displayPhrases.filter(p => p.category === 'emergency');
  const nonEmergencyPhrases = displayPhrases.filter(p => p.category !== 'emergency');

  // Determine if we're showing all phrases or a specific category
  const showingAllPhrases = activeCategory === null;
  const showingEmergency = activeCategory === 'emergency';

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 rounded-lg shadow h-full`}>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-3 pl-12 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
            } border-2 rounded-lg focus:outline-none focus:ring-2 text-lg`}
          />
          <Search className={`absolute left-4 top-4 h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
      </div>

      {/* Quick access tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-3 rounded-lg text-lg font-medium ${
            activeCategory === null
              ? 'bg-indigo-600 text-white'
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveCategory('frequent')}
          className={`px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 ${
            activeCategory === 'frequent'
              ? 'bg-amber-600 text-white'
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
          }`}
        >
          <Star className="h-5 w-5" /> Frequent
        </button>
        <button
          onClick={() => setActiveCategory('recent')}
          className={`px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 ${
            activeCategory === 'recent'
              ? 'bg-blue-600 text-white'
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          <Clock className="h-5 w-5" /> Recent
        </button>
        <button
          onClick={() => setActiveCategory('emergency')}
          className={`px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 ${
            activeCategory === 'emergency'
              ? 'bg-red-600 text-white'
              : isDarkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          Emergency
        </button>
      </div>

      {/* Category tabs - scrollable row */}
      <div className="mb-4 overflow-x-auto pb-2 flex gap-2 flex-nowrap hide-scrollbar">
        {categories
          .filter(category => category.id !== 'emergency') // Emergency is already in quick access
          .map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0 ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {React.createElement(getCategoryIcon(category.id), { className: "h-5 w-5" })}
              {category.name}
            </button>
          ))}
      </div>

      {/* Emergency phrases - always at top if showing all or emergency category */}
      {(showingAllPhrases || showingEmergency) && emergencyPhrases.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md">Emergency</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {emergencyPhrases.map(phrase => (
              <button
                key={phrase.id}
                onClick={() => handlePhraseClick(phrase)}
                className="bg-red-100 text-red-800 px-4 py-3 rounded-lg text-lg font-medium hover:bg-red-200 transition-colors text-center min-h-[60px] flex items-center justify-center"
              >
                {phrase.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Phrases content - organized by length */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)] touch-pan-y">
        {/* Short phrases - 3 columns for quick access */}
        {shortPhrases.length > 0 && !showingEmergency && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Quick Phrases</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {shortPhrases.map(phrase => (
                <button
                  key={phrase.id}
                  onClick={() => handlePhraseClick(phrase)}
                  className={`px-3 py-3 rounded-lg text-base text-center min-h-[50px] flex items-center justify-center ${
                    frequentPhrases.some(fp => fp.text === phrase.text)
                      ? isDarkMode 
                        ? 'bg-amber-900 text-amber-100 hover:bg-amber-800' 
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {phrase.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Medium phrases - 2 columns */}
        {mediumPhrases.length > 0 && !showingEmergency && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Common Phrases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mediumPhrases.map(phrase => (
                <button
                  key={phrase.id}
                  onClick={() => handlePhraseClick(phrase)}
                  className={`px-4 py-3 rounded-lg text-lg text-left min-h-[60px] flex items-center ${
                    frequentPhrases.some(fp => fp.text === phrase.text)
                      ? isDarkMode 
                        ? 'bg-amber-900 text-amber-100 hover:bg-amber-800' 
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {phrase.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Long phrases - 1 column for better readability */}
        {longPhrases.length > 0 && !showingEmergency && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Detailed Phrases</h3>
            <div className="grid grid-cols-1 gap-3">
              {longPhrases.map(phrase => (
                <button
                  key={phrase.id}
                  onClick={() => handlePhraseClick(phrase)}
                  className={`px-4 py-3 rounded-lg text-lg text-left min-h-[70px] flex items-center ${
                    frequentPhrases.some(fp => fp.text === phrase.text)
                      ? isDarkMode 
                        ? 'bg-amber-900 text-amber-100 hover:bg-amber-800' 
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {phrase.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Non-emergency phrases when showing emergency category */}
        {showingEmergency && nonEmergencyPhrases.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Other Phrases</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nonEmergencyPhrases.map(phrase => (
                <button
                  key={phrase.id}
                  onClick={() => handlePhraseClick(phrase)}
                  className={`px-4 py-3 rounded-lg text-lg text-left min-h-[60px] flex items-center ${
                    frequentPhrases.some(fp => fp.text === phrase.text)
                      ? isDarkMode 
                        ? 'bg-amber-900 text-amber-100 hover:bg-amber-800' 
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium'
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {phrase.text}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {displayPhrases.length === 0 && (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>No phrases found</p>
        )}
      </div>
    </div>
  );
};

export default PhrasesPanel;
