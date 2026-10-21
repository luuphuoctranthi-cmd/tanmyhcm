import React, { useState } from 'react';
import { CitizenFeedback } from '../../types';
import {
  MessageSquareHeart,
  Send,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Filter,
  Sparkles
} from 'lucide-react';
import { playSuccessChime } from '../../utils/audioChime';

interface FeedbackSectionProps {
  feedbacks: CitizenFeedback[];
  onAddFeedback: (feedback: CitizenFeedback) => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  feedbacks,
  onAddFeedback
}) => {
  const [senderName, setSenderName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('Khu phố 1');
  const [category, setCategory] = useState<CitizenFeedback['category']>('Thủ tục hành chính');
  const [content, setContent] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const neighborhoods = ['Khu phố 1', 'Khu phố 2', 'Khu phố 3', 'Khu phố 4', 'Khu phố 5', 'Địa bàn khác'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !phone.trim() || !content.trim()) return;

    const newFeedback: CitizenFeedback = {
      id: `fb-${Date.now()}`,
      senderName: senderName.trim(),
      phone: phone.trim().slice(0, 4) + ' *** ' + phone.trim().slice(-3),
      neighborhood: `${neighborhood}, Phường Tân Mỹ`,
      category,
      content: content.trim(),
      createdAt: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      status: 'Đã tiếp nhận',
      officialResponse: 'UBND Phường Tân Mỹ đã ghi nhận ý kiến phản ánh của Bạn và chuyển đến bộ phận chuyên trách xác minh xử lý.'
    };

    onAddFeedback(newFeedback);
    playSuccessChime();
    setSubmittedSuccess(true);

    // Reset form
    setContent('');
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 6000);
  };

  const filtered = feedbacks.filter(fb => {
    if (statusFilter === 'Tất cả') return true;
    return fb.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <MessageSquareHeart className="w-3.5 h-3.5" /> DIỄN ĐÀN Ý KIẾN CÔNG DÂN
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Lắng nghe nhân dân — Hành động vì nhân dân
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Góp ý, Phản ánh & Kiến nghị cho Chính quyền Phường
          </h2>
        </div>
      </div>

      {/* 2 Columns: Form on Left/Top and Public Responses on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form: Gửi phản ánh (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="space-y-1 pb-3 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Gửi ý kiến đóng góp mới</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mọi phản ánh về thủ tục hành chính, trật tự lòng lề đường, vệ sinh môi trường sẽ được UBND phường tiếp nhận và xử lý nhanh chóng.
            </p>
          </div>

          {submittedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 text-xs sm:text-sm space-y-1 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Gửi phản ánh thành công!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Cảm ơn bạn. UBND Phường Tân Mỹ đã ghi nhận thông tin phản ánh và sẽ cập nhật tiến độ xử lý công khai.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Họ và tên của bạn (*):
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Số điện thoại (*):
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Khu phố:
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-white"
                >
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Lĩnh vực góp ý / phản ánh:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CitizenFeedback['category'])}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none font-medium bg-white"
              >
                <option value="Thủ tục hành chính">Thủ tục hành chính Một cửa</option>
                <option value="Trật tự đô thị">Trật tự đô thị, lấn chiếm vỉa hè</option>
                <option value="Vệ sinh môi trường">Vệ sinh môi trường, rác thải</option>
                <option value="An ninh trật tự">An ninh trật tự, tiếng ồn</option>
                <option value="Góp ý khác">Góp ý khác</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nội dung chi tiết (*):
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Mô tả cụ thể sự việc, địa điểm hoặc nội dung bạn muốn góp ý cho UBND Phường Tân Mỹ..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>GỬI PHẢN ÁNH CHO CHÍNH QUYỀN</span>
            </button>
          </form>
        </div>

        {/* Public Feedback Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-black uppercase text-slate-800">
              KẾT QUẢ TIẾP NHẬN & PHẢN HỒI ({filtered.length})
            </span>

            <div className="flex items-center gap-1.5 text-xs">
              {['Tất cả', 'Đã giải quyết', 'Đang xử lý', 'Đã tiếp nhận'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      {item.senderName}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">{item.phone}</span>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      item.status === 'Đã giải quyết'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : item.status === 'Đang xử lý'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {item.category}
                  </span>
                  <span>•</span>
                  <span>{item.neighborhood}</span>
                  <span>•</span>
                  <span>{item.createdAt}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  "{item.content}"
                </p>

                {/* Official Government Response Box */}
                {item.officialResponse && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-950 uppercase">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>Ý KIẾN TRẢ LỜI CỦA UBND PHƯỜNG TÂN MỸ ({item.officerInCharge || 'Bộ phận chuyên trách'}):</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.officialResponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
