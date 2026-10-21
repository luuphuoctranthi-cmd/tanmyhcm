import React, { useState, useEffect, useRef } from 'react';
import { Procedure } from '../types';
import { askCompanionChatbot, ChatHistoryItem } from '../utils/conversationalAi';
import { ttsManager } from '../utils/speechSynthesis';
import { voiceService, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { playSuccessChime, playCheckChime } from '../utils/audioChime';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
  RotateCcw,
  Heart,
  Stethoscope,
  FileText,
  Clock,
  HelpCircle
} from 'lucide-react';

interface CompanionChatbotProps {
  procedures: Procedure[];
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isMedicalOrLife?: boolean;
}

export const CompanionChatbot: React.FC<CompanionChatbotProps> = ({ procedures }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Xin chào bạn! Tôi là Trợ lý Số Đồng Hành của UBND Phường Tân Mỹ. Tôi có thể hỗ trợ bạn tra cứu mọi thủ tục hành chính của phường, cũng như đồng hành giải đáp các thắc mắc về y tế, sức khỏe và kiến thức đời sống. Bạn cần tôi giúp gì hôm nay?',
      timestamp: 'Vừa xong'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { label: 'Làm khai sinh cho con cần gì?', icon: FileText },
    { label: 'Lịch tiếp dân của Chủ tịch phường?', icon: Clock },
    { label: 'Cách đăng nhập VNeID nộp hồ sơ?', icon: HelpCircle },
    { label: 'Tư vấn dinh dưỡng cho người cao tuổi', icon: Stethoscope }
  ];

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Clean up voice when closing
  useEffect(() => {
    if (!isOpen) {
      ttsManager.stop();
      voiceService.stop();
      setIsListening(false);
      setCurrentlySpeakingId(null);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isThinking) return;

    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Build chat history for Gemini
    const history: ChatHistoryItem[] = messages.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    try {
      const replyText = await askCompanionChatbot(text, procedures, history);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      playCheckChime();

      // Read aloud if desired
      ttsManager.speak(replyText, {
        rate: 0.95,
        onStart: () => setCurrentlySpeakingId(botMsg.id),
        onEnd: () => setCurrentlySpeakingId(null),
        onError: () => setCurrentlySpeakingId(null)
      });
    } catch {
      const errorMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Dạ, hiện tại đường truyền đang bận một chút. Bạn vui lòng thử lại hoặc đến trực tiếp Quầy số 1 UBND Phường Tân Mỹ để được hỗ trợ nhé.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      voiceService.stop();
      setIsListening(false);
      return;
    }

    ttsManager.stop();
    setCurrentlySpeakingId(null);

    const started = voiceService.start({
      onStart: () => {
        setIsListening(true);
      },
      onResult: (spoken, isFinal) => {
        setInputText(spoken);
        if (isFinal && spoken.trim()) {
          setIsListening(false);
          handleSendMessage(spoken);
        }
      },
      onError: () => {
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!started && !isSpeechRecognitionSupported()) {
      alert('Trình duyệt chưa hỗ trợ ghi âm tiếng Việt.');
    }
  };

  const handleToggleSpeakMessage = (msg: Message) => {
    if (currentlySpeakingId === msg.id) {
      ttsManager.stop();
      setCurrentlySpeakingId(null);
    } else {
      ttsManager.stop();
      setCurrentlySpeakingId(msg.id);
      ttsManager.speak(msg.text, {
        rate: 0.95,
        onEnd: () => setCurrentlySpeakingId(null),
        onError: () => setCurrentlySpeakingId(null)
      });
    }
  };

  return (
    <>
      {/* 
        FLOATING TRIGGER BUTTON AT BOTTOM-RIGHT
      */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              playSuccessChime();
            }}
            className="group relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-700 to-indigo-900 text-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer border-2 border-amber-300 ring-4 ring-blue-500/30"
            aria-label="Mở Trợ lý AI đồng hành"
          >
            <Bot className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-amber-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* 
        CHAT WINDOW POPUP (BOTTOM-RIGHT)
      */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'w-72 h-14'
              : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-indigo-950 text-white p-3.5 px-4 flex items-center justify-between flex-shrink-0 border-b border-indigo-700">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300 border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black leading-tight">
                    Trợ lý Số Đồng Hành
                  </h4>
                  <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-blue-200">
                  Thủ tục Một cửa & Tư vấn đời sống, y tế
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-blue-200 hover:text-white transition-colors cursor-pointer"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-blue-200 hover:text-white transition-colors cursor-pointer"
                title="Đóng chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (Hidden when minimized) */}
          {!isMinimized && (
            <>
              {/* Messages scroll area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50 text-xs sm:text-sm">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';
                  const isSpeakingThis = currentlySpeakingId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBot && (
                        <div className="w-7 h-7 rounded-xl bg-indigo-700 text-amber-300 flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs mt-0.5">
                          AI
                        </div>
                      )}

                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-xs relative group ${
                          isBot
                            ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                            : 'bg-blue-600 text-white rounded-tr-none'
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>

                        <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-slate-100/40 text-[10px]">
                          <span className={isBot ? 'text-slate-400' : 'text-blue-200'}>
                            {msg.timestamp}
                          </span>

                          {isBot && (
                            <button
                              type="button"
                              onClick={() => handleToggleSpeakMessage(msg)}
                              className={`p-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                                isSpeakingThis
                                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                                  : 'text-slate-400 hover:text-blue-700 hover:bg-slate-100'
                              }`}
                              title={isSpeakingThis ? 'Dừng đọc' : 'Đọc câu trả lời'}
                            >
                              {isSpeakingThis ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                                  <span>Đang đọc...</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Nghe</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {!isBot && (
                        <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isThinking && (
                  <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 max-w-xs animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                    <span>Trợ lý đồng hành đang tra cứu và suy nghĩ...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestion pills */}
              <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {quickQuestions.map((q, idx) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q.label)}
                      className="flex-shrink-0 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-800 px-2.5 py-1 rounded-lg border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Icon className="w-3 h-3 text-blue-600" />
                      <span>{q.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={isListening ? 'Đang lắng nghe... bấm để dừng' : 'Bấm để nói bằng giọng nói'}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={isListening ? 'Đang lắng nghe bạn nói...' : 'Nhập câu hỏi thủ tục, đời sống, y tế...'}
                  className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isThinking}
                  className="p-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
