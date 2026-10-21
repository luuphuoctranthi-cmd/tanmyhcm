import { PortalTab } from '../types';

export interface DynamicPortalTabItem {
  id: PortalTab;
  label: string;
  sublabel: string;
  iconName: string;
  isVisible: boolean;
  order: number;
  badge?: string;
}

export interface CitizenPortalLayoutConfig {
  homeGreeting: string;
  homeSubDescription: string;
  tabs: DynamicPortalTabItem[];
}

export const DEFAULT_DYNAMIC_TABS: DynamicPortalTabItem[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    sublabel: 'Trợ lý số & Kiosk Một cửa',
    iconName: 'Home',
    isVisible: true,
    order: 1
  },
  {
    id: 'news',
    label: 'Tin tức & Sự kiện',
    sublabel: 'Bảng tin động, link Facebook',
    iconName: 'Newspaper',
    isVisible: true,
    order: 2
  },
  {
    id: 'schedule',
    label: 'Lịch công tác',
    sublabel: 'Tiếp dân & Lịch lãnh đạo',
    iconName: 'CalendarDays',
    isVisible: true,
    order: 3
  },
  {
    id: 'party_gov',
    label: 'Đảng ủy - UBND',
    sublabel: 'Chỉ đạo điều hành & Đoàn thể',
    iconName: 'Landmark',
    isVisible: true,
    order: 4
  },
  {
    id: 'procedures',
    label: 'Thủ tục hành chính',
    sublabel: 'Kho biểu mẫu & Dịch vụ công',
    iconName: 'FileText',
    isVisible: true,
    order: 5
  },
  {
    id: 'transparency',
    label: 'Niêm yết & Giám sát',
    sublabel: 'Thủ tục, ngân sách, đầu tư',
    iconName: 'ShieldCheck',
    isVisible: true,
    order: 6
  },
  {
    id: 'feedback',
    label: 'Góp ý & Phản ánh',
    sublabel: 'Gửi kiến nghị cho chính quyền',
    iconName: 'MessageSquareHeart',
    isVisible: true,
    order: 7
  },
  {
    id: 'traffic_flood',
    label: 'Đường ngập & Kẹt xe',
    sublabel: 'Tra cứu & cập nhật nước rút 24/7',
    iconName: 'Waves',
    isVisible: true,
    order: 8
  },
  {
    id: 'contacts',
    label: 'Liên hệ & Danh bạ',
    sublabel: 'Đường dây nóng địa bàn',
    iconName: 'PhoneCall',
    isVisible: true,
    order: 9
  }
];

export const DEFAULT_PORTAL_LAYOUT_CONFIG: CitizenPortalLayoutConfig = {
  homeGreeting: 'Bạn cần làm thủ tục gì?',
  homeSubDescription: 'Hệ thống hướng dẫn tự động bằng giọng nói dành cho công dân phường Tân Mỹ',
  tabs: DEFAULT_DYNAMIC_TABS
};

const LAYOUT_CONFIG_STORAGE_KEY = 'tanmy_portal_layout_config_v1';

export function getStoredPortalLayoutConfig(): CitizenPortalLayoutConfig {
  try {
    const raw = localStorage.getItem(LAYOUT_CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LAYOUT_CONFIG_STORAGE_KEY, JSON.stringify(DEFAULT_PORTAL_LAYOUT_CONFIG));
      return DEFAULT_PORTAL_LAYOUT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PORTAL_LAYOUT_CONFIG,
      ...parsed,
      tabs: Array.isArray(parsed.tabs) && parsed.tabs.length > 0 ? parsed.tabs : DEFAULT_PORTAL_LAYOUT_CONFIG.tabs
    };
  } catch (e) {
    return DEFAULT_PORTAL_LAYOUT_CONFIG;
  }
}

export function saveStoredPortalLayoutConfig(config: CitizenPortalLayoutConfig): void {
  try {
    localStorage.setItem(LAYOUT_CONFIG_STORAGE_KEY, JSON.stringify(config));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tanmy_layout_config_updated', { detail: config }));
    }
  } catch (e) {
    console.error('Failed to save layout config', e);
  }
}
