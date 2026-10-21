import React, { useState } from 'react';
import { Procedure } from '../types';
import { X, Play, QrCode, Smartphone, KeyRound, CheckCircle2, FileEdit, ArrowRight, ShieldCheck, MonitorPlay, Upload, Video } from 'lucide-react';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: Procedure;
  onUpdateVideoFile?: (videoDataUrl: string, fileName: string) => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  isOpen,
  onClose,
  procedure,
  onUpdateVideoFile
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'vneid_steps'>('video');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(procedure.videoDataUrl || null);

  if (!isOpen) return null;

  // Handle direct file upload for video
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Vui lòng chọn tệp định dạng video (MP4, WebM, MOV, v.v.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomVideoUrl(dataUrl);
      onUpdateVideoFile?.(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const videoSource = customVideoUrl || procedure.videoDataUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 rounded-2xl text-slate-950 shadow-md">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 block">
                VIDEO HƯỚNG DẪN THAO TÁC TRỰC TIẾP
              </span>
              <h3 className="text-lg sm:text-xl font-black line-clamp-1">
                {procedure.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Upload Action Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Xem Video Trực Tiếp</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('vneid_steps')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'vneid_steps'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>2 Cách Đăng Nhập VNeID</span>
            </button>
          </div>

          {/* Quick upload video button right inside modal */}
          <label className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Tải video mới lên (.mp4)</span>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {activeTab === 'video' ? (
            <div className="space-y-4">
              {/* Native In-App Video Player */}
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-xl flex items-center justify-center">
                {videoSource ? (
                  <video
                    src={videoSource}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Trình duyệt của bạn không hỗ trợ thẻ video HTML5.
                  </video>
                ) : (
                  /* Visual Video Walkthrough Simulator when no file uploaded yet */
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col justify-between p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                          MÔ PHỎNG THAO TÁC TRỰC TUYẾN • UBND PHƯỜNG TÂN MỸ
                        </span>
                      </div>
                      <span className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-slate-300 font-mono">
                        Cổng Dịch vụ công Quốc gia
                      </span>
                    </div>

                    <div className="my-auto text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl ring-4 ring-amber-400/40">
                        <Play className="w-8 h-8 ml-1" />
                      </div>
                      <h4 className="text-lg sm:text-2xl font-black text-white">
                        Quy trình nộp trực tuyến: {procedure.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-200 max-w-lg mx-auto leading-relaxed">
                        Cán bộ có thể bấm nút <strong>"Tải video mới lên (.mp4)"</strong> ở góc phải trên để nạp video quay màn hình thực tế của phường vào đây xem trực tiếp.
                      </p>
                    </div>

                    {/* Timeline steps */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-4 border-t border-white/10">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-amber-300 font-bold block">1. Đăng nhập VNeID</span>
                        <span className="text-slate-300">Quét mã QR hoặc nhập số CCCD</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-amber-300 font-bold block">2. Điền form điện tử</span>
                        <span className="text-slate-300">Hệ thống điền sẵn thông tin</span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <span className="text-amber-300 font-bold block">3. Nộp & Nhận mã hẹn</span>
                        <span className="text-slate-300">Biên nhận điện tử hợp lệ</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {procedure.videoFileName && (
                <p className="text-xs text-slate-500 italic">
                  Đang phát tệp video: <strong className="text-slate-700">{procedure.videoFileName}</strong>
                </p>
              )}
            </div>
          ) : null}

          {/* VNeID 2-Way Login Detailed Instructions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  ★
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    2 Cách Đăng nhập VNeID khi bấm vào link nộp hồ sơ
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sau khi bấm nút màu xanh lá cây, Cổng dịch vụ công sẽ yêu cầu đăng nhập:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Cách 1 */}
                <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold text-xs uppercase tracking-wide">
                    <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <span>CÁCH 1: Quét mã QR bằng app VNeID</span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Trên màn hình máy tính xuất hiện một <strong>Mã QR đăng nhập</strong>.</li>
                    <li>Mở ứng dụng <strong>VNeID</strong> trên điện thoại thông minh.</li>
                    <li>Chạm vào biểu tượng <strong>Quét mã QR</strong> ở góc trên bên phải app.</li>
                    <li>Hướng camera vào mã QR trên màn hình máy tính để xác nhận.</li>
                  </ol>
                </div>

                {/* Cách 2 */}
                <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-xs uppercase tracking-wide">
                    <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <span>CÁCH 2: Nhập số định danh cá nhân</span>
                  </div>
                  <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>Nhập <strong>Số định danh cá nhân</strong> (12 số in trên thẻ CCCD).</li>
                    <li>Nhập <strong>Mật khẩu VNeID</strong> của bạn.</li>
                    <li>Nhập mã <strong>OTP</strong> gửi về điện thoại để hoàn tất.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Video chạy trực tiếp trên ứng dụng, không chuyển trang bên ngoài.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer ml-auto"
          >
            Đóng video
          </button>
        </div>
      </div>
    </div>
  );
};
