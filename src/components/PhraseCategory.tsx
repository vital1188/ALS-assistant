import React from 'react';
import { Phrase } from '../types';
import { getCategoryIcon } from '../data/phrases';

interface PhraseCategoryProps {
  categoryId: string;
  categoryName: string;
  phrases: Phrase[];
  onPhraseClick: (phrase: Phrase) => void;
}

const PhraseCategory: React.FC<PhraseCategoryProps> = ({ 
  categoryId, 
  categoryName, 
  phrases, 
  onPhraseClick 
}) => {
  if (phrases.length === 0) return null;
  
  const Icon = getCategoryIcon(categoryId);

  return (
    <div className="mb-6">
      <h3 className="flex items-center gap-1 font-medium text-gray-700 mb-3">
        <Icon className="h-4 w-4" /> {categoryName}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {phrases.map(phrase => (
          <button
            key={phrase.id}
            onClick={() => onPhraseClick(phrase)}
            className="bg-gray-50 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors text-left min-h-[44px] touch-manipulation"
          >
            {phrase.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhraseCategory;
