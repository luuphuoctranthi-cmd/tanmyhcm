import React, { useState } from 'react';
import { WorkScheduleItem } from '../../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  Calendar,
  Filter
} from 'lucide-react';

interface ScheduleSectionProps {
  schedules: WorkScheduleItem[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules }) => {
  const [filterType, setFilterType] = useState<string>('Tất cả');

  const filtered = schedules.filter(item => {
    if (filterType === 'Tất cả') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner (Read-only for Citizens) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" /> LỊCH CÔNG TÁC & TIẾP CÔNG DÂN
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              UBND Phường Tân Mỹ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Lịch làm việc & Tiếp dân của Lãnh đạo Ủy ban
          </h2>
        </div>

        <span className="text-xs font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 self-start sm:self-auto">
          Cập nhật tuần này
        </span>
      </div>

      {/* Featured Citizen Reception Spotlight */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border border-white/20">
            <UserCheck className="w-4 h-4 text-amber-200" />
            <span>LỊCH TIẾP CÔNG DÂN ĐỊNH KỲ CỦA CHỦ TỊCH UBND PHƯỜNG</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black leading-snug">
            Thứ Năm hàng tuần: Chủ tịch UBND Phường trực tiếp tiếp công dân
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Thời gian: <strong>Sáng 08:00 - 11:30</strong> và <strong>Chiều 14:00 - 16:30</strong> tại <strong>Phòng Tiếp công dân (Tầng trệt Trụ sở UBND Phường Tân Mỹ)</strong>.
            Bà con nhân dân có phản ánh, kiến nghị có thể đến trực tiếp hoặc đăng ký qua số điện thoại Một cửa (1900 88 66 99).
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['Tất cả', 'Tiếp công dân', 'Chỉ đạo điều hành', 'Họp giao ban', 'Kiểm tra địa bàn'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilterType(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === f
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              item.isImportant ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
            }`}
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-lg ${
                    item.type === 'Tiếp công dân'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : item.type === 'Chỉ đạo điều hành'
                      ? 'bg-red-100 text-red-900 border border-red-200'
                      : 'bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  {item.type}
                </span>

                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {item.dateStr}
                </span>

                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {item.timeStr}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-black text-slate-900">
                {item.content}
              </h4>

              <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  {item.leaderName} ({item.leaderRole})
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-4 h-4 text-red-500" />
                  {item.location}
                </span>
              </div>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đúng kế hoạch
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
