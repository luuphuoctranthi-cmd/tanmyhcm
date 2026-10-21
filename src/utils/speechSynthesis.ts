/**
 * Text-to-Speech helper using window.speechSynthesis
 * Optimized for clear Vietnamese public administration announcements
 */

export interface SpeechVoiceOption {
  voice: SpeechSynthesisVoice;
  isVietnamese: boolean;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices.length > 0 ? cachedVoices : voices;
}

export function findVietnameseVoice(): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices();
  if (!voices.length) return null;

  // 1. Try finding explicit Vietnamese voice (vi-VN or vi_VN)
  const viVoice = voices.find(
    v => v.lang.toLowerCase().replace('_', '-').startsWith('vi')
  );
  if (viVoice) return viVoice;

  // 2. Fallback to Google Vietnamese voice if name matches
  const googleVi = voices.find(v => v.name.toLowerCase().includes('vietnam') || v.name.toLowerCase().includes('tiếng việt'));
  if (googleVi) return googleVi;

  // 3. Fallback to default
  const defaultVoice = voices.find(v => v.default);
  return defaultVoice || voices[0] || null;
}

class TextToSpeechManager {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSynthesizing = false;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  public speak(
    text: string,
    options: {
      rate?: number; // 0.85 - 1.15
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (!this.isSupported()) {
      options.onError?.(new Error('Trình duyệt không hỗ trợ Text-to-Speech'));
      return;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const voice = findVietnameseVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'vi-VN';
      } else {
        utterance.lang = 'vi-VN';
      }

      utterance.rate = options.rate ?? 0.95; // Slightly slower, very articulate for elderly
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onstart = () => {
        this.isSynthesizing = true;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isSynthesizing = false;
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSynthesizing = false;
        this.currentUtterance = null;
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e);
          options.onError?.(e);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS execution failed:', err);
      options.onError?.(err);
    }
  }

  public pause(): void {
    if (this.isSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.isSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.isSynthesizing = false;
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSupported() && (window.speechSynthesis.speaking || this.isSynthesizing);
  }

  public isPaused(): boolean {
    return this.isSupported() && window.speechSynthesis.paused;
  }
}

export const ttsManager = new TextToSpeechManager();
