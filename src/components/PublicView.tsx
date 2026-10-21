import React, { useState, useEffect, useRef } from 'react';
import { Procedure, AppStatistics } from '../types';
import { matchProcedureByVoice, getPhaseVoiceScript, matchDocumentCheckboxVoice } from '../utils/matching';
import { voiceService, isSpeechRecognitionSupported } from '../utils/speechRecognition';
import { ttsManager } from '../utils/speechSynthesis';
import { getStoredStats, incrementVoiceQuery, recordCitizenRating, recordLike, recordVisit } from '../utils/statsStorage';
import { askConversationalAssistant } from '../utils/conversationalAi';
import { playCheckChime, playSuccessChime } from '../utils/audioChime';
import { VideoTutorialModal } from './VideoTutorialModal';
import {
  Mic,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  QrCode,
  AlertCircle,
  X,
  CheckSquare,
  Square,
  Video,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Heart,
  Star,
  Users,
  Smile,
  TrendingUp,
  Award,
  ArrowLeft,
  Headphones,
  CheckCircle2,
  CheckCheck
} from 'lucide-react';

import { CitizenPortalLayoutConfig } from '../data/portalNavSettings';

interface PublicViewProps {
  procedures: Procedure[];
  onUpdateProcedureVideo?: (procedureId: string, videoDataUrl: string, fileName: string) => void;
  initialSelectedProcedure?: Procedure | null;
  layoutConfig?: CitizenPortalLayoutConfig;
}

type GuidancePhase = 'docs' | 'steps' | 'ready';

export const PublicView: React.FC<PublicViewProps> = ({
  procedures,
  onUpdateProcedureVideo,
  initialSelectedProcedure,
  layoutConfig
}) => {
  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Procedure state
  const [matchedProcedure, setMatchedProcedure] = useState<Procedure | null>(() => initialSelectedProcedure || null);
  const [isUnrecognized, setIsUnrecognized] = useState(false);

  // General Q&A state (when query is not a specific procedure name)
  const [generalAnswer, setGeneralAnswer] = useState<string | null>(null);
  const [isAnsweringGeneral, setIsAnsweringGeneral] = useState(false);

  // Progressive Guidance Phase: ONLY current phase is visible!
  // Step 1: 'docs' -> Step 2: 'steps' -> Step 3: 'ready'
  const [currentPhase, setCurrentPhase] = useState<GuidancePhase>('docs');

  // Audio / Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate] = useState<number>(0.92);

  // Voice Checklist states (Checkbox kết hợp với giọng nói)
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [isListeningForDocs, setIsListeningForDocs] = useState(false);
  const [voiceCheckboxFeedback, setVoiceCheckboxFeedback] = useState<string | null>(null);

  // Live Statistics & Ratings
  const [stats, setStats] = useState<AppStatistics>(() => getStoredStats());
  const [userHasRated, setUserHasRated] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(false);

  // Modals
  const [showQrModal, setShowQrModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Record actual visit & subscribe to stats updates (including reset to 0 by officer)
  useEffect(() => {
    const freshStats = recordVisit();
    setStats(freshStats);

    const handleStatsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<AppStatistics>;
      if (customEvent.detail) {
        setStats(customEvent.detail);
      } else {
        setStats(getStoredStats());
      }
    };

    window.addEventListener('tanmy_stats_updated', handleStatsUpdated);
    return () => {
      window.removeEventListener('tanmy_stats_updated', handleStatsUpdated);
    };
  }, []);

  // Cleanup speech when unmounting
  useEffect(() => {
    return () => {
      voiceService.stop();
      ttsManager.stop();
    };
  }, []);

  // React to initialSelectedProcedure from other tabs (e.g. Procedures repository)
  useEffect(() => {
    if (initialSelectedProcedure) {
      setMatchedProcedure(initialSelectedProcedure);
      setCurrentPhase('docs');
      setCheckedDocs({});
      setVoiceCheckboxFeedback(null);
      setGeneralAnswer(null);
      setIsUnrecognized(false);
      runProgressiveAudioSequence(initialSelectedProcedure, 'docs');
    }
  }, [initialSelectedProcedure]);

  // Check if all required docs are checked
  const allRequiredChecked = matchedProcedure
    ? matchedProcedure.requiredDocuments.every(
        doc => !doc.isRequired || checkedDocs[doc.name]
      )
    : false;

  // Handle Main Voice Recognition (from the big red microphone)
  const handleRecognizedText = async (spokenText: string) => {
    setTranscript(spokenText);
    setErrorMessage(null);
    setGeneralAnswer(null);

    // 1. Try to match procedure from official database (Zero-hallucination)
    const match = matchProcedureByVoice(spokenText, procedures);

    if (match) {
      setMatchedProcedure(match.procedure);
      setIsUnrecognized(false);
      setCheckedDocs({});
      setCurrentPhase('docs');
      setVoiceCheckboxFeedback(null);

      // Update statistics
      const updatedStats = incrementVoiceQuery(match.procedure.id);
      setStats(updatedStats);

      // Start Progressive Voice Sequence: Step 1 (docs) -> Step 2 (steps) -> Step 3 (ready)
      runProgressiveAudioSequence(match.procedure, 'docs');
    } else {
      // 2. If not a specific procedure, check if it is a general administrative question
      setIsAnsweringGeneral(true);
      const answer = await askConversationalAssistant(spokenText, procedures);
      setIsAnsweringGeneral(false);

      if (answer && answer.trim()) {
        setGeneralAnswer(answer);
        setIsUnrecognized(false);

        // Speak aloud the answer
        ttsManager.speak(answer, {
          rate: speechRate,
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false)
        });
      } else {
        setMatchedProcedure(null);
        setIsUnrecognized(true);

        const gentleMessage =
          'Chưa tìm thấy thủ tục phù hợp. Bạn hãy bấm lại chiếc micro màu đỏ và nói tên thủ tục như khai sinh, kết hôn, tạm trú hoặc công chứng.';
        ttsManager.speak(gentleMessage, {
          rate: speechRate,
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false)
        });
      }
    }
  };

  /**
   * SEQUENCE PROGRESSION:
   * "Và khi nói tới đâu thì các cái thông tin hướng dẫn sẽ hiện tới đó và phần nào đã nói qua rồi thì nó sẽ tự ẩn đi, mất đi."
   */
  const runProgressiveAudioSequence = (proc: Procedure, phase: GuidancePhase) => {
    setCurrentPhase(phase);
    const script = getPhaseVoiceScript(proc, phase);

    setIsSpeaking(true);
    setIsPaused(false);

    ttsManager.speak(script, {
      rate: speechRate,
      onStart: () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);

        // When Step 1 finishes speaking -> Step 1 disappears, Step 2 appears & speaks
        if (phase === 'docs') {
          setTimeout(() => {
            runProgressiveAudioSequence(proc, 'steps');
          }, 900);
        }
        // When Step 2 finishes speaking -> Step 2 disappears, Step 3 appears & speaks closing CTA
        else if (phase === 'steps') {
          setTimeout(() => {
            runProgressiveAudioSequence(proc, 'ready');
          }, 900);
        }
      },
      onError: () => {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    });
  };

  // Switch phase manually
  const handleManualPhaseSelect = (phase: GuidancePhase) => {
    if (!matchedProcedure) return;
    setCurrentPhase(phase);
    const script = getPhaseVoiceScript(matchedProcedure, phase);

    setIsSpeaking(true);
    setIsPaused(false);
    ttsManager.speak(script, {
      rate: speechRate,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  // Toggle main red microphone listening
  const toggleListening = () => {
    if (isListening) {
      voiceService.stop();
      setIsListening(false);
      return;
    }

    ttsManager.stop();
    setIsSpeaking(false);
    setErrorMessage(null);
    setIsUnrecognized(false);
    setGeneralAnswer(null);

    const started = voiceService.start({
      onStart: () => {
        setIsListening(true);
        setTranscript('');
      },
      onResult: (spoken, isFinal) => {
        setTranscript(spoken);
        if (isFinal && spoken.trim()) {
          setIsListening(false);
          handleRecognizedText(spoken);
        }
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(err);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!started && !isSpeechRecognitionSupported()) {
      setErrorMessage('Trình duyệt chưa hỗ trợ Web Speech API. Bạn vui lòng sử dụng Google Chrome hoặc Microsoft Edge.');
    }
  };

  // Voice Checklist Handler (Checkbox kết hợp với giọng nói)
  const toggleVoiceChecklistListening = () => {
    if (isListeningForDocs) {
      voiceService.stop();
      setIsListeningForDocs(false);
      return;
    }

    ttsManager.stop();
    setIsSpeaking(false);
    setVoiceCheckboxFeedback('Đang lắng nghe... Hãy nói tên giấy tờ bạn đã có (Ví dụ: "Có căn cước", "Đã có đủ hết")');

    const started = voiceService.start({
      onStart: () => {
        setIsListeningForDocs(true);
      },
      onResult: (spoken, isFinal) => {
        if (!matchedProcedure) return;

        if (spoken.trim()) {
          const action = matchDocumentCheckboxVoice(spoken, matchedProcedure.requiredDocuments);
          if (action) {
            if (action.action === 'check_all') {
              const allChecked: Record<string, boolean> = {};
              matchedProcedure.requiredDocuments.forEach(d => {
                allChecked[d.name] = true;
              });
              setCheckedDocs(allChecked);
              setVoiceCheckboxFeedback(`✓ ${action.feedbackMessage}`);
              playSuccessChime();
            } else if (action.action === 'uncheck_all') {
              setCheckedDocs({});
              setVoiceCheckboxFeedback(`✓ ${action.feedbackMessage}`);
            } else if (action.action === 'check' && action.targetDocName) {
              setCheckedDocs(prev => ({ ...prev, [action.targetDocName!]: true }));
              setVoiceCheckboxFeedback(`✓ ${action.feedbackMessage}`);
              playCheckChime();
            } else if (action.action === 'uncheck' && action.targetDocName) {
              setCheckedDocs(prev => ({ ...prev, [action.targetDocName!]: false }));
              setVoiceCheckboxFeedback(`✓ ${action.feedbackMessage}`);
            }
          } else {
            setVoiceCheckboxFeedback(`Đã nghe: "${spoken}". Bạn hãy nói rõ tên giấy tờ hoặc nói "Đã có đủ hết".`);
          }
        }

        if (isFinal) {
          setIsListeningForDocs(false);
        }
      },
      onError: (err) => {
        setIsListeningForDocs(false);
        setVoiceCheckboxFeedback(`Lỗi mic: ${err}`);
      },
      onEnd: () => {
        setIsListeningForDocs(false);
      }
    });

    if (!started && !isSpeechRecognitionSupported()) {
      setVoiceCheckboxFeedback('Trình duyệt chưa hỗ trợ ghi âm.');
    }
  };

  // Manual Checkbox Click
  const toggleDocumentCheck = (docName: string) => {
    setCheckedDocs(prev => {
      const nextState = !prev[docName];
      if (nextState) {
        playCheckChime();
      }
      return {
        ...prev,
        [docName]: nextState
      };
    });
  };

  const handleCheckAllDocs = () => {
    if (!matchedProcedure) return;
    const all: Record<string, boolean> = {};
    matchedProcedure.requiredDocuments.forEach(d => {
      all[d.name] = true;
    });
    setCheckedDocs(all);
    playSuccessChime();
    setVoiceCheckboxFeedback('✓ Đã tích chọn tất cả giấy tờ!');
  };

  // Reset back to Red Microphone
  const handleResetToMic = () => {
    ttsManager.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setMatchedProcedure(null);
    setGeneralAnswer(null);
    setTranscript('');
    setIsUnrecognized(false);
    setVoiceCheckboxFeedback(null);
  };

  // Audio Controls
  const handlePauseResumeTTS = () => {
    if (isPaused) {
      ttsManager.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      ttsManager.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStopTTS = () => {
    ttsManager.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleReplayCurrentTTS = () => {
    if (matchedProcedure) {
      handleManualPhaseSelect(currentPhase);
    } else if (generalAnswer) {
      ttsManager.speak(generalAnswer, {
        rate: speechRate,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  // Citizen Rating and Likes
  const handleRate = (star: number) => {
    if (userHasRated) return;
    const updated = recordCitizenRating(star, star >= 4);
    setStats(updated);
    setUserHasRated(true);
    playSuccessChime();
  };

  const handleLike = () => {
    if (userHasLiked) return;
    const updated = recordLike();
    setStats(updated);
    setUserHasLiked(true);
    playSuccessChime();
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. MÀN HÌNH BAN ĐẦU: CHỈ CÓ MICRO MÀU ĐỎ TRÒN DẠNG TRÒN "BẤM ĐỂ NÓI"      */}
      {/* User requirement:                                                         */}
      {/* "bạn sẽ để cho mình là một cái micro màu đỏ tròn, dạng tròn, và ghi cái    */}
      {/*  dòng chữ là Bấm để nói. Chỉ như vậy thôi."                               */}
      {/* ========================================================================= */}
      {!matchedProcedure && !generalAnswer && (
        <section className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200 shadow-xl space-y-8 animate-in fade-in">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {layoutConfig?.homeGreeting || 'Bạn cần làm thủ tục gì?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {layoutConfig?.homeSubDescription || 'Hệ thống hướng dẫn tự động bằng giọng nói dành cho công dân phường Tân Mỹ'}
            </p>
          </div>

          {/* Micro màu đỏ tròn dạng tròn, ghi dòng chữ "BẤM ĐỂ NÓI" */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Radar pulse ripples when active */}
              {isListening && (
                <>
                  <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-red-500/25 animate-ping pointer-events-none"></div>
                  <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-red-500/40 animate-pulse pointer-events-none"></div>
                </>
              )}

              <button
                type="button"
                onClick={toggleListening}
                className={`relative z-20 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none cursor-pointer bg-gradient-to-tr from-red-600 via-red-500 to-rose-600 text-white ${
                  isListening
                    ? 'scale-105 ring-8 ring-red-400/80 shadow-red-500/50 animate-mic-red'
                    : 'hover:scale-105 ring-8 ring-red-400/30 hover:ring-red-400/60 shadow-red-500/35'
                }`}
                aria-label={isListening ? 'Đang lắng nghe' : 'Bấm để nói'}
              >
                <Mic className={`w-16 h-16 sm:w-20 sm:h-20 text-white ${isListening ? 'animate-bounce' : ''}`} />
                <span className="text-sm sm:text-base font-black tracking-wider uppercase mt-2.5 text-white">
                  {isListening ? 'ĐANG LẮNG NGHE...' : 'BẤM ĐỂ NÓI'}
                </span>
              </button>
            </div>

            {/* Sound waves when listening */}
            {isListening && (
              <div className="flex items-center gap-1.5 mt-6">
                <span className="w-1.5 h-6 bg-red-400 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-10 bg-rose-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-14 bg-red-300 rounded-full animate-pulse"></span>
                <span className="w-1.5 h-8 bg-rose-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-5 bg-red-400 rounded-full animate-pulse"></span>
              </div>
            )}

            {/* Live feedback */}
            <div className="mt-6 min-h-[3rem] px-5 py-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-md w-full flex items-center justify-center text-center shadow-2xs">
              {isListening ? (
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>Đang nghe: <strong>"{transcript || 'Mời bạn bắt đầu nói...'}"</strong></span>
                </div>
              ) : transcript ? (
                <div className="text-slate-800 text-sm">
                  <span className="text-slate-500 text-xs uppercase font-bold mr-2">Đã nghe:</span>
                  <span className="font-bold text-red-600">"{transcript}"</span>
                </div>
              ) : (
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Bấm vào chiếc micro màu đỏ ở trên và nói tên thủ tục bạn cần làm
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {isUnrecognized && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 text-xs sm:text-sm text-center">
              Chưa tìm thấy thủ tục cho câu: <strong className="text-slate-900">"{transcript}"</strong>. Bạn hãy bấm lại chiếc micro màu đỏ và nói ngắn gọn (Ví dụ: "khai sinh", "kết hôn", "tạm trú", "chứng thực").
            </div>
          )}

          {isAnsweringGeneral && (
            <div className="flex items-center justify-center gap-2 text-xs text-blue-700 font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>Trợ lý số đang tìm câu trả lời giải đáp cho bạn...</span>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. MÀN HÌNH GIẢI ĐÁP CÂU HỎI HÀNH CHÍNH CHUNG (NẾU KHÔNG TRÙNG THỦ TỤC CỤ THỂ)*/}
      {/* ========================================================================= */}
      {!matchedProcedure && generalAnswer && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              type="button"
              onClick={handleResetToMic}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Bấm để hỏi lại / Thủ tục khác</span>
            </button>

            {isSpeaking && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Đang phát giọng nói...</span>
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                CÂU TRẢ LỜI CỦA TRỢ LÝ SỐ
              </span>
              {transcript && (
                <span className="text-xs text-slate-500 font-medium italic">
                  Cho câu hỏi: "{transcript}"
                </span>
              )}
            </div>

            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-200 text-slate-800 text-sm sm:text-base leading-relaxed">
              {generalAnswer}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleReplayCurrentTTS}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nghe lại</span>
              </button>
              {(isSpeaking || isPaused) && (
                <button
                  type="button"
                  onClick={handlePauseResumeTTS}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-300"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. MÀN HÌNH HƯỚNG DẪN THỦ TỤC THEO TIẾN TRÌNH TỰ ĐỘNG                     */}
      {/* User requirement:                                                         */}
      {/* - "khi người dân thực hiện bấm để nói thì cái micro nó sẽ tự ẩn đi"       */}
      {/* - "và khi nói tới đâu thì các cái thông tin hướng dẫn sẽ hiện tới đó       */}
      {/*    và phần nào đã nói qua rồi thì nó sẽ tự ẩn đi, mất đi."                */}
      {/* ========================================================================= */}
      {matchedProcedure && (
        <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
          {/* Top Control Bar: Quay lại & Tên thủ tục */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToMic}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Bấm để nói lại / Hỏi thủ tục khác</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Thủ tục:</span>
              <span className="text-xs sm:text-sm font-black text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {matchedProcedure.name}
              </span>
            </div>

            {/* Stepper Pills (Tùy chọn bấm xem lại nếu cần) */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleManualPhaseSelect('docs')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPhase === 'docs'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                1. Hồ sơ
              </button>
              <button
                type="button"
                onClick={() => handleManualPhaseSelect('steps')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPhase === 'steps'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                2. Các bước
              </button>
              <button
                type="button"
                onClick={() => handleManualPhaseSelect('ready')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  currentPhase === 'ready'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                3. Nộp hồ sơ
              </button>
            </div>
          </div>

          {/* Voice Player Status Bar */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-amber-200 text-amber-900'}`}>
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-amber-950">
                {isSpeaking ? 'AI đang đọc nội dung bước này...' : isPaused ? 'Đang tạm dừng đọc' : 'Đã đọc xong phần này'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking || isPaused ? (
                <button
                  type="button"
                  onClick={handlePauseResumeTTS}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                  <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleReplayCurrentTTS}
                className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-blue-200 rounded-lg font-bold text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đọc lại</span>
              </button>

              {(isSpeaking || isPaused) && (
                <button
                  type="button"
                  onClick={handleStopTTS}
                  className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* GIAI ĐOẠN 1: CHUẨN BỊ HỒ SƠ & CHECKBOX KẾT HỢP GIỌNG NÓI              */}
          {/* User requirement: "checkbox kết hợp với giọng nói"                     */}
          {/* Khi đọc xong -> Tự động ẩn đi và chuyển sang Bước 2!                  */}
          {/* --------------------------------------------------------------------- */}
          {currentPhase === 'docs' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-400 shadow-xl space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    1
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                      BƯỚC 1: CHUẨN BỊ HỒ SƠ
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Các loại hồ sơ giấy tờ bạn cần chuẩn bị
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 font-medium">
                    {matchedProcedure.counterDepartment}
                  </span>
                  <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-bold">
                    Lệ phí: {matchedProcedure.fee}
                  </span>
                </div>
              </div>

              {/* VOICE CHECKBOX CONTROLLER BAR (Checkbox kết hợp với giọng nói) */}
              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-3.5 rounded-2xl border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-950">
                  <CheckCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-extrabold block">TÍCH CHỌN BẰNG TAY HOẶC BẰNG GIỌNG NÓI</span>
                    <span className="text-[11px] text-amber-800">
                      Bấm vào từng ô hoặc bấm mic bên cạnh để nói giấy tờ bạn đã có (Ví dụ: "Đã có CCCD", "Có đủ hết")
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={toggleVoiceChecklistListening}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isListeningForDocs
                        ? 'bg-red-600 text-white animate-pulse ring-2 ring-red-400'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Mic className={`w-3.5 h-3.5 ${isListeningForDocs ? 'animate-bounce' : ''}`} />
                    <span>{isListeningForDocs ? 'Đang nghe...' : 'Nói để tick'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCheckAllDocs}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Đã có đủ hết
                  </button>
                </div>
              </div>

              {/* Voice feedback message */}
              {voiceCheckboxFeedback && (
                <div className="p-2.5 px-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{voiceCheckboxFeedback}</span>
                </div>
              )}

              {/* Interactive Checklist Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedProcedure.requiredDocuments.map((doc, dIdx) => {
                  const isChecked = Boolean(checkedDocs[doc.name]);
                  return (
                    <div
                      key={dIdx}
                      onClick={() => toggleDocumentCheck(doc.name)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-xs'
                          : 'bg-slate-50 hover:bg-amber-50/50 border-slate-200 hover:border-amber-300 text-slate-900'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isChecked ? (
                          <CheckSquare className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <Square className="w-6 h-6 text-slate-400 hover:text-amber-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm sm:text-base font-bold ${isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {doc.name}
                          </span>
                          {doc.isRequired ? (
                            <span className="text-[10px] uppercase font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                              Bắt buộc
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                              Nếu có
                            </span>
                          )}
                          {isChecked && (
                            <span className="text-[10px] uppercase font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Đã có
                            </span>
                          )}
                        </div>
                        {doc.note && (
                          <span className="text-xs text-slate-500 block mt-1">
                            {doc.note}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer CTA of Step 1 */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-amber-800 font-medium italic">
                  {allRequiredChecked
                    ? '✓ Bạn đã tích đủ các giấy tờ bắt buộc! Bấm nút bên phải để sang Bước 2.'
                    : 'AI đang đọc danh sách hồ sơ. Đọc xong sẽ tự động chuyển sang Bước 2...'}
                </span>
                <button
                  type="button"
                  onClick={() => handleManualPhaseSelect('steps')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs cursor-pointer"
                >
                  <span>Sang Bước 2: Hướng dẫn nộp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* GIAI ĐOẠN 2: CÁC BƯỚC THỰC HIỆN & ĐĂNG NHẬP VNEID                      */}
          {/* User requirement: "và phần nào đã nói qua rồi thì nó sẽ tự ẩn đi"       */}
          {/* Bước 1 đã biến mất hoàn toàn! Chỉ còn Bước 2!                          */}
          {/* --------------------------------------------------------------------- */}
          {currentPhase === 'steps' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-400 shadow-xl space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                    2
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 block">
                      BƯỚC 2: QUY TRÌNH THỰC HIỆN
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Các bước tiến hành & Cách Đăng nhập VNeID
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {matchedProcedure.steps.length} bước
                </span>
              </div>

              {/* Steps list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchedProcedure.steps.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs sm:text-sm">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* VNeID instructions */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-2">
                <h4 className="text-xs font-black uppercase text-blue-950 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-700" />
                  <span>2 CÁCH ĐĂNG NHẬP VNEID TRÊN CỔNG DỊCH VỤ CÔNG:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <strong className="text-blue-900 font-bold block">Cách 1: Quét mã QR bằng VNeID</strong>
                    <span>Mở ứng dụng VNeID trên điện thoại → Bấm nút "Quét mã QR" ở góc phải màn hình → Quét mã trên màn hình máy tính để đăng nhập ngay.</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                    <strong className="text-emerald-900 font-bold block">Cách 2: Nhập số định danh cá nhân</strong>
                    <span>Nhập 12 số CCCD + Mật khẩu VNeID → Nhập mã xác thực OTP gửi về điện thoại → Tiến hành nộp hồ sơ.</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleManualPhaseSelect('docs')}
                  className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Xem lại giấy tờ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleManualPhaseSelect('ready')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer"
                >
                  <span>Sang Bước 3: Nộp hồ sơ (Vùng nhấp nháy)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* GIAI ĐOẠN 3: VÙNG NHẤP NHÁY NỘP HỒ SƠ & VIDEO HƯỚNG DẪN                */}
          {/* Bước 2 đã biến mất! Chỉ còn lại vùng nhấp nháy hành động!              */}
          {/* --------------------------------------------------------------------- */}
          {currentPhase === 'ready' && (
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-3xl p-6 sm:p-10 border-2 border-emerald-400 shadow-xl space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-3 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  BƯỚC 3: TIẾN HÀNH ĐĂNG KÝ
                </span>

                {/* Exact requested sentence */}
                <h3 className="text-xl sm:text-2xl font-black text-emerald-950 leading-snug">
                  "Nếu bạn đã chuẩn bị đầy đủ hồ sơ, hãy bấm vào cái vùng đang nhấp nháy để tiến hành thực hiện việc đăng ký nhé. Chúc bạn thực hiện thành công."
                </h3>

                <p className="text-xs sm:text-sm text-emerald-800 font-medium">
                  Bấm vào nút màu xanh đang nhấp nháy bên dưới để mở trang nộp hồ sơ, hoặc xem video hướng dẫn thao tác trực tiếp.
                </p>
              </div>

              {/* Blinking Action Area */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href={matchedProcedure.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-2xl transition-all animate-action-blink cursor-pointer border-2 border-emerald-300"
                >
                  <span>NỘP HỒ SƠ TRỰC TUYẾN NGAY</span>
                  <ExternalLink className="w-6 h-6 flex-shrink-0" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-lg transition-all cursor-pointer border-2 border-amber-300"
                >
                  <Video className="w-6 h-6 text-slate-950 animate-pulse" />
                  <span>XEM VIDEO HƯỚNG DẪN THAO TÁC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="p-4 bg-white hover:bg-emerald-100 text-emerald-900 border-2 border-emerald-300 rounded-2xl font-bold text-sm shadow-xs cursor-pointer"
                  title="Quét mã QR mở trên điện thoại"
                >
                  <QrCode className="w-6 h-6 text-emerald-700" />
                </button>
              </div>

              <div className="pt-4 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleManualPhaseSelect('steps')}
                  className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-200 cursor-pointer"
                >
                  ← Xem lại các bước
                </button>
                <button
                  type="button"
                  onClick={() => handleManualPhaseSelect('docs')}
                  className="px-4 py-2 bg-white hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl border border-emerald-200 cursor-pointer"
                >
                  ← Xem lại giấy tờ
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. SỐ LIỆU THỐNG KÊ & MỨC ĐỘ HÀI LÒNG CỦA NHÂN DÂN                      */}
      {/* Thiết kế gọn gàng, nhỏ gọn, cân đối, phản ánh dữ liệu thực tế           */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              CHỈ SỐ TIẾP CẬN CÔNG DÂN & ĐÁNH GIÁ CHẤT LƯỢNG
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Thống kê ứng dụng & Mức độ hài lòng của nhân dân
            </h3>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                userHasLiked
                  ? 'bg-rose-50 text-rose-600 border-rose-300'
                  : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-600 border-slate-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{stats.likesCount} Thích</span>
            </button>
          </div>
        </div>

        {/* 4 Stat KPI Cards - Gọn gàng, cân đối */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Lượt truy cập</span>
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-slate-900 block font-mono">
              {stats.totalVisits.toLocaleString()}
            </strong>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Truy cập thực tế
            </span>
          </div>

          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Tra cứu giọng nói</span>
              <Mic className="w-3.5 h-3.5 text-red-500" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-slate-900 block font-mono">
              {stats.totalVoiceQueries.toLocaleString()}
            </strong>
            <span className="text-[10px] text-slate-500">
              Trợ giúp người cao tuổi
            </span>
          </div>

          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Mức độ hài lòng</span>
              <Smile className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-emerald-700 block font-mono">
              {stats.totalRatings > 0
                ? `${((stats.satisfiedVotes / stats.totalRatings) * 100).toFixed(1)}%`
                : '100%'}
            </strong>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {stats.satisfiedVotes} lượt rất hài lòng
            </span>
          </div>

          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200/80 space-y-0.5">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold">Điểm đánh giá</span>
              <Award className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <strong className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                {stats.totalRatings > 0 ? stats.averageRating.toFixed(1) : '5.0'}
              </strong>
              <span className="text-[11px] text-slate-400 font-semibold">/ 5.0</span>
            </div>
            <span className="text-[10px] text-slate-500">
              {stats.totalRatings} lượt phản hồi
            </span>
          </div>
        </div>

        {/* Interactive Citizen Rating Bar - Gọn nhẹ, thanh lịch */}
        <div className="bg-blue-50/60 rounded-xl p-3 sm:px-4 border border-blue-200/70 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-center sm:text-left">
            <h4 className="text-xs sm:text-sm font-bold text-blue-950">
              Đánh giá chất lượng phục vụ của trợ lý giọng nói:
            </h4>
            <p className="text-[11px] text-slate-500">
              Ý kiến bà con giúp nâng cao chất lượng Một cửa UBND Phường Tân Mỹ
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                disabled={userHasRated}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  userHasRated
                    ? 'opacity-80 text-amber-500 cursor-default'
                    : 'hover:bg-amber-100 hover:scale-110 text-slate-300 hover:text-amber-500'
                }`}
                title={`Đánh giá ${star} sao`}
              >
                <Star className={`w-5 h-5 ${star <= Math.round(stats.totalRatings > 0 ? stats.averageRating : 5) ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            ))}
            {userHasRated && (
              <span className="text-xs text-emerald-700 font-bold ml-1.5">
                ✓ Đã ghi nhận!
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Video Tutorial Modal */}
      {showVideoModal && matchedProcedure && (
        <VideoTutorialModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          procedure={matchedProcedure}
          onUpdateVideoFile={(videoDataUrl, fileName) => {
            onUpdateProcedureVideo?.(matchedProcedure.id, videoDataUrl, fileName);
            setMatchedProcedure(prev => prev ? { ...prev, videoDataUrl, videoFileName: fileName } : null);
          }}
        />
      )}

      {/* QR Code Modal for mobile scanning */}
      {showQrModal && matchedProcedure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">
                Quét mã để nộp trên điện thoại
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Dùng camera điện thoại hoặc Zalo quét mã QR để mở trang nộp hồ sơ của thủ tục <strong className="text-slate-900">{matchedProcedure.name}</strong>:
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  matchedProcedure.actionUrl
                )}`}
                alt="QR Code"
                className="w-48 h-48 mx-auto rounded-lg"
              />
            </div>

            <p className="text-[11px] text-slate-500 break-all">
              {matchedProcedure.actionUrl}
            </p>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
