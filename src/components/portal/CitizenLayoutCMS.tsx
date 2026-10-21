import React, { useState } from 'react';
import {
  CitizenPortalLayoutConfig,
  DynamicPortalTabItem,
  DEFAULT_PORTAL_LAYOUT_CONFIG
} from '../../data/portalNavSettings';
import { PortalTab } from '../../types';
import {
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  Save,
  Layers,
  Type,
  X,
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
} from 'lucide-react';

const AVAILABLE_ICONS: { name: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { name: 'Home', label: 'Trang chủ (Home)', icon: Home },
  { name: 'Newspaper', label: 'Báo chí / Tin tức', icon: Newspaper },
  { name: 'CalendarDays', label: 'Lịch công tác', icon: CalendarDays },
  { name: 'Landmark', label: 'Chính quyền / Cơ quan', icon: Landmark },
  { name: 'FileText', label: 'Thủ tục / Tài liệu', icon: FileText },
  { name: 'ShieldCheck', label: 'Minh bạch / Khiên', icon: ShieldCheck },
  { name: 'MessageSquareHeart', label: 'Góp ý / Trái tim', icon: MessageSquareHeart },
  { name: 'Waves', label: 'Sóng nước / Giao thông', icon: Waves },
  { name: 'PhoneCall', label: 'Điện thoại / Danh bạ', icon: PhoneCall },
  { name: 'Sparkles', label: 'Trợ lý AI / Tiện ích', icon: Sparkles },
  { name: 'HelpCircle', label: 'Hỏi đáp / Trợ giúp', icon: HelpCircle },
  { name: 'Info', label: 'Thông tin chung', icon: Info },
  { name: 'Users', label: 'Cộng đồng / Người dân', icon: Users }
];

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

interface CitizenLayoutCMSProps {
  layoutConfig: CitizenPortalLayoutConfig;
  onUpdateLayoutConfig: (config: CitizenPortalLayoutConfig) => void;
  showNotice: (msg: string) => void;
}

export const CitizenLayoutCMS: React.FC<CitizenLayoutCMSProps> = ({
  layoutConfig,
  onUpdateLayoutConfig,
  showNotice
}) => {
  // Local state for editing home greeting texts
  const [homeGreeting, setHomeGreeting] = useState(layoutConfig.homeGreeting);
  const [homeSubDescription, setHomeSubDescription] = useState(layoutConfig.homeSubDescription);

  // Modal for editing an existing tab
  const [editingTab, setEditingTab] = useState<DynamicPortalTabItem | null>(null);

  // Modal for adding a new custom tab
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTabLabel, setNewTabLabel] = useState('');
  const [newTabSublabel, setNewTabSublabel] = useState('');
  const [newTabIcon, setNewTabIcon] = useState('FileText');
  const [newTabBase, setNewTabBase] = useState<PortalTab>('procedures');

  // Handle saving home text adjustments
  const handleSaveHomeTexts = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CitizenPortalLayoutConfig = {
      ...layoutConfig,
      homeGreeting: homeGreeting.trim() || 'Bạn cần làm thủ tục gì?',
      homeSubDescription: homeSubDescription.trim() || 'Hệ thống hướng dẫn tự động bằng giọng nói dành cho công dân phường Tân Mỹ'
    };
    onUpdateLayoutConfig(updated);
    showNotice('Đã lưu các dòng chữ hiển thị trang chủ người dân!');
  };

  // Reorder tab: Move Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...layoutConfig.tabs].sort((a, b) => a.order - b.order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    // Reassign order
    const updatedTabs = sorted.map((t, idx) => ({ ...t, order: idx + 1 }));
    onUpdateLayoutConfig({ ...layoutConfig, tabs: updatedTabs });
    showNotice(`Đã chuyển menu "${temp.label}" lên phía trước.`);
  };

  // Reorder tab: Move Down
  const handleMoveDown = (index: number) => {
    const sorted = [...layoutConfig.tabs].sort((a, b) => a.order - b.order);
    if (index >= sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    const updatedTabs = sorted.map((t, idx) => ({ ...t, order: idx + 1 }));
    onUpdateLayoutConfig({ ...layoutConfig, tabs: updatedTabs });
    showNotice(`Đã chuyển menu "${temp.label}" xuống phía dưới.`);
  };

  // Toggle Visibility
  const handleToggleVisibility = (tabId: PortalTab) => {
    const updatedTabs = layoutConfig.tabs.map(t => {
      if (t.id === tabId) {
        const nextState = !t.isVisible;
        showNotice(`Đã ${nextState ? 'HIỂN THỊ' : 'ẨN'} menu "${t.label}" bên phân hệ người dân.`);
        return { ...t, isVisible: nextState };
      }
      return t;
    });
    onUpdateLayoutConfig({ ...layoutConfig, tabs: updatedTabs });
  };

  // Delete Tab
  const handleDeleteTab = (tabId: PortalTab, label: string) => {
    if (confirm(`Bạn có chắc muốn xóa menu "${label}" khỏi danh sách bên người dân?`)) {
      const updatedTabs = layoutConfig.tabs.filter(t => t.id !== tabId);
      onUpdateLayoutConfig({ ...layoutConfig, tabs: updatedTabs });
      showNotice(`Đã xóa menu "${label}".`);
    }
  };

  // Save edited tab
  const handleSaveEditedTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTab) return;

    const updatedTabs = layoutConfig.tabs.map(t => (t.id === editingTab.id ? editingTab : t));
    onUpdateLayoutConfig({ ...layoutConfig, tabs: updatedTabs });
    showNotice(`Đã cập nhật thông tin menu "${editingTab.label}"!`);
    setEditingTab(null);
  };

  // Add new custom tab
  const handleCreateNewTab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTabLabel.trim()) return;

    const newId = `${newTabBase}_custom_${Date.now()}` as unknown as PortalTab;
    const newTab: DynamicPortalTabItem = {
      id: newId,
      label: newTabLabel.trim(),
      sublabel: newTabSublabel.trim() || 'Chuyên mục bổ sung',
      iconName: newTabIcon,
      isVisible: true,
      order: layoutConfig.tabs.length + 1
    };

    onUpdateLayoutConfig({
      ...layoutConfig,
      tabs: [...layoutConfig.tabs, newTab]
    });

    showNotice(`Đã thêm menu mới: "${newTab.label}"!`);
    setIsAddModalOpen(false);
    setNewTabLabel('');
    setNewTabSublabel('');
  };

  // Reset all layout and tabs to default
  const handleResetToDefault = () => {
    if (confirm('Khôi phục toàn bộ danh sách menu và các dòng chữ hiển thị về mặc định ban đầu của UBND Phường?')) {
      onUpdateLayoutConfig(DEFAULT_PORTAL_LAYOUT_CONFIG);
      setHomeGreeting(DEFAULT_PORTAL_LAYOUT_CONFIG.homeGreeting);
      setHomeSubDescription(DEFAULT_PORTAL_LAYOUT_CONFIG.homeSubDescription);
      showNotice('Đã khôi phục cài đặt menu & bố cục về mặc định!');
    }
  };

  const sortedTabs = [...layoutConfig.tabs].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
              <span>QUẢN TRỊ GIAO DIỆN & MENU</span>
            </span>
            <span className="text-xs text-slate-500">• Phân hệ Người dân</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
            Quản lý Menu & Bố cục Phân hệ Người dân
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cán bộ có toàn quyền thêm, sửa, đổi tên, ẩn/xóa các tab chuyên mục và chỉnh sửa các dòng chữ hiển thị
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Khôi phục lại menu gốc ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Khôi phục mặc định</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm menu mới</span>
          </button>
        </div>
      </div>

      {/* Section 1: Quản lý câu chữ hiển thị trên Trang chủ (Kiosk) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Type className="w-5 h-5 text-blue-600" />
          <div>
            <h4 className="text-base font-black text-slate-900">
              Chỉnh sửa câu chữ hiển thị Trang chủ (Kiosk Một cửa)
            </h4>
            <p className="text-xs text-slate-500">
              Thay đổi dòng chữ chào mừng và câu hướng dẫn công dân khi mở trang web
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveHomeTexts} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tiêu đề câu hỏi chính (Mặc định: Bạn cần làm thủ tục gì?):
              </label>
              <input
                type="text"
                required
                value={homeGreeting}
                onChange={(e) => setHomeGreeting(e.target.value)}
                placeholder="VD: Bạn cần làm thủ tục gì?, Tra cứu dịch vụ công..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Dòng mô tả phụ dưới tiêu đề:
              </label>
              <input
                type="text"
                required
                value={homeSubDescription}
                onChange={(e) => setHomeSubDescription(e.target.value)}
                placeholder="VD: Hệ thống hướng dẫn tự động bằng giọng nói dành cho công dân phường Tân Mỹ..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi câu chữ</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Quản lý Danh sách Menu & Tabs bên Người dân */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <h4 className="text-base font-black text-slate-900">
                Danh sách Menu & Các Tab Phân hệ Người dân ({sortedTabs.length} tab)
              </h4>
              <p className="text-xs text-slate-500">
                Bấm nút sửa để đổi tên, mô tả hoặc icon; bấm mũi tên để sắp xếp thứ tự hiển thị
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Đang hiển thị: {sortedTabs.filter(t => t.isVisible).length} / {sortedTabs.length} tab
          </span>
        </div>

        <div className="space-y-2.5">
          {sortedTabs.map((tab, idx) => {
            const Icon = ICON_MAP[tab.iconName] || FileText;

            return (
              <div
                key={tab.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  tab.isVisible
                    ? 'bg-slate-50/70 hover:bg-blue-50/40 border-slate-200'
                    : 'bg-slate-100/60 border-dashed border-slate-300 opacity-60'
                }`}
              >
                {/* Left Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 font-mono">
                    #{idx + 1}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-700 shadow-2xs flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm font-black text-slate-900">
                        {tab.label}
                      </strong>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tab.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {tab.isVisible ? 'Đang hiển thị' : 'Đã ẩn'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        (Mã: {tab.id})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {tab.sublabel}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                  {/* Reorder Up */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 shadow-2xs cursor-pointer"
                    title="Chuyển lên"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    type="button"
                    disabled={idx === sortedTabs.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed border border-slate-200 shadow-2xs cursor-pointer"
                    title="Chuyển xuống"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(tab.id)}
                    className={`p-2 rounded-xl border shadow-2xs cursor-pointer transition-colors ${
                      tab.isVisible
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                    }`}
                    title={tab.isVisible ? 'Bấm để ẩn khỏi người dân' : 'Bấm để hiển thị cho người dân'}
                  >
                    {tab.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Tab details */}
                  <button
                    type="button"
                    onClick={() => setEditingTab(tab)}
                    className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-2xs cursor-pointer"
                    title="Chỉnh sửa tên và mô tả"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete tab */}
                  <button
                    type="button"
                    onClick={() => handleDeleteTab(tab.id, tab.label)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-2xs cursor-pointer"
                    title="Xóa menu này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Edit Existing Tab */}
      {editingTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Chỉnh sửa Menu "{editingTab.label}"
              </h4>
              <button
                type="button"
                onClick={() => setEditingTab(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTab} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên hiển thị trên menu (*):
                </label>
                <input
                  type="text"
                  required
                  value={editingTab.label}
                  onChange={(e) => setEditingTab({ ...editingTab, label: e.target.value })}
                  placeholder="Nhập tên menu..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dòng mô tả phụ dưới tên menu:
                </label>
                <input
                  type="text"
                  value={editingTab.sublabel}
                  onChange={(e) => setEditingTab({ ...editingTab, sublabel: e.target.value })}
                  placeholder="Nhập mô tả ngắn gọn..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Biểu tượng (Icon):
                </label>
                <select
                  value={editingTab.iconName}
                  onChange={(e) => setEditingTab({ ...editingTab, iconName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold outline-none cursor-pointer bg-slate-50"
                >
                  {AVAILABLE_ICONS.map(ic => (
                    <option key={ic.name} value={ic.name}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="tabVisibleCheck"
                  checked={editingTab.isVisible}
                  onChange={(e) => setEditingTab({ ...editingTab, isVisible: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="tabVisibleCheck" className="font-bold text-slate-700 cursor-pointer">
                  Hiển thị menu này cho người dân
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTab(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Custom Tab */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Thêm Menu Mới cho Phân hệ Người dân
              </h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTab} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên hiển thị menu (*):
                </label>
                <input
                  type="text"
                  required
                  value={newTabLabel}
                  onChange={(e) => setNewTabLabel(e.target.value)}
                  placeholder="VD: Bản đồ địa chính, Dịch vụ bưu chính..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Dòng mô tả phụ dưới tên menu:
                </label>
                <input
                  type="text"
                  value={newTabSublabel}
                  onChange={(e) => setNewTabSublabel(e.target.value)}
                  placeholder="VD: Hướng dẫn chi tiết cho bà con..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gắn với phân hệ nội dung:
                </label>
                <select
                  value={newTabBase}
                  onChange={(e) => setNewTabBase(e.target.value as PortalTab)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold outline-none cursor-pointer bg-slate-50"
                >
                  <option value="procedures">Thủ tục hành chính (Kho TTHC)</option>
                  <option value="news">Tin tức & Sự kiện</option>
                  <option value="schedule">Lịch công tác</option>
                  <option value="transparency">Niêm yết & Giám sát</option>
                  <option value="traffic_flood">Đường ngập & Kẹt xe</option>
                  <option value="contacts">Liên hệ & Danh bạ</option>
                  <option value="feedback">Góp ý phản ánh</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Biểu tượng (Icon):
                </label>
                <select
                  value={newTabIcon}
                  onChange={(e) => setNewTabIcon(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold outline-none cursor-pointer bg-slate-50"
                >
                  {AVAILABLE_ICONS.map(ic => (
                    <option key={ic.name} value={ic.name}>
                      {ic.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Thêm menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
