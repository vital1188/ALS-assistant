import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { VoiceSettings } from '../types';
import { elevenlabsService } from '../services/elevenlabs';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceSettings: VoiceSettings;
  onVoiceSettingsChange: (settings: Partial<VoiceSettings>) => void;
  elevenlabsApiKey: string;
  onElevenlabsApiKeyChange: (apiKey: string) => void;
  openaiApiKey: string;
  onOpenaiApiKeyChange: (apiKey: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voiceSettings,
  onVoiceSettingsChange,
  elevenlabsApiKey,
  onElevenlabsApiKeyChange,
  openaiApiKey,
  onOpenaiApiKeyChange
}) => {
  const [voices, setVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && elevenlabsApiKey) {
      fetchVoices();
    }
  }, [isOpen, elevenlabsApiKey]);

  const fetchVoices = async () => {
    if (!elevenlabsApiKey) return;
    
    setLoading(true);
    try {
      elevenlabsService.initialize(elevenlabsApiKey);
      const voicesData = await elevenlabsService.getAvailableVoices();
      setVoices(voicesData.voices || []);
    } catch (error) {
      console.error("Error fetching voices:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">API Keys</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ElevenLabs API Key
              </label>
              <input
                type="password"
                value={elevenlabsApiKey}
                onChange={(e) => onElevenlabsApiKeyChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your ElevenLabs API key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiApiKey}
                onChange={(e) => onOpenaiApiKeyChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your OpenAI API key"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Voice Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                value={voiceSettings.voiceId}
                onChange={(e) => onVoiceSettingsChange({ voiceId: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading || voices.length === 0}
              >
                {loading ? (
                  <option>Loading voices...</option>
                ) : voices.length === 0 ? (
                  <option>Enter API key to load voices</option>
                ) : (
                  voices.map((voice) => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speech Speed: {voiceSettings.speed.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={voiceSettings.speed}
                onChange={(e) => onVoiceSettingsChange({ speed: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stability: {voiceSettings.stability.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={voiceSettings.stability}
                onChange={(e) => onVoiceSettingsChange({ stability: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
