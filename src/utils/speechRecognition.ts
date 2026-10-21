/**
 * Web Speech Recognition helper configured for Vietnamese (vi-VN)
 */

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export interface SpeechRecognitionListener {
  onStart?: () => void;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export class VoiceRecognitionService {
  private recognitionInstance: any = null;
  private isListening = false;
  private currentListener: SpeechRecognitionListener | null = null;

  public start(listener: SpeechRecognitionListener): boolean {
    if (!isSpeechRecognitionSupported()) {
      listener.onError?.(
        'Trình duyệt này không hỗ trợ nhận dạng giọng nói trực tiếp qua Web Speech API. Bác có thể nhập từ khóa hoặc dùng danh sách chọn nhanh bên dưới.'
      );
      return false;
    }

    try {
      this.stop();

      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognitionClass();
      this.recognitionInstance = recognition;
      this.currentListener = listener;

      recognition.lang = 'vi-VN';
      recognition.continuous = false; // Stop after speaking the intent
      recognition.interimResults = true; // Show words as citizen speaks
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isListening = true;
        listener.onStart?.();
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const spoken = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        listener.onResult?.(spoken.trim(), isFinal);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event);
        this.isListening = false;

        let friendlyMsg = 'Không nhận diện được giọng nói. Xin vui lòng thử lại.';
        if (event.error === 'not-allowed') {
          friendlyMsg = 'Vui lòng cho phép quyền truy cập Micro trên trình duyệt để sử dụng trợ lý giọng nói.';
        } else if (event.error === 'no-speech') {
          friendlyMsg = 'Chưa nghe thấy giọng nói của Bác/Cô/Chú. Xin vui lòng bấm lại micro và nói to rõ hơn.';
        } else if (event.error === 'network') {
          friendlyMsg = 'Kiểm tra lại kết nối mạng để dùng tính năng nhận dạng giọng nói.';
        }
        listener.onError?.(friendlyMsg);
      };

      recognition.onend = () => {
        this.isListening = false;
        listener.onEnd?.();
      };

      recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      listener.onError?.('Không thể khởi động micro. Xin vui lòng thử lại hoặc cấp quyền micro.');
      return false;
    }
  }

  public stop(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.abort();
      } catch (e) {
        // ignore
      }
      this.recognitionInstance = null;
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceService = new VoiceRecognitionService();
