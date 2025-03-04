import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import PhrasesPanel from './components/PhrasesPanel';
import HistoryPanel from './components/HistoryPanel';
import SettingsModal from './components/SettingsModal';
import { categories, phrases } from './data/phrases';
import { elevenlabsService } from './services/elevenlabs';
import { openaiService } from './services/openai';
import { VoiceSettings, Phrase, UsagePattern } from './types';

function App() {
  const [currentText, setCurrentText] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [usagePatterns, setUsagePatterns] = useState<UsagePattern[]>([]);
  const [frequentPhrases, setFrequentPhrases] = useState<Phrase[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voiceId: "H7ZtEYgvMq3Y1gCSSZG4", // Default voice ID
    modelId: "eleven_flash_v2_5",
    outputFormat: "mp3_44100_128",
    speed: 1.0,
    stability: 0.7
  });

  // Load settings and usage data from localStorage on initial render
  useEffect(() => {
    const savedElevenlabsApiKey = localStorage.getItem('elevenlabsApiKey');
    const savedOpenaiApiKey = localStorage.getItem('openaiApiKey');
    const savedVoiceSettings = localStorage.getItem('voiceSettings');
    const savedHistory = localStorage.getItem('messageHistory');
    const savedUsagePatterns = localStorage.getItem('usagePatterns');
    const savedIsMuted = localStorage.getItem('isMuted');
    const savedIsDarkMode = localStorage.getItem('isDarkMode');
    
    if (savedElevenlabsApiKey) {
      setElevenlabsApiKey(savedElevenlabsApiKey);
      elevenlabsService.initialize(savedElevenlabsApiKey);
    }
    
    if (savedOpenaiApiKey) {
      setOpenaiApiKey(savedOpenaiApiKey);
      openaiService.initialize(savedOpenaiApiKey);
    }
    
    if (savedVoiceSettings) {
      try {
        const parsedSettings = JSON.parse(savedVoiceSettings);
        setVoiceSettings(parsedSettings);
        elevenlabsService.updateVoiceSettings(parsedSettings);
      } catch (e) {
        console.error("Error parsing saved voice settings:", e);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error parsing saved history:", e);
      }
    }

    if (savedUsagePatterns) {
      try {
        setUsagePatterns(JSON.parse(savedUsagePatterns));
      } catch (e) {
        console.error("Error parsing saved usage patterns:", e);
      }
    }

    if (savedIsMuted) {
      setIsMuted(savedIsMuted === 'true');
    }

    if (savedIsDarkMode) {
      const darkMode = savedIsDarkMode === 'true';
      setIsDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }

    // Calculate frequent phrases based on usage patterns
    updateFrequentPhrases();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (elevenlabsApiKey) {
      localStorage.setItem('elevenlabsApiKey', elevenlabsApiKey);
      elevenlabsService.initialize(elevenlabsApiKey);
    }
    
    if (openaiApiKey) {
      localStorage.setItem('openaiApiKey', openaiApiKey);
      openaiService.initialize(openaiApiKey);
    }
    
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
    elevenlabsService.updateVoiceSettings(voiceSettings);
  }, [elevenlabsApiKey, openaiApiKey, voiceSettings]);

  // Save history and usage patterns when they change
  useEffect(() => {
    localStorage.setItem('messageHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('usagePatterns', JSON.stringify(usagePatterns));
    updateFrequentPhrases();
  }, [usagePatterns]);

  // Save mute and dark mode preferences
  useEffect(() => {
    localStorage.setItem('isMuted', isMuted.toString());
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Add meta viewport tag for better mobile experience
  useEffect(() => {
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(metaViewport);

    return () => {
      document.head.removeChild(metaViewport);
    };
  }, []);

  // Monitor battery status if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      const updateBatteryStatus = (battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      };
      
      // @ts-ignore - getBattery is not in the standard navigator type
      navigator.getBattery().then(updateBatteryStatus);
    }
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Prevent screen from sleeping
  useEffect(() => {
    let wakeLock: any = null;
    
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          // @ts-ignore - wakeLock is not in the standard navigator type
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error('Wake Lock error:', err);
        }
      }
    };
    
    requestWakeLock();
    
    // Re-request wake lock when document becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wakeLock === null) {
        requestWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock) wakeLock.release();
    };
  }, []);

  const updateFrequentPhrases = () => {
    // Create a map to count phrase usage
    const phraseCounts = new Map<string, number>();
    
    // Count direct phrase usage
    usagePatterns.forEach(pattern => {
      if (pattern.type === 'phrase') {
        const count = phraseCounts.get(pattern.text) || 0;
        phraseCounts.set(pattern.text, count + 1);
      }
    });
    
    // Sort phrases by usage count
    const sortedPhrases = Array.from(phraseCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Get the corresponding phrase objects for the top used phrases
    const topPhrases = sortedPhrases
      .slice(0, 10)
      .map(text => {
        const phrase = phrases.find(p => p.text === text);
        return phrase || { 
          id: `frequent-${text.substring(0, 10)}`, 
          text, 
          category: 'frequent' 
        };
      });
    
    setFrequentPhrases(topPhrases);
  };

  const recordUsagePattern = (text: string, type: 'phrase' | 'custom' | 'suggestion') => {
    const timestamp = new Date().toISOString();
    const lastPattern = usagePatterns.length > 0 ? usagePatterns[0] : null;
    
    // Create new pattern
    const newPattern: UsagePattern = {
      text,
      timestamp,
      type,
      previousText: lastPattern?.text || null
    };
    
    // Add to patterns
    setUsagePatterns(prev => [newPattern, ...prev].slice(0, 100)); // Keep last 100 patterns
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      setLastSpokenText(text);
      
      if (elevenlabsApiKey && !isMuted) {
        await elevenlabsService.speak(text);
      } else if (!elevenlabsApiKey) {
        alert("Please enter your ElevenLabs API key in settings to enable text-to-speech.");
      }
      
      // Add to history
      setHistory(prev => [text, ...prev].slice(0, 20));
      
      // Record usage pattern (determine type)
      const isPhrase = phrases.some(p => p.text === text);
      const isSuggestion = suggestions.includes(text);
      const type = isPhrase ? 'phrase' : (isSuggestion ? 'suggestion' : 'custom');
      recordUsagePattern(text, type);
      
      // Clear current text
      setCurrentText('');
      
      // Get new contextual suggestions based on what was just said
      if (openaiApiKey && !isOffline) {
        getContextualSuggestions(text);
      } else if (!isOffline) {
        // If offline, use only local suggestions
        const alsSpecificFollowUps = getALSSpecificFollowUps(text);
        setSuggestions(alsSpecificFollowUps);
      }
    } catch (error) {
      console.error("Error speaking text:", error);
      alert("There was an error generating speech. Please check your API key and try again.");
    }
  };

  const getContextualSuggestions = async (text: string) => {
    try {
      // Get suggestions based on what was just said
      const aiSuggestions = await openaiService.suggestResponses(text);
      
      // Find patterns where this text was used before
      const relatedPatterns = usagePatterns
        .filter(pattern => pattern.previousText === text)
        .slice(0, 2)
        .map(pattern => pattern.text);
      
      // Get common ALS-specific follow-ups based on the context
      const alsSpecificFollowUps = getALSSpecificFollowUps(text);
      
      // Combine AI suggestions with learned patterns and ALS-specific follow-ups, removing duplicates
      const combinedSuggestions = [...new Set([
        ...aiSuggestions,
        ...alsSpecificFollowUps,
        ...relatedPatterns
      ])].slice(0, 5);
      
      setSuggestions(combinedSuggestions);
    } catch (error) {
      console.error("Error getting contextual suggestions:", error);
      // Fallback to local suggestions if API fails
      const alsSpecificFollowUps = getALSSpecificFollowUps(text);
      setSuggestions(alsSpecificFollowUps);
    }
  };

  // Function to provide ALS-specific follow-up suggestions based on context
  const getALSSpecificFollowUps = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    
    // Common follow-ups for different contexts
    if (lowerText.includes("pain") || lowerText.includes("hurt")) {
      return ["Where", "Scale 1-10", "Need medicine"];
    }
    
    if (lowerText.includes("help")) {
      return ["Reposition me", "Can't breathe", "Need water"];
    }
    
    if (lowerText.includes("thirsty") || lowerText.includes("water")) {
      return ["With straw", "Just a little", "Ice chips"];
    }
    
    if (lowerText.includes("position") || lowerText.includes("uncomfortable")) {
      return ["Move up", "Turn left", "Turn right", "Adjust pillow"];
    }
    
    if (lowerText.includes("thank")) {
      return ["Much better", "Appreciate it", "Stay please"];
    }
    
    if (lowerText.includes("breathe") || lowerText.includes("breathing")) {
      return ["Need suction", "Adjust vent", "Raise head", "Anxious"];
    }
    
    if (lowerText.includes("tired") || lowerText.includes("rest")) {
      return ["Sleep now", "Lights off", "Too hot/cold", "Close curtains"];
    }
    
    if (lowerText.includes("family") || lowerText.includes("call")) {
      return ["Call spouse", "Video call", "Show photos", "Read messages"];
    }
    
    // Default follow-ups for any context
    return ["Yes", "No", "Need more help", "That's enough"];
  };

  const handlePhraseClick = (phrase: Phrase) => {
    handleSend(phrase.text);
  };

  const handleTextChange = (text: string) => {
    setCurrentText(text);
  };

  const handleRequestCompletion = async () => {
    if (!currentText.trim() || (!openaiApiKey && !isOffline)) return;
    
    try {
      if (!isOffline) {
        // Get text completion suggestions
        const completedText = await openaiService.completeText(currentText);
        
        // Get additional response suggestions
        const responseSuggestions = await openaiService.suggestResponses(currentText);
        
        // Find patterns where similar text was entered before
        const similarPatterns = usagePatterns
          .filter(pattern => 
            currentText.length > 3 && 
            pattern.text.toLowerCase().includes(currentText.toLowerCase())
          )
          .slice(0, 2)
          .map(pattern => pattern.text);
        
        // Get ALS-specific completions based on partial text
        const alsSpecificCompletions = getALSSpecificCompletions(currentText);
        
        // Combine all suggestions, removing duplicates
        const allSuggestions = [...new Set([
          completedText,
          ...alsSpecificCompletions,
          ...responseSuggestions.filter(s => s !== completedText),
          ...similarPatterns
        ])];
        
        // Update suggestions (limit to 5)
        setSuggestions(allSuggestions.slice(0, 5));
      } else {
        // Offline mode - use only local suggestions
        const alsSpecificCompletions = getALSSpecificCompletions(currentText);
        setSuggestions(alsSpecificCompletions);
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      // Fallback to local suggestions if API fails
      const alsSpecificCompletions = getALSSpecificCompletions(currentText);
      setSuggestions(alsSpecificCompletions);
    }
  };

  // Function to provide ALS-specific completions based on partial text
  const getALSSpecificCompletions = (partialText: string): string[] => {
    const lowerText = partialText.toLowerCase();
    
    // Common completions for different partial texts
    if (lowerText.includes("i need")) {
      return ["I need bathroom", "I need repositioning", "I need medicine"];
    }
    
    if (lowerText.includes("can you")) {
      return ["Can you adjust pillow", "Can you turn TV", "Can you call family"];
    }
    
    if (lowerText.includes("i feel")) {
      return ["I feel uncomfortable", "I feel pain", "I feel anxious", "I feel tired"];
    }
    
    if (lowerText.includes("i want")) {
      return ["I want water", "I want rest", "I want family"];
    }
    
    if (lowerText.includes("please")) {
      return ["Please help sit up", "Please adjust blanket", "Please stay"];
    }
    
    if (lowerText.includes("i'm having")) {
      return ["I'm having trouble breathing", "I'm having pain", "I'm having anxiety"];
    }
    
    if (lowerText.includes("too")) {
      return ["Too hot", "Too cold", "Too bright", "Too loud", "Too uncomfortable"];
    }
    
    if (lowerText.includes("need")) {
      return ["Need bathroom", "Need medicine", "Need water", "Need rest"];
    }
    
    // Default completions for any partial text
    return [];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleVoiceSettingsChange = (settings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...settings }));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleRepeatLastPhrase = () => {
    if (lastSpokenText) {
      handleSend(lastSpokenText);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'} flex flex-col`}>
      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        onToggleMute={handleToggleMute}
        isMuted={isMuted}
        onToggleDarkMode={handleToggleDarkMode}
        isDarkMode={isDarkMode}
        batteryLevel={batteryLevel}
      />
      
      {isOffline && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 text-center">
          You're offline. Some features may be limited.
        </div>
      )}
      
      <main className={`flex-grow container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-7xl ${isDarkMode ? 'dark:text-white' : ''}`}>
        {/* iPad Dashboard Layout */}
        <div className="flex flex-col h-full">
          {/* Centered Text Input Area */}
          <div className="mx-auto w-full max-w-3xl mb-4">
            <TextInput 
              onSend={handleSend} 
              onTextChange={handleTextChange}
              onRequestCompletion={handleRequestCompletion}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              quickPhrases={phrases.filter(p => p.category === "basic").slice(0, 6)}
              onPhraseClick={handlePhraseClick}
              onRepeatLastPhrase={handleRepeatLastPhrase}
              lastSpokenText={lastSpokenText}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {/* Dashboard Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* History Panel - 1/3 width on tablet/desktop */}
            <div className="md:col-span-1">
              <HistoryPanel 
                history={history} 
                onSpeak={handleSend}
                onClear={handleClearHistory}
                isDarkMode={isDarkMode}
              />
            </div>
            
            {/* Phrases Panel - 2/3 width on tablet/desktop */}
            <div className="md:col-span-2">
              <PhrasesPanel 
                categories={categories} 
                phrases={phrases}
                frequentPhrases={frequentPhrases}
                onPhraseClick={handlePhraseClick}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </main>
      
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        voiceSettings={voiceSettings}
        onVoiceSettingsChange={handleVoiceSettingsChange}
        elevenlabsApiKey={elevenlabsApiKey}
        onElevenlabsApiKeyChange={setElevenlabsApiKey}
        openaiApiKey={openaiApiKey}
        onOpenaiApiKeyChange={setOpenaiApiKey}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;
