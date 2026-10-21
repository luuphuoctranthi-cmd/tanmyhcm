import React, { useState, useEffect } from 'react';
import { AppViewMode, FontSizeLevel } from '../types';
import { Settings, Users, ZoomIn, Clock as ClockIcon, LogOut } from 'lucide-react';

interface HeaderProps {
  viewMode: AppViewMode;
  onViewModeChange: (mode: AppViewMode) => void;
  fontSize: FontSizeLevel;
  onFontSizeChange: (level: FontSizeLevel) => void;
  proceduresCount: number;
  isAdminAuthenticated?: boolean;
  onAdminLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  fontSize,
  onFontSizeChange,
  proceduresCount,
  isAdminAuthenticated = false,
  onAdminLogout
}) => {
  // Real-time clock state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeStr = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDateStr = (date: Date) => {
    const dayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayOfWeek}, ${day}/${month}/${year}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 space-y-2">
        {/* Row 1: TỰA ĐỀ ỨNG DỤNG NẰM Ở TRÊN CÙNG 1 HÀNG VÀ CĂN GIỮA - IN HOA TOÀN BỘ, MÀU XANH ĐẸP */}
        <div className="text-center w-full">
          {/* Ở giao diện cán bộ mới hiện tag quản trị, giao diện người dân ẩn dòng "UBND PHƯỜNG TÂN MỸ • Bộ phận Một cửa điện tử" theo yêu cầu */}
          {viewMode === 'admin' && (
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase font-black tracking-wider text-blue-900 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200">
                PHÂN HỆ CÁN BỘ & ĐIỀU HÀNH NỘI BỘ
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/assets/aistudio/image_73393885.png"
                alt="Logo Phường Tân Mỹ"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-xs"
              />
            </div>

            <h1 className="text-lg sm:text-2xl md:text-[25px] font-black tracking-tight leading-tight text-blue-700 uppercase drop-shadow-2xs">
              TRỢ LÝ SỐ THÔNG MINH PHƯỜNG TÂN MỸ
            </h1>
          </div>
        </div>

        {/* Row 2: Thanh điều hướng tiện ích (Đồng hồ, cỡ chữ, chuyển phân hệ) cân đối & chuyên nghiệp */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
          {/* Left: Real-time Clock Widget */}
          <div className="bg-slate-100/90 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-mono font-bold text-slate-800 shadow-2xs">
            <ClockIcon className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="text-blue-900 font-black">{formatTimeStr(currentTime)}</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-600 font-sans hidden sm:inline">{formatDateStr(currentTime)}</span>
          </div>

          {/* Right: Font Zoom & Mode Switcher */}
          <div className="flex items-center flex-wrap gap-2.5 ml-auto">
            {/* Font Size Adjuster for Accessibility */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200" title="Điều chỉnh cỡ chữ">
              <span className="text-xs font-semibold text-slate-500 px-1.5 flex items-center gap-1">
                <ZoomIn className="w-3 h-3" />
              </span>
              <button
                type="button"
                onClick={() => onFontSizeChange('normal')}
                className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('large')}
                className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => onFontSizeChange('huge')}
                className={`px-2 py-0.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  fontSize === 'huge'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A++
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center text-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('public')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'public'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-700 hover:text-blue-700'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Chế độ Người dân</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  viewMode === 'admin'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
                title={isAdminAuthenticated ? 'Đã xác thực cán bộ' : 'Yêu cầu tài khoản cán bộ'}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Quản trị Cán bộ</span>
              </button>
            </div>

            {/* Admin Logout Button if in Admin mode */}
            {viewMode === 'admin' && onAdminLogout && (
              <button
                type="button"
                onClick={onAdminLogout}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Đăng xuất khỏi phân hệ cán bộ"
              >
                <LogOut className="w-3 h-3" />
                <span>Thoát</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
