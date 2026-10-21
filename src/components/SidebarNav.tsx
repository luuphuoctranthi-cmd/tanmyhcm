import React from 'react';
import { PortalTab } from '../types';
import { DynamicPortalTabItem, DEFAULT_DYNAMIC_TABS } from '../data/portalNavSettings';
import {
  Home,
  Newspaper,
  CalendarDays,
  Landmark,
  FileText,
  MessageSquareHeart,
  PhoneCall,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Waves,
  HelpCircle,
  Info,
  Users
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Newspaper,
  CalendarDays,
  Landmark,
  FileText,
  ShieldCheck,
  MessageSquareHeart,
  Waves,
  PhoneCall,
  Sparkles,
  HelpCircle,
  Info,
  Users
};

interface SidebarNavProps {
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  unreadFeedbacksCount?: number;
  newsCount?: number;
  trafficFloodCount?: number;
  tabsConfig?: DynamicPortalTabItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  unreadFeedbacksCount = 3,
  newsCount = 4,
  tabsConfig
}) => {
  // Use dynamically configured tabs from Admin CMS or fallback to default
  const configuredTabs = (tabsConfig && tabsConfig.length > 0 ? tabsConfig : DEFAULT_DYNAMIC_TABS)
    .filter(t => t.isVisible)
    .sort((a, b) => a.order - b.order);

  const getDynamicBadge = (tabId: PortalTab) => {
    if (tabId === 'news' && newsCount > 0) {
      return { badge: newsCount, badgeColor: 'bg-red-500 text-white' };
    }
    if (tabId === 'feedback' && unreadFeedbacksCount > 0) {
      return { badge: unreadFeedbacksCount, badgeColor: 'bg-emerald-600 text-white' };
    }
    if (tabId === 'schedule') {
      return { badge: 'Thứ 5', badgeColor: 'bg-amber-500 text-white' };
    }
    if (tabId === 'transparency') {
      return { badge: 'Mới', badgeColor: 'bg-emerald-600 text-white' };
    }
    // Note: Do NOT display any red "thời gian thực" badge as requested by user
    return null;
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      {/* Container with official administrative border & styling */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-3 sm:p-4 sticky top-24 space-y-4">
        {/* 
          Đã ẩn hoàn toàn dòng chữ "CHUYÊN MỤC CÔNG DÂN" và "TÂN MỸ SMART" theo yêu cầu của người dùng
        */}

        {/* Vertical Tabs List */}
        <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
          {configuredTabs.map((item) => {
            const Icon = ICON_MAP[item.iconName] || FileText;
            const isActive = activeTab === item.id;
            const badgeInfo = getDynamicBadge(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex-shrink-0 w-auto lg:w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left border ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 hover:text-slate-900 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform ${
                      isActive
                        ? 'bg-white/20 text-white scale-105'
                        : 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 pr-1">
                    <span
                      className={`text-xs sm:text-sm font-black block truncate leading-snug ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] truncate block hidden sm:inline ${
                        isActive ? 'text-blue-100 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pl-2">
                  {badgeInfo && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs ${badgeInfo.badgeColor}`}
                    >
                      {badgeInfo.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-blue-200 hidden lg:inline" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Hotline Mini Banner on Bottom of Sidebar */}
        <div className="p-3.5 bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl space-y-1.5 hidden lg:block">
          <div className="flex items-center gap-1.5 text-xs font-black text-red-900">
            <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
            <span>ĐƯỜNG DÂY NÓNG 24/7</span>
          </div>
          <div className="text-lg font-black text-red-700 font-mono tracking-tight">
            1900 88 66 99
          </div>
          <p className="text-[11px] text-slate-600">
            Tiếp nhận phản ánh về TTHC, trật tự đô thị & an ninh trật tự phường Tân Mỹ
          </p>
        </div>
      </div>
    </aside>
  );
};
