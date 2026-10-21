import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../../types';
import {
  Newspaper,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Eye,
  Link as LinkIcon,
  X,
  Flame
} from 'lucide-react';

interface NewsSectionProps {
  news: NewsArticle[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [readingArticle, setReadingArticle] = useState<NewsArticle | null>(null);

  const categories = [
    'Tất cả',
    'Hoạt động Phường',
    'Chuyển đổi số',
    'An ninh trật tự',
    'Chính sách mới',
    'Mặt trận - Đoàn thể'
  ];

  // Auto-slide carousel for dynamic motion ("nó đẩy ra đẩy thì nó đẩy lui lui lui và nó hiển thị cái khác chứ không phải là nó hiển thị một bài cố định")
  const featuredNews = news.filter(n => n.isFeatured);
  const displaySlides = featuredNews.length > 0 ? featuredNews : news;

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % displaySlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [displaySlides.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % displaySlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const filteredNews = news.filter(item => {
    if (selectedCategory === 'Tất cả') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar (Read-only for Citizens) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded border border-red-200 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> BẢN TIN ĐIỆN TỬ
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Cập nhật liên tục 24/7
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Tin tức, Sự kiện & Thông báo Phường Tân Mỹ
          </h2>
        </div>

        <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 self-start sm:self-auto">
          {news.length} tin bài đã đăng
        </span>
      </div>

      {/* 
        DYNAMIC CAROUSEL / SLIDER:
        "các bài viết nó đẩy ra đẩy thì nó đẩy lui lui lui và nó hiển thị cái khác chứ không phải là nó hiển thị một bài cố định"
      */}
      {displaySlides.length > 0 && (
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white group">
          <div className="relative h-[260px] sm:h-[360px] w-full">
            {displaySlides.map((slide, idx) => {
              const isCurrent = idx === currentSlideIndex;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover brightness-60 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                    <div className="max-w-3xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-full shadow-xs">
                          {slide.category}
                        </span>
                        <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {slide.publishedAt}
                        </span>
                        {slide.sourceUrl && (
                          <span className="text-[11px] bg-blue-600/80 text-white px-2 py-0.5 rounded flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" /> Nguồn ngoài
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setReadingArticle(slide)}
                        className="text-lg sm:text-2xl md:text-3xl font-black text-white hover:text-amber-300 transition-colors cursor-pointer line-clamp-2 leading-tight"
                      >
                        {slide.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed hidden sm:block">
                        {slide.summary}
                      </p>

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setReadingArticle(slide)}
                          className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Đọc chi tiết
                        </button>
                        {slide.sourceUrl && (
                          <a
                            href={slide.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>Xem link gốc</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlideIndex(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentSlideIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-blue-900/90 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs">
                {item.category}
              </span>
              {item.sourceUrl && (
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/95 text-blue-700 px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> Link ngoài
                </span>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    {item.viewsCount} xem
                  </span>
                </div>

                <h4
                  onClick={() => setReadingArticle(item)}
                  className="font-black text-slate-900 text-sm sm:text-base leading-snug hover:text-blue-700 transition-colors line-clamp-2 cursor-pointer"
                >
                  {item.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setReadingArticle(item)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <span>Mở link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal: Đọc chi tiết bài viết */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setReadingArticle(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                {readingArticle.category}
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {readingArticle.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {readingArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readingArticle.publishedAt}
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden max-h-72 w-full">
              <img
                src={readingArticle.imageUrl}
                alt={readingArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-blue-600 text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed italic">
              {readingArticle.summary}
            </div>

            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {readingArticle.content}
            </div>

            {readingArticle.sourceUrl && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
                <span className="text-blue-950 font-medium">
                  Bài viết này có liên kết gốc từ Facebook / Báo chí
                </span>
                <a
                  href={readingArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <span>Mở xem trên Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
