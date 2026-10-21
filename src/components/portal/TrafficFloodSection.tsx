import React, { useState } from 'react';
import { TrafficFloodReport, FloodLevel, TrafficLevel, StatusUpdateLog } from '../../types';
import { TrafficReportModal } from './TrafficReportModal';
import {
  Waves,
  Car,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Volume2,
  VolumeX,
  Navigation,
  ThumbsUp,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { ttsManager } from '../../utils/speechSynthesis';

interface TrafficFloodSectionProps {
  reports: TrafficFloodReport[];
  onAddReport: (report: TrafficFloodReport) => void;
  onUpdateReport: (report: TrafficFloodReport) => void;
  onDeleteReport?: (id: string) => void;
}

export const TrafficFloodSection: React.FC<TrafficFloodSectionProps> = ({
  reports,
  onAddReport,
  onUpdateReport,
  onDeleteReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'flooded' | 'jammed' | 'clear'>('all');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quick Status Update Modal for Citizens
  const [updatingReport, setUpdatingReport] = useState<TrafficFloodReport | null>(null);
  const [newFloodStatus, setNewFloodStatus] = useState<FloodLevel>('none');
  const [newTrafficStatus, setNewTrafficStatus] = useState<TrafficLevel>('clear');
  const [updateNote, setUpdateNote] = useState('');
  const [updaterName, setUpdaterName] = useState('Người dân địa phương');

  // Expanded history logs state
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Stats calculation
  const deepFloodedCount = reports.filter(r => r.floodLevel === 'deep').length;
  const mediumFloodedCount = reports.filter(r => r.floodLevel === 'medium').length;
  const jammedCount = reports.filter(r => r.trafficLevel === 'jammed').length;
  const clearCount = reports.filter(r => r.floodLevel === 'none' && r.trafficLevel === 'clear').length;

  const filteredReports = reports.filter(item => {
    const matchesSearch =
      !searchTerm ||
      item.streetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sectionDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.neighborhood && item.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterMode === 'flooded') {
      return item.floodLevel === 'deep' || item.floodLevel === 'medium' || item.floodLevel === 'low';
    }
    if (filterMode === 'jammed') {
      return item.trafficLevel === 'jammed' || item.trafficLevel === 'slow';
    }
    if (filterMode === 'clear') {
      return item.floodLevel === 'none' || item.trafficLevel === 'clear';
    }
    return true;
  });

  // Handle Voice Announcement of Traffic & Flood Situation
  const handleToggleVoiceBroadcast = () => {
    if (isPlayingAudio) {
      ttsManager.stop();
      setIsPlayingAudio(false);
      return;
    }

    const floodedStreets = reports.filter(r => r.floodLevel === 'deep' || r.floodLevel === 'medium');
    let broadcastText = `Ủy ban nhân dân Phường Tân Mỹ thông báo tình hình ngập nước và giao thông thời gian thực. `;

    if (floodedStreets.length === 0) {
      broadcastText += `Hiện tại tất cả các tuyến đường chính trên địa bàn phường đều khô ráo, các cống thoát nước hoạt động tốt và giao thông thông thoáng. `;
    } else {
      broadcastText += `Hiện tại có ${floodedStreets.length} tuyến đường đang bị ngập nước và kẹt xe. `;
      floodedStreets.forEach((st, idx) => {
        const floodText = st.floodLevel === 'deep' ? 'đang ngập sâu hơn 40 cen ti mét, cảnh báo xe máy chết máy' : 'đang ngập vừa khoảng 25 đến 30 cen ti mét';
        const trafficText = st.trafficLevel === 'jammed' ? 'giao thông đang kẹt xe nghiêm trọng' : 'di chuyển chậm';
        broadcastText += `Tuyến số ${idx + 1}: ${st.streetName}, đoạn ${st.sectionDescription}, ${floodText}, ${trafficText}. `;
        if (st.recommendedAlternative) {
          broadcastText += `Người dân nên chuyển hướng theo ${st.recommendedAlternative}. `;
        }
      });
    }

    broadcastText += `Bà con có thể trực tiếp cập nhật khi nước rút hoặc liên hệ đường dây nóng phường 1900 88 66 99 để được hỗ trợ. Xin cảm ơn bà con.`;

    setIsPlayingAudio(true);
    ttsManager.speak(broadcastText, {
      rate: 0.93,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  // Upvote / Confirm report
  const handleConfirmReport = (report: TrafficFloodReport) => {
    const updated: TrafficFloodReport = {
      ...report,
      confirmedCount: report.confirmedCount + 1
    };
    onUpdateReport(updated);
    showToast(`Cảm ơn bạn! Đã xác nhận tình trạng tại ${report.streetName}.`);
  };

  // Open Quick Update Status
  const handleOpenQuickUpdate = (report: TrafficFloodReport) => {
    setUpdatingReport(report);
    setNewFloodStatus(report.floodLevel);
    setNewTrafficStatus(report.trafficLevel);
    setUpdateNote('');
  };

  // Submit Quick Update Status
  const handleSubmitStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingReport) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} hôm nay`;

    let autoNote = updateNote.trim();
    if (!autoNote) {
      if (newFloodStatus === 'none' && newTrafficStatus === 'clear') {
        autoNote = 'Nước đã rút hoàn toàn, mặt đường khô ráo, xe cộ lưu thông thông thoáng.';
      } else if (newFloodStatus === 'low') {
        autoNote = 'Nước đang rút nhanh, chỉ còn ngập nhẹ mép đường, xe máy qua lại tốt.';
      } else if (newFloodStatus === 'deep') {
        autoNote = 'Mưa lớn/triều cường tiếp tục dâng cao, ngập sâu thêm.';
      } else {
        autoNote = `Tình hình đã thay đổi lúc ${timeStr}.`;
      }
    }

    const newLog: StatusUpdateLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      updatedBy: updaterName.trim() || 'Người dân địa phương',
      floodLevel: newFloodStatus,
      trafficLevel: newTrafficStatus,
      note: autoNote
    };

    const updated: TrafficFloodReport = {
      ...updatingReport,
      floodLevel: newFloodStatus,
      trafficLevel: newTrafficStatus,
      waterDepthCm: newFloodStatus === 'none' ? 0 : newFloodStatus === 'low' ? 15 : newFloodStatus === 'medium' ? 25 : 45,
      lastUpdatedAt: timeStr,
      resolvedCount: newFloodStatus === 'none' ? updatingReport.resolvedCount + 1 : updatingReport.resolvedCount,
      historyLogs: [newLog, ...(updatingReport.historyLogs || [])]
    };

    onUpdateReport(updated);
    setUpdatingReport(null);
    showToast(`Đã cập nhật tình trạng mới nhất cho ${updated.streetName}!`);
  };

  // Save brand new report from citizen
  const handleSaveNewReport = (newReportData: Omit<TrafficFloodReport, 'id' | 'confirmedCount' | 'resolvedCount' | 'historyLogs'>) => {
    const newReport: TrafficFloodReport = {
      id: `traffic-${Date.now()}`,
      ...newReportData,
      confirmedCount: 1,
      resolvedCount: 0,
      historyLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: newReportData.reportedAt,
          updatedBy: newReportData.reporterName,
          floodLevel: newReportData.floodLevel,
          trafficLevel: newReportData.trafficLevel,
          note: newReportData.description
        }
      ]
    };
    onAddReport(newReport);
    showToast(`Đã đăng thành công báo cáo tuyến đường ${newReport.streetName}!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
              <span>BẢNG THEO DÕI THỜI GIAN THỰC</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Cộng đồng tương tác 24/7</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Tra cứu Tuyến đường Ngập sâu & Kẹt xe
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Người dân cùng tham gia cập nhật tiến độ nước rút, kẹt xe theo thời gian thực tại Phường Tân Mỹ
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* TTS Audio Broadcast Button */}
          <button
            type="button"
            onClick={handleToggleVoiceBroadcast}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
            }`}
            title="Nghe trợ lý số phát thanh tình trạng giao thông và ngập nước"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            <span>{isPlayingAudio ? 'Đang phát thanh (Bấm tắt)' : 'Nghe cảnh báo giọng nói'}</span>
          </button>

          {/* Citizen Report Button */}
          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Báo đường ngập / kẹt xe</span>
          </button>
        </div>
      </div>

      {/* Real-time Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-3xl border border-red-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-red-900 uppercase block flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> Điểm ngập sâu:
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-red-700 font-mono">
            {deepFloodedCount} <span className="text-xs font-normal text-slate-600">tuyến</span>
          </strong>
          <span className="text-[10px] text-red-600 block">&gt; 40cm, cảnh báo chết máy</span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-3xl border border-amber-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-amber-900 uppercase block flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-amber-600" /> Ngập vừa:
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">
            {mediumFloodedCount} <span className="text-xs font-normal text-slate-600">tuyến</span>
          </strong>
          <span className="text-[10px] text-amber-700 block">20 - 40cm, khó di chuyển</span>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-3xl border border-purple-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-purple-900 uppercase block flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-purple-600" /> Đang kẹt xe:
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-purple-800 font-mono">
            {jammedCount} <span className="text-xs font-normal text-slate-600">tuyến</span>
          </strong>
          <span className="text-[10px] text-purple-700 block">Ùn tắc giờ cao điểm</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-3xl border border-emerald-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-900 uppercase block flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã thông thoáng:
          </span>
          <strong className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {clearCount} <span className="text-xs font-normal text-slate-600">tuyến</span>
          </strong>
          <span className="text-[10px] text-emerald-700 block">Nước đã rút, an toàn</span>
        </div>
      </div>

      {/* Emergency Hotline for Flooding & Rescue */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h4 className="font-black text-sm sm:text-base leading-tight">
              Đường dây nóng Cứu hộ Giao thông & Hỗ trợ Chống ngập Phường Tân Mỹ
            </h4>
            <p className="text-xs text-rose-100 mt-0.5">
              Gọi ngay khi xe chết máy giữa dòng nước, sự cố sạt lở hoặc cần hỗ trợ kéo xe
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="tel:1900886699"
            className="px-4 py-2 bg-white text-red-700 hover:bg-amber-100 font-black rounded-xl text-xs sm:text-sm font-mono shadow-md flex items-center gap-1.5 transition-colors"
          >
            <span>📞 1900 88 66 99</span>
          </a>
          <a
            href="tel:02837718890"
            className="px-3 py-2 bg-red-800/80 hover:bg-red-900 text-white font-bold rounded-xl text-xs font-mono transition-colors"
          >
            (028) 3771 8890
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tra cứu theo tên đường (VD: Nguyễn Thị Thập, Huỳnh Tấn Phát, Chợ Tân Mỹ...)"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('flooded')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'flooded'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            🔴 Đang ngập nước
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('jammed')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'jammed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            ⚠️ Đang kẹt xe
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('clear')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === 'clear'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            🟢 Nước đã rút / Thông thoáng
          </button>
        </div>
      </div>

      {/* Main Real-time Reports Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => {
          const isDeep = report.floodLevel === 'deep';
          const isMedium = report.floodLevel === 'medium';
          const isLow = report.floodLevel === 'low';
          const isResolved = report.floodLevel === 'none';

          const isJammed = report.trafficLevel === 'jammed';
          const isSlow = report.trafficLevel === 'slow';

          const hasLogs = report.historyLogs && report.historyLogs.length > 0;
          const isLogsExpanded = expandedLogId === report.id;

          return (
            <div
              key={report.id}
              className={`rounded-3xl p-5 sm:p-6 border shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                isDeep
                  ? 'bg-white border-red-300 ring-2 ring-red-100'
                  : isMedium
                  ? 'bg-white border-amber-300'
                  : isResolved
                  ? 'bg-white border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                {/* Header of card: Street name & Official badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                        {report.neighborhood || 'Phường Tân Mỹ'}
                      </span>
                      {report.isOfficialAlert && (
                        <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-blue-700" />
                          <span>UBND Xác minh</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
                      {report.streetName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                      <span>{report.sectionDescription}</span>
                    </p>
                  </div>

                  {/* Water Depth Gauge */}
                  {report.waterDepthCm !== undefined && report.waterDepthCm > 0 ? (
                    <div className="text-right flex-shrink-0 bg-blue-50/80 px-2.5 py-1.5 rounded-2xl border border-blue-200">
                      <span className="text-[10px] text-blue-800 font-bold block uppercase">Mực nước:</span>
                      <strong className="text-base sm:text-lg font-black text-blue-950 font-mono leading-none">
                        ~{report.waterDepthCm}cm
                      </strong>
                    </div>
                  ) : (
                    <div className="text-right flex-shrink-0 bg-emerald-50 px-2.5 py-1 rounded-2xl border border-emerald-200">
                      <span className="text-[11px] text-emerald-800 font-bold">Khô ráo</span>
                    </div>
                  )}
                </div>

                {/* Status Badges Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Flood Status Badge */}
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs ${
                      isDeep
                        ? 'bg-red-600 text-white'
                        : isMedium
                        ? 'bg-amber-500 text-white'
                        : isLow
                        ? 'bg-yellow-400 text-slate-900'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <Waves className="w-3.5 h-3.5" />
                    <span>
                      {isDeep
                        ? '🔴 Ngập sâu (> 40cm)'
                        : isMedium
                        ? '🟠 Ngập vừa (20-40cm)'
                        : isLow
                        ? '🟡 Ngập nhẹ (< 20cm)'
                        : '🟢 Nước đã rút / Khô ráo'}
                    </span>
                  </span>

                  {/* Traffic Status Badge */}
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs ${
                      isJammed
                        ? 'bg-purple-700 text-white'
                        : isSlow
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>
                      {isJammed
                        ? '🔴 Kẹt xe nghiêm trọng'
                        : isSlow
                        ? '🟠 Di chuyển chậm'
                        : '🟢 Thông thoáng'}
                    </span>
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  {report.description}
                </p>

                {/* Alternative Route Recommendation */}
                {report.recommendedAlternative && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-0.5">
                    <strong className="text-emerald-900 font-bold flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Lộ trình tránh ngập khuyên dùng:</span>
                    </strong>
                    <p className="text-emerald-950 font-medium pl-4">
                      {report.recommendedAlternative}
                    </p>
                  </div>
                )}

                {/* Timestamp & Reporter info */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Báo lúc: {report.reportedAt}</span>
                  </span>
                  <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    Cập nhật: {report.lastUpdatedAt}
                  </span>
                </div>
              </div>

              {/* 
                THE HIGH-INTERACTION CITIZEN COLLABORATION AREA:
                "sau khi người công tác nhà nước đã rút hoặc là nó bớt ngập, ít ngập, không còn ngập nữa thì người dân sẽ chọn vào đó để nó cập nhật đúng theo cái tiến độ thời gian"
              */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Upvote Confirm Button */}
                  <button
                    type="button"
                    onClick={() => handleConfirmReport(report)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Xác nhận thông tin này đúng với thực tế hiện trường"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Đúng thực tế ({report.confirmedCount})</span>
                  </button>

                  {/* CẬP NHẬT TÌNH TRẠNG NGAY (Nước đã rút / Bớt ngập / Thông thoáng) */}
                  <button
                    type="button"
                    onClick={() => handleOpenQuickUpdate(report)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cập nhật tình hình mới</span>
                  </button>
                </div>

                {/* View Real-time History Logs Toggle */}
                {hasLogs && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setExpandedLogId(isLogsExpanded ? null : report.id)}
                      className="text-[11px] font-bold text-slate-500 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <MessageSquare className="w-3 h-3 text-blue-600" />
                      <span>
                        {isLogsExpanded
                          ? 'Thu gọn tiến độ thời gian'
                          : `Xem lịch sử cập nhật nước rút & kẹt xe (${report.historyLogs.length})`}
                      </span>
                      {isLogsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {isLogsExpanded && (
                      <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs animate-in fade-in">
                        <strong className="text-[11px] font-black uppercase text-slate-700 block">
                          Tiến trình diễn biến theo thời gian:
                        </strong>
                        <div className="space-y-2 divide-y divide-slate-200/60">
                          {report.historyLogs.map((log) => (
                            <div key={log.id} className="pt-1.5 first:pt-0 space-y-1">
                              <div className="flex items-center justify-between text-[10px]">
                                <strong className="text-blue-900 font-bold">{log.updatedBy}</strong>
                                <span className="text-slate-400 font-mono">{log.timestamp}</span>
                              </div>
                              <p className="text-slate-700 text-[11px]">{log.note}</p>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <span>Trạng thái: </span>
                                <span className="font-bold text-slate-800">
                                  {log.floodLevel === 'none' ? 'Nước đã rút' : log.floodLevel === 'low' ? 'Ngập nhẹ' : log.floodLevel === 'medium' ? 'Ngập vừa' : 'Ngập sâu'}
                                </span>
                                <span>•</span>
                                <span className="font-bold text-slate-800">
                                  {log.trafficLevel === 'clear' ? 'Thông thoáng' : log.trafficLevel === 'slow' ? 'Chậm' : 'Kẹt xe'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Waves className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-slate-800">
            Không tìm thấy tuyến đường nào theo tiêu chí
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hiện tại các tuyến đường được lọc có thể đang thông thoáng hoặc chưa có báo cáo. Bạn có thể nhấn "Báo đường ngập / kẹt xe" để gửi phản ánh mới.
          </p>
        </div>
      )}

      {/* Citizen Report Modal */}
      {isReportModalOpen && (
        <TrafficReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSave={handleSaveNewReport}
        />
      )}

      {/* Quick Status Update Modal (Cập nhật tiến độ: nước rút / bớt ngập / thông thoáng) */}
      {updatingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">
                    Cập nhật tình hình hiện tại
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {updatingReport.streetName} ({updatingReport.sectionDescription})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUpdatingReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStatusUpdate} className="space-y-4 text-xs sm:text-sm">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs text-blue-900 space-y-1">
                <strong>Chức năng tương tác cộng đồng:</strong>
                <p className="text-slate-700">
                  Nếu nước đã rút sau khi mưa tạnh, hoặc công tác tiêu thoát nước đã xong, hoặc xe cộ đã lưu thông bình thường, bạn hãy cập nhật ngay để bà con khác yên tâm đi lại!
                </p>
              </div>

              {/* Tình trạng ngập nước mới */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tình trạng ngập nước thực tế ngay lúc này:</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewFloodStatus('none')}
                    className={`p-2.5 rounded-xl text-left border font-bold text-xs cursor-pointer transition-all ${
                      newFloodStatus === 'none'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🟢 Nước đã rút hết / Khô ráo
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFloodStatus('low')}
                    className={`p-2.5 rounded-xl text-left border font-bold text-xs cursor-pointer transition-all ${
                      newFloodStatus === 'low'
                        ? 'bg-yellow-500 text-slate-950 border-yellow-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🟡 Bớt ngập (chỉ còn ngập nhẹ)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFloodStatus('medium')}
                    className={`p-2.5 rounded-xl text-left border font-bold text-xs cursor-pointer transition-all ${
                      newFloodStatus === 'medium'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🟠 Ngập vừa (20-40cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFloodStatus('deep')}
                    className={`p-2.5 rounded-xl text-left border font-bold text-xs cursor-pointer transition-all ${
                      newFloodStatus === 'deep'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🔴 Ngập sâu trở lại (&gt; 40cm)
                  </button>
                </div>
              </div>

              {/* Tình trạng giao thông mới */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tình trạng giao thông:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTrafficStatus('clear')}
                    className={`p-2 rounded-xl text-center border font-bold text-xs cursor-pointer ${
                      newTrafficStatus === 'clear'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🟢 Thông thoáng
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTrafficStatus('slow')}
                    className={`p-2 rounded-xl text-center border font-bold text-xs cursor-pointer ${
                      newTrafficStatus === 'slow'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🟠 Chậm
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTrafficStatus('jammed')}
                    className={`p-2 rounded-xl text-center border font-bold text-xs cursor-pointer ${
                      newTrafficStatus === 'jammed'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    🔴 Kẹt xe nặng
                  </button>
                </div>
              </div>

              {/* Ghi chú nhanh */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ghi chú hiện trường (tùy chọn):
                </label>
                <input
                  type="text"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="VD: Máy bơm phường đã hoạt động, nước rút khô ráo xe đi tốt..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium outline-none"
                />
              </div>

              {/* Người cập nhật */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bạn là ai:
                </label>
                <input
                  type="text"
                  value={updaterName}
                  onChange={(e) => setUpdaterName(e.target.value)}
                  placeholder="VD: Người dân KP2, Bác Nam..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUpdatingReport(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
