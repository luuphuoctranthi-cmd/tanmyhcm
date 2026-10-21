import React, { useState } from 'react';
import { TrafficFloodReport, FloodLevel, TrafficLevel } from '../../types';
import { X, AlertTriangle, Car, Waves, MapPin, Send, CheckCircle2, Navigation } from 'lucide-react';

interface TrafficReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: Omit<TrafficFloodReport, 'id' | 'confirmedCount' | 'resolvedCount' | 'historyLogs'>) => void;
}

const COMMON_STREETS = [
  'Đường Nguyễn Thị Thập',
  'Đường Huỳnh Tấn Phát',
  'Đường Lâm Văn Bền',
  'Đường Tân Mỹ',
  'Đường Mai Văn Vĩnh',
  'Đường Nguyễn Văn Linh',
  'Đường Trần Trọng Khiêm',
  'Hẻm 14 Tân Mỹ',
  'Bờ kè rạch Ông Đội',
  'Khác (nhập bên dưới)'
];

export const TrafficReportModal: React.FC<TrafficReportModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [selectedStreet, setSelectedStreet] = useState(COMMON_STREETS[0]);
  const [customStreet, setCustomStreet] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('Khu phố 1');
  const [floodLevel, setFloodLevel] = useState<FloodLevel>('medium');
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('slow');
  const [waterDepthCm, setWaterDepthCm] = useState<number>(25);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [description, setDescription] = useState('');
  const [recommendedAlternative, setRecommendedAlternative] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStreet = selectedStreet.startsWith('Khác') ? (customStreet.trim() || 'Tuyến đường dân sinh') : selectedStreet;
    if (!sectionDescription.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} hôm nay`;

    onSave({
      streetName: finalStreet,
      sectionDescription: sectionDescription.trim(),
      neighborhood,
      floodLevel,
      trafficLevel,
      waterDepthCm: floodLevel === 'none' ? 0 : Number(waterDepthCm) || 20,
      reportedAt: timeStr,
      lastUpdatedAt: timeStr,
      reporterName: reporterName.trim() || 'Người dân địa phương',
      reporterPhone: reporterPhone.trim() || undefined,
      description: description.trim() || `Tình trạng hiện tại: ${floodLevel === 'deep' ? 'Ngập sâu' : floodLevel === 'medium' ? 'Ngập vừa' : floodLevel === 'low' ? 'Ngập nhẹ' : 'Khô ráo'}, ${trafficLevel === 'jammed' ? 'Kẹt xe nghiêm trọng' : trafficLevel === 'slow' ? 'Di chuyển chậm' : 'Thông thoáng'}.`,
      recommendedAlternative: recommendedAlternative.trim() || undefined,
      isOfficialAlert: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center shadow-md">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Báo cáo Tuyến đường Ngập & Kẹt xe
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin được gửi ngay lập tức lên hệ thống để toàn thể nhân dân cùng nắm bắt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Tên đường */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tuyến đường (*):
            </label>
            <select
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {COMMON_STREETS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {selectedStreet.startsWith('Khác') && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nhập tên đường / Hẻm cụ thể:
              </label>
              <input
                type="text"
                required
                value={customStreet}
                onChange={(e) => setCustomStreet(e.target.value)}
                placeholder="VD: Hẻm 79 Phú Mỹ, Đường số 10..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium outline-none"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Đoạn đường */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Đoạn đường / Vị trí cụ thể (*):
              </label>
              <input
                type="text"
                required
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                placeholder="VD: Đoạn trước chợ Tân Mỹ, giao lộ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Khu phố */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Khu phố:
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Khu phố 1">Khu phố 1</option>
                <option value="Khu phố 2">Khu phố 2</option>
                <option value="Khu phố 3">Khu phố 3</option>
                <option value="Khu phố 4">Khu phố 4</option>
                <option value="Khu phố 5">Khu phố 5</option>
                <option value="Khu vực giáp ranh">Khu vực giáp ranh</option>
              </select>
            </div>
          </div>

          {/* Mức độ ngập & Mực nước */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-600" />
                <span>Mức độ ngập nước:</span>
              </label>
              <select
                value={floodLevel}
                onChange={(e) => setFloodLevel(e.target.value as FloodLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs outline-none"
              >
                <option value="deep">🔴 Ngập sâu (&gt; 40cm, xe máy chết máy)</option>
                <option value="medium">🟠 Ngập vừa (20 - 40cm, khó đi)</option>
                <option value="low">🟡 Ngập nhẹ (&lt; 20cm, mấp mé mép)</option>
                <option value="none">🟢 Khô ráo / Nước đã rút hoàn toàn</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span>Tình trạng giao thông:</span>
              </label>
              <select
                value={trafficLevel}
                onChange={(e) => setTrafficLevel(e.target.value as TrafficLevel)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white text-xs outline-none"
              >
                <option value="jammed">🔴 Kẹt xe nghiêm trọng (ùn tắc dài)</option>
                <option value="slow">🟠 Di chuyển chậm / Ùn ứ nhẹ</option>
                <option value="clear">🟢 Thông thoáng / Bình thường</option>
              </select>
            </div>
          </div>

          {/* Mô tả hiện trường */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Mô tả hiện trường & Lưu ý phương tiện:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="VD: Nước ngập lút ống bô xe máy, nhiều xe chết máy phải dắt bộ, triều cường đang dâng..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Lộ trình thay thế */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gợi ý hướng đi thay thế (nếu biết):</span>
            </label>
            <input
              type="text"
              value={recommendedAlternative}
              onChange={(e) => setRecommendedAlternative(e.target.value)}
              placeholder="VD: Nên rẽ qua đường số 7 hoặc đường Mai Văn Vĩnh..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Thông tin người báo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tên bạn / Đơn vị:
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="VD: Người dân KP3, Bác Ba..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số điện thoại (tùy chọn):
              </label>
              <input
                type="text"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="Để cán bộ tiện xác minh..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi báo cáo ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
