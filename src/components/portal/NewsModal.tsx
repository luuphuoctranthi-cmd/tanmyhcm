import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import { X, Newspaper, Link as LinkIcon, Image, Sparkles } from 'lucide-react';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: Omit<NewsArticle, 'id' | 'viewsCount'>) => void;
  initialData?: NewsArticle | null;
}

const DEFAULT_NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80'
];

export const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NewsArticle['category']>('Hoạt động Phường');
  const [imageUrl, setImageUrl] = useState(DEFAULT_NEWS_IMAGES[0]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [author, setAuthor] = useState('UBND Phường Tân Mỹ');
  const [publishedAt, setPublishedAt] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setSummary(initialData.summary);
      setContent(initialData.content);
      setCategory(initialData.category);
      setImageUrl(initialData.imageUrl || DEFAULT_NEWS_IMAGES[0]);
      setSourceUrl(initialData.sourceUrl || '');
      setAuthor(initialData.author || 'UBND Phường Tân Mỹ');
      setPublishedAt(initialData.publishedAt);
      setIsFeatured(Boolean(initialData.isFeatured));
    } else {
      setTitle('');
      setSummary('');
      setContent('');
      setCategory('Hoạt động Phường');
      setImageUrl(DEFAULT_NEWS_IMAGES[Math.floor(Math.random() * DEFAULT_NEWS_IMAGES.length)]);
      setSourceUrl('');
      setAuthor('UBND Phường Tân Mỹ');
      setPublishedAt(new Date().toLocaleDateString('vi-VN'));
      setIsFeatured(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    onSave({
      title: title.trim(),
      summary: summary.trim(),
      content: (content.trim() || summary.trim()),
      category,
      imageUrl: imageUrl.trim() || DEFAULT_NEWS_IMAGES[0],
      sourceUrl: sourceUrl.trim() || undefined,
      author: author.trim() || 'UBND Phường Tân Mỹ',
      publishedAt: publishedAt.trim() || new Date().toLocaleDateString('vi-VN'),
      isFeatured
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {initialData ? 'Chỉnh sửa bài viết / sự kiện' : 'Đăng tin tức & sự kiện mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Nhập nội dung hoặc copy đường dẫn từ Facebook để hiển thị trên bảng tin
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
          {/* Tiêu đề */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề bài viết / Sự kiện (*):
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Hội nghị tuyên truyền Luật Đất đai năm 2026 tại UBND Phường Tân Mỹ..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Chuyên mục */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chuyên mục:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsArticle['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Hoạt động Phường">Hoạt động Phường</option>
                <option value="Chuyển đổi số">Chuyển đổi số</option>
                <option value="An ninh trật tự">An ninh trật tự</option>
                <option value="Chính sách mới">Chính sách mới</option>
                <option value="Mặt trận - Đoàn thể">Mặt trận - Đoàn thể</option>
              </select>
            </div>

            {/* Ngày đăng */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Ngày đăng:
              </label>
              <input
                type="text"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                placeholder="20/10/2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Đường link Facebook hoặc Báo chí */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Link bài viết Facebook hoặc Báo điện tử (nếu có):</span>
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://facebook.com/ubndphuongtanmy/posts/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Tóm tắt ngắn */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tóm tắt nội dung (*):
            </label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn gọn 1-2 câu để hiển thị nổi bật trên banner..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
            />
          </div>

          {/* Nội dung chi tiết */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Nội dung chi tiết:
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung đầy đủ của bài viết hoặc thông báo..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Ảnh đại diện URL */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-slate-500" />
                <span>Link hình ảnh minh họa:</span>
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Tác giả */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tác giả / Đơn vị đăng tin:
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="UBND Phường Tân Mỹ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Đặt làm tin nổi bật trên slider */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="isFeaturedNews"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded cursor-pointer"
            />
            <label htmlFor="isFeaturedNews" className="text-xs font-bold text-amber-900 cursor-pointer flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ghim lên Bảng tin động (Hiển thị luân phiên tự động trên banner)</span>
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
              <Newspaper className="w-4 h-4" />
              <span>{initialData ? 'Lưu thay đổi' : 'Đăng bài viết ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
