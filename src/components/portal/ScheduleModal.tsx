import React, { useState, useEffect } from 'react';
import { WorkScheduleItem } from '../../types';
import { X, CalendarDays, UserCheck, MapPin, Clock, AlertCircle } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: Omit<WorkScheduleItem, 'id'>) => void;
  initialData?: WorkScheduleItem | null;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [leaderName, setLeaderName] = useState('Đồng chí Nguyễn Văn An');
  const [leaderRole, setLeaderRole] = useState('Chủ tịch UBND Phường');
  const [dateStr, setDateStr] = useState('Thứ Năm, 22/10/2026');
  const [timeStr, setTimeStr] = useState('08:00 - 11:30');
  const [location, setLocation] = useState('Phòng Tiếp công dân (Trụ sở UBND Phường)');
  const [type, setType] = useState<WorkScheduleItem['type']>('Tiếp công dân');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(true);

  useEffect(() => {
    if (initialData) {
      setLeaderName(initialData.leaderName);
      setLeaderRole(initialData.leaderRole);
      setDateStr(initialData.dateStr);
      setTimeStr(initialData.timeStr);
      setLocation(initialData.location);
      setType(initialData.type);
      setContent(initialData.content);
      setIsImportant(Boolean(initialData.isImportant));
    } else {
      setLeaderName('Đồng chí Nguyễn Văn An');
      setLeaderRole('Chủ tịch UBND Phường');
      setDateStr('Thứ Năm, 22/10/2026');
      setTimeStr('08:00 - 11:30');
      setLocation('Phòng Tiếp công dân (Trụ sở UBND Phường)');
      setType('Tiếp công dân');
      setContent('Chủ trì phiên tiếp công dân định kỳ, lắng nghe ý kiến phản ánh và xử lý thủ tục cho nhân dân.');
      setIsImportant(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !leaderName.trim()) return;

    onSave({
      leaderName: leaderName.trim(),
      leaderRole: leaderRole.trim(),
      dateStr: dateStr.trim(),
      timeStr: timeStr.trim(),
      location: location.trim(),
      type,
      content: content.trim(),
      isImportant
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {initialData ? 'Chỉnh sửa lịch làm việc / tiếp dân' : 'Thêm mới lịch công tác & tiếp dân'}
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật lịch tiếp công dân định kỳ và lịch công tác của Lãnh đạo UBND phường
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Loại lịch */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Phân loại công việc / Lịch (*):
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as WorkScheduleItem['type'])}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Tiếp công dân">Tiếp công dân (Chủ tịch / Phó Chủ tịch)</option>
              <option value="Chỉ đạo điều hành">Chỉ đạo điều hành</option>
              <option value="Họp giao ban">Họp giao ban</option>
              <option value="Kiểm tra địa bàn">Kiểm tra địa bàn cơ sở</option>
            </select>
          </div>

          {/* Nội dung công tác */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nội dung công việc / Mục đích buổi tiếp (*):
            </label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="VD: Chủ tịch UBND Phường trực tiếp tiếp công dân định kỳ tuần 43, tiếp nhận đơn thư phản ánh..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Người chủ trì */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Người chủ trì / Lãnh đạo (*):</span>
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Đ/c Nguyễn Văn An"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Chức vụ */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chức vụ:
              </label>
              <input
                type="text"
                value={leaderRole}
                onChange={(e) => setLeaderRole(e.target.value)}
                placeholder="Chủ tịch UBND Phường"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ngày làm việc */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                <span>Ngày làm việc (*):</span>
              </label>
              <input
                type="text"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                placeholder="Thứ Năm, 22/10/2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Giờ làm việc */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Khung giờ (*):</span>
              </label>
              <input
                type="text"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                placeholder="08:00 - 11:30"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Địa điểm */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>Địa điểm tổ chức / Tiếp dân (*):</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Phòng Tiếp công dân (Trụ sở UBND Phường Tân Mỹ)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Đánh dấu quan trọng */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="isImportantSchedule"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded cursor-pointer"
            />
            <label htmlFor="isImportantSchedule" className="text-xs font-bold text-amber-900 cursor-pointer flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Ghim nổi bật (Khung màu vàng và viền sáng trên lịch)</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4" />
              <span>{initialData ? 'Lưu thay đổi' : 'Thêm lịch công tác'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
