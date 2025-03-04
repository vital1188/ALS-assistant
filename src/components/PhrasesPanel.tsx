import React, { useState } from 'react';
import { Phrase, Category } from '../types';
import { Search, Star } from 'lucide-react';
import { getCategoryIcon } from '../data/phrases';

interface PhrasesPanelProps {
  categories: Category[];
  phrases: Phrase[];
  frequentPhrases: Phrase[];
  onPhraseClick: (phrase: Phrase) => void;
}

const PhrasesPanel: React.FC<PhrasesPanelProps> = ({ 
  categories, 
  phrases, 
  frequentPhrases,
  onPhraseClick 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allPhrases = [...phrases, ...frequentPhrases.filter(fp => 
    !phrases.some(p => p.text === fp.text)
  )];

  const filteredPhrases = allPhrases.filter(phrase => {
    const matchesSearch = searchQuery === '' || 
      phrase.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === null || 
      phrase.category === activeCategory || 
      (activeCategory === 'frequent' && frequentPhrases.some(fp => fp.text === phrase.text));
    return matchesSearch && matchesCategory;
  });

  // Get phrases for the active category or all if none selected
  const displayPhrases = activeCategory 
    ? (activeCategory === 'frequent' 
        ? filteredPhrases.filter(p => frequentPhrases.some(fp => fp.text === p.text))
        : filteredPhrases.filter(p => p.category === activeCategory))
    : filteredPhrases;

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search phrases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          />
          <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
        </div>
      </div>

      {/* Category tabs - large buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-3 rounded-lg text-lg font-medium ${
            activeCategory === null
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveCategory('frequent')}
          className={`px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 ${
            activeCategory === 'frequent'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Star className="h-5 w-5" /> Frequent
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-center gap-2 ${
              activeCategory === category.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {React.createElement(getCategoryIcon(category.id), { className: "h-5 w-5" })}
            {category.name}
          </button>
        ))}
      </div>

      {/* Phrases content - large buttons */}
      <div className="overflow-y-auto max-h-[calc(100vh-400px)] touch-pan-y">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayPhrases.map(phrase => (
            <button
              key={phrase.id}
              onClick={() => onPhraseClick(phrase)}
              className={`px-4 py-3 rounded-lg text-lg text-left min-h-[60px] flex items-center ${
                frequentPhrases.some(fp => fp.text === phrase.text)
                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {phrase.text}
            </button>
          ))}
        </div>
        
        {displayPhrases.length === 0 && (
          <p className="text-gray-500 text-center py-4">No phrases found</p>
        )}
      </div>
    </div>
  );
};

export default PhrasesPanel;
