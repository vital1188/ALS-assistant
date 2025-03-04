export interface VoiceSettings {
  voiceId: string;
  modelId: string;
  outputFormat: string;
  speed: number;
  stability: number;
}

export interface Phrase {
  id: string;
  text: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface UsagePattern {
  text: string;
  timestamp: string;
  type: 'phrase' | 'custom' | 'suggestion';
  previousText: string | null;
}
