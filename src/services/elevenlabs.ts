import { VoiceSettings } from "../types";

// Custom implementation for browser environment
class ElevenLabsService {
  private apiKey: string | null = null;
  private voiceSettings: VoiceSettings = {
    voiceId: "H7ZtEYgvMq3Y1gCSSZG4", // Default voice ID
    modelId: "eleven_flash_v2_5",
    outputFormat: "mp3_44100_128",
    speed: 1.0,
    stability: 0.7
  };

  initialize(apiKey: string) {
    this.apiKey = apiKey;
    return this;
  }

  updateVoiceSettings(settings: Partial<VoiceSettings>) {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
  }

  async speak(text: string): Promise<void> {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API key not set. Call initialize() first.");
    }

    try {
      // Direct API call instead of using the problematic library
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.voiceSettings.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: this.voiceSettings.modelId,
          voice_settings: {
            stability: this.voiceSettings.stability,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    } catch (error) {
      console.error("Error generating speech:", error);
      throw error;
    }
  }

  async getAvailableVoices() {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API key not set. Call initialize() first.");
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching voices:", error);
      throw error;
    }
  }
}

export const elevenlabsService = new ElevenLabsService();
