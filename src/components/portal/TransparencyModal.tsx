import React, { useState, useEffect } from 'react';
import { TransparencyItem } from '../../types';
import { X, ShieldCheck, DollarSign, Building, FileText, CheckCircle2 } from 'lucide-react';

interface TransparencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: TransparencyItem) => void;
  initialData?: TransparencyItem | null;
}

export const TransparencyModal: React.FC<TransparencyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [title, setTitle] = useState('');
  const [documentCode, setDocumentCode] = useState('');
  const [category, setCategory] = useState<TransparencyItem['category']>('Thủ tục hành chính');
  const [issueDate, setIssueDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('UBND Phường Tân Mỹ');
  const [summary, setSummary] = useState('');
  const [details, setDetails] = useState('');
  const [amountOrBudget, setAmountOrBudget] = useState('');
  const [status, setStatus] = useState<TransparencyItem['status']>('Đang niêm yết');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDocumentCode(initialData.documentCode || '');
      setCategory(initialData.category);
      setIssueDate(initialData.issueDate);
      setIssuingAuthority(initialData.issuingAuthority);
      setSummary(initialData.summary);
      setDetails(initialData.details || '');
      setAmountOrBudget(initialData.amountOrBudget || '');
      setStatus(initialData.status);
      setFileFormat(initialData.fileFormat || 'PDF');
    } else {
      setTitle('');
      setDocumentCode(`QĐ-${Math.floor(100 + Math.random() * 900)}/QĐ-UBND`);
      setCategory('Thủ tục hành chính');
      setIssueDate(new Date().toLocaleDateString('vi-VN'));
      setIssuingAuthority('UBND Phường Tân Mỹ');
      setSummary('');
      setDetails('');
      setAmountOrBudget('');
      setStatus('Đang niêm yết');
      setFileFormat('PDF');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    onSave({
      id: initialData?.id || `trans-${Date.now()}`,
      title: title.trim(),
      documentCode: documentCode.trim() || undefined,
      category,
      issueDate: issueDate.trim() || new Date().toLocaleDateString('vi-VN'),
      issuingAuthority: issuingAuthority.trim() || 'UBND Phường Tân Mỹ',
      summary: summary.trim(),
      details: details.trim() || undefined,
      amountOrBudget: amountOrBudget.trim() || undefined,
      status,
      fileFormat
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {initialData ? 'Chỉnh sửa Văn bản Niêm yết' : 'Thêm Văn bản Niêm yết Công khai'}
              </h3>
              <p className="text-xs text-slate-500">
                Công khai quy hoạch, ngân sách, dự án đầu tư và thủ tục theo quy chế dân chủ cơ sở
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
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề văn bản niêm yết (*):
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Quyết định công khai dự toán thu - chi ngân sách năm 2026..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lĩnh vực / Chuyên mục:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransparencyItem['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Thủ tục hành chính">Thủ tục hành chính</option>
                <option value="Tài chính - Ngân sách">Tài chính - Ngân sách</option>
                <option value="Đầu tư công - Dự án">Đầu tư công - Dự án</option>
                <option value="Quỹ vận động nhân dân">Quỹ vận động nhân dân</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số hiệu văn bản:
              </label>
              <input
                type="text"
                value={documentCode}
                onChange={(e) => setDocumentCode(e.target.value)}
                placeholder="VD: QĐ-1582/QĐ-UBND"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Kinh phí / Ngân sách (nếu có):
              </label>
              <input
                type="text"
                value={amountOrBudget}
                onChange={(e) => setAmountOrBudget(e.target.value)}
                placeholder="VD: 2 tỷ 850 triệu VNĐ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Trạng thái niêm yết:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransparencyItem['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Đang niêm yết">Đang niêm yết</option>
                <option value="Công khai định kỳ">Công khai định kỳ</option>
                <option value="Đã nghiệm thu">Đã nghiệm thu</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tóm tắt nội dung chính (*):
            </label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt nội dung văn bản niêm yết cho bà con dễ nắm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Chi tiết / Ghi chú số liệu:
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Thông tin tiến độ, đơn vị thi công, giám sát cộng đồng..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
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
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{initialData ? 'Lưu thay đổi' : 'Niêm yết ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
