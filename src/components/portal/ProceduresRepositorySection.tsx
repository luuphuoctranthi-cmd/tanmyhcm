import React, { useState } from 'react';
import { Procedure, FormTemplateDocument } from '../../types';
import { DEFAULT_FORM_TEMPLATES } from '../../data/portalData';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  FolderOpen,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck,
  ChevronRight,
  Eye,
  X
} from 'lucide-react';

interface ProceduresRepositoryProps {
  procedures: Procedure[];
  onSelectProcedure?: (procedure: Procedure) => void;
}

export const ProceduresRepositorySection: React.FC<ProceduresRepositoryProps> = ({
  procedures,
  onSelectProcedure
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'procedures' | 'forms'>('procedures');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [viewingForm, setViewingForm] = useState<FormTemplateDocument | null>(null);

  const categories = ['Tất cả', 'Hộ tịch', 'Cư trú', 'Chứng thực', 'Đất đai - Xây dựng', 'Bảo trợ xã hội'];

  // Filter procedures
  const filteredProcedures = procedures.filter(p => {
    const matchesCat = selectedCategory === 'Tất cả' || p.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter forms
  const filteredForms = DEFAULT_FORM_TEMPLATES.filter(f => {
    const matchesCat = selectedCategory === 'Tất cả' || f.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Mock download simulation
  const handleDownloadForm = (form: FormTemplateDocument) => {
    const content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\n${form.title.toUpperCase()}\n(${form.code})\n\nKính gửi: UBND PHƯỜNG TÂN MỸ\n\nHọ và tên người khai: ........................................................\nNgày tháng năm sinh: .................... Giới tính: ...........\nSố CCCD/Định danh cá nhân: .............................................\nNơi thường trú: .............................................................\nNội dung yêu cầu giải quyết:\n................................................................................\n\nTôi xin cam đoan những lời khai trên là hoàn toàn đúng sự thật.\n\n                  Tân Mỹ, ngày ..... tháng ..... năm 2026\n                                 Người làm đơn\n                            (Ký và ghi rõ họ tên)`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.code}_${form.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
              <FolderOpen className="w-3.5 h-3.5" /> KHO TRA CỨU HÀNH CHÍNH
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              UBND Phường Tân Mỹ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Kho Thủ tục hành chính, Biểu mẫu & Dịch vụ công
          </h2>
        </div>

        {/* Sub-tabs switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('procedures')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'procedures'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Danh mục thủ tục ({procedures.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('forms')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'forms'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kho biểu mẫu tờ khai ({DEFAULT_FORM_TEMPLATES.length})
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thủ tục, từ khóa, mã thủ tục hoặc loại biểu mẫu (Ví dụ: khai sinh, tạm trú, kết hôn, CT01)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SUBTAB 1: PROCEDURES LIST */}
      {activeSubTab === 'procedures' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProcedures.map((proc) => (
              <div
                key={proc.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                      {proc.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {proc.code || 'Mức độ 4'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {proc.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proc.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Nơi tiếp nhận:</span>
                      <strong className="text-slate-800 font-semibold">{proc.counterDepartment}</strong>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Lệ phí:</span>
                      <strong className="text-emerald-700 font-semibold">{proc.fee}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProcedure?.(proc)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Hướng dẫn bằng giọng nói</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={proc.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Nộp online</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredProcedures.length === 0 && (
            <div className="p-10 bg-white rounded-3xl border border-slate-200 text-center text-slate-500 text-sm">
              Không tìm thấy thủ tục nào phù hợp với từ khóa "{searchTerm}".
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: FORMS & TEMPLATES */}
      {activeSubTab === 'forms' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {form.category}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                      {form.fileFormat}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {form.title}
                  </h3>

                  <div className="text-[11px] font-mono font-bold text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 inline-block">
                    {form.code}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {form.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setViewingForm(form)}
                    className="text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem mẫu</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadForm(form)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải biểu mẫu</span>
                    </button>
                    {form.serviceActionUrl && (
                      <a
                        href={form.serviceActionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                        title="Nộp trực tuyến trên Cổng DVC"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Xem trước biểu mẫu */}
      {viewingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setViewingForm(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {viewingForm.title}
                </h3>
                <span className="text-xs font-mono text-blue-700 font-bold">{viewingForm.code}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs text-slate-700 space-y-2 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {`CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\n${viewingForm.title.toUpperCase()}\n(${viewingForm.code})\n\nKính gửi: ỦY BAN NHÂN DÂN PHƯỜNG TÂN MỸ\n\nHọ và tên người khai: ........................................................\nNgày tháng năm sinh: .......... / .......... / .............  Giới tính: ...........\nSố CCCD / Số định danh cá nhân: .............................................\nNơi thường trú: .............................................................\nNơi ở hiện nay: .............................................................\nNội dung đề nghị giải quyết:\n................................................................................\n................................................................................\n\nTôi xin cam đoan những lời khai trên là hoàn toàn đúng sự thật và chịu mọi trách nhiệm trước pháp luật.\n\n                  Tân Mỹ, ngày ..... tháng ..... năm 2026\n                                 Người làm đơn\n                            (Ký và ghi rõ họ tên)`}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewingForm(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handleDownloadForm(viewingForm)}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải biểu mẫu về máy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
