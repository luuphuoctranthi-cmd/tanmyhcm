import React, { useState } from 'react';
import { TransparencyItem } from '../../types';
import {
  ShieldCheck,
  Search,
  Download,
  FileText,
  DollarSign,
  Building,
  CheckCircle2,
  Calendar,
  Eye,
  X,
  ExternalLink,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface TransparencySectionProps {
  items: TransparencyItem[];
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({ items }) => {
  const [activeSubTab, setActiveSubTab] = useState<'procedures' | 'finance_investment'>('procedures');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingItem, setViewingItem] = useState<TransparencyItem | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSubTab =
      activeSubTab === 'procedures'
        ? item.category === 'Thủ tục hành chính'
        : item.category === 'Tài chính - Ngân sách' ||
          item.category === 'Đầu tư công - Dự án' ||
          item.category === 'Quỹ vận động nhân dân';

    const matchesSearch =
      !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.documentCode && item.documentCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSubTab && matchesSearch;
  });

  const handleDownloadDoc = (doc: TransparencyItem) => {
    const content = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n------------------------------------\nỦY BAN NHÂN DÂN PHƯỜNG TÂN MỸ\n\nNIÊM YẾT CÔNG KHAI VĂN BẢN & SỐ LIỆU MINH BẠCH\nSố hiệu: ${doc.documentCode || 'NY-2026'}\nNgày niêm yết: ${doc.issueDate}\nCơ quan ban hành: ${doc.issuingAuthority}\n\nTIÊU ĐỀ: ${doc.title.toUpperCase()}\n\n1. TÓM TẮT NỘI DUNG:\n${doc.summary}\n\n2. THÔNG TIN CHI TIẾT & SỐ LIỆU:\n${doc.details || 'Theo hồ sơ lưu trữ tại UBND Phường Tân Mỹ.'}\n${doc.amountOrBudget ? `Quy mô kinh phí / Ngân sách: ${doc.amountOrBudget}` : ''}\n\n3. TRẠNG THÁI NIÊM YẾT: ${doc.status}\n\nỦy ban nhân dân Phường Tân Mỹ thực hiện niêm yết công khai theo quy định của Luật Thực hiện dân chủ ở cơ sở để toàn thể Nhân dân được biết, giám sát và kiểm tra.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.documentCode || 'NiemYet'}_${doc.title.slice(0, 30).replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DÂN BIẾT — DÂN BÀN — DÂN LÀM — DÂN KIỂM TRA
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              UBND Phường Tân Mỹ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Niêm yết và Giám sát Minh bạch
          </h2>
        </div>

        {/* 2 Main Sub-Tabs as requested */}
        <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('procedures')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'procedures'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Thủ tục hành chính</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('finance_investment')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'finance_investment'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Tài chính, ngân sách & đầu tư</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeSubTab === 'procedures'
                ? 'Tìm quyết định công bố, bảng niêm yết thủ tục, phí lệ phí...'
                : 'Tìm dự toán ngân sách, quyết toán, dự án đầu tư công, quỹ vận động nhân dân...'
            }
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-medium"
          />
        </div>
      </div>

      {/* SUBTAB 1: THỦ TỤC HÀNH CHÍNH NIÊM YẾT */}
      {activeSubTab === 'procedures' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-6 text-white shadow-md space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              CÔNG KHAI QUY TRÌNH & THỜI HẠN GIẢI QUYẾT TTHC
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              100% Thủ tục hành chính được niêm yết công khai, minh bạch
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Mọi quy trình giải quyết hồ sơ, mức thu phí/lệ phí và mẫu biểu đều được niêm yết trực tiếp tại bộ phận Một cửa và trên Cổng dịch vụ công điện tử theo quy định của Chính phủ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                      {item.documentCode}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                    <div>Cơ quan ban hành: <strong>{item.issuingAuthority}</strong></div>
                    <div>Ngày niêm yết: <span className="font-mono">{item.issueDate}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewingItem(item)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem nội dung niêm yết</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(item)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải văn bản</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CÔNG KHAI TÀI CHÍNH, NGÂN SÁCH VÀ ĐẦU TƯ */}
      {activeSubTab === 'finance_investment' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              GIÁM SÁT ĐẦU TƯ CỦA CỘNG ĐỒNG & CÔNG KHAI THU CHI
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              Minh bạch Dự toán, Quyết toán Ngân sách & Các Dự án Đầu tư Công
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              UBND Phường Tân Mỹ công khai định kỳ dự toán thu chi ngân sách, tiến độ giải ngân các công trình giao thông, trường học, trạm y tế và các nguồn quỹ vận động nhân dân.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      {item.documentCode}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    {item.title}
                  </h4>

                  {item.amountOrBudget && (
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-emerald-900 font-bold uppercase text-[10px]">Kinh phí / Ngân sách:</span>
                      <strong className="text-sm font-black text-emerald-700 font-mono">
                        {item.amountOrBudget}
                      </strong>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>Cơ quan công khai: <strong>{item.issuingAuthority}</strong></div>
                    <div>Ngày công khai: <span className="font-mono">{item.issueDate}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setViewingItem(item)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem số liệu chi tiết</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(item)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải bảng biểu</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Xem chi tiết nội dung niêm yết */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setViewingItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {viewingItem.category}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {viewingItem.title}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2.5 leading-relaxed">
              <div>
                <strong className="text-slate-900 block font-bold">Tóm tắt niêm yết:</strong>
                <p className="mt-0.5">{viewingItem.summary}</p>
              </div>

              {viewingItem.amountOrBudget && (
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                  <span className="text-slate-500 text-xs block font-bold">Kinh phí / Ngân sách công khai:</span>
                  <strong className="text-base font-black text-emerald-700 font-mono">
                    {viewingItem.amountOrBudget}
                  </strong>
                </div>
              )}

              {viewingItem.details && (
                <div>
                  <strong className="text-slate-900 block font-bold">Chi tiết công tác thực hiện:</strong>
                  <p className="mt-0.5 text-xs text-slate-600">{viewingItem.details}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                <div>Số hiệu văn bản: <strong className="font-mono text-slate-700">{viewingItem.documentCode}</strong></div>
                <div>Cơ quan công khai: <strong>{viewingItem.issuingAuthority}</strong></div>
                <div>Thời điểm niêm yết: <span className="font-mono">{viewingItem.issueDate}</span></div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handleDownloadDoc(viewingItem)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải tài liệu niêm yết</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
