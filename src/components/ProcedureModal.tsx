import React, { useState, useEffect } from 'react';
import { Procedure, ProcedureStep, RequiredDocument } from '../types';
import { X, Plus, Trash2, HelpCircle, Sparkles, Volume2, Link as LinkIcon, CheckCircle, Video } from 'lucide-react';
import { ttsManager } from '../utils/speechSynthesis';

interface ProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (procedure: Procedure) => void;
  editingProcedure?: Procedure | null;
}

export const ProcedureModal: React.FC<ProcedureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProcedure
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<Procedure['category']>('Hộ tịch');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [videoTutorialUrl, setVideoTutorialUrl] = useState('');
  const [videoDataUrl, setVideoDataUrl] = useState<string | undefined>(undefined);
  const [videoFileName, setVideoFileName] = useState<string | undefined>(undefined);
  const [summary, setSummary] = useState('');
  const [counterDepartment, setCounterDepartment] = useState('Quầy số 01 - Tiếp nhận & Trả kết quả (Một cửa UBND Phường Tân Mỹ)');
  const [processingTime, setProcessingTime] = useState('Trong ngày làm việc');
  const [fee, setFee] = useState('Miễn phí');
  const [customSpeechText, setCustomSpeechText] = useState('');

  // Steps
  const [steps, setSteps] = useState<ProcedureStep[]>([
    { title: 'Bước 1: Chuẩn bị hồ sơ', description: 'Chuẩn bị đầy đủ giấy tờ cần thiết theo quy định.', tips: '' },
    { title: 'Bước 2: Nộp trực tuyến qua VNeID', description: 'Đăng nhập VNeID bằng cách quét mã QR hoặc số CCCD và nộp hồ sơ.', tips: '' }
  ]);

  // Documents (Cán bộ nhập liệu để AI đọc cho dân)
  const [docs, setDocs] = useState<RequiredDocument[]>([
    { name: 'Căn cước công dân của người yêu cầu', note: 'Bản chính đối chiếu hoặc qua VNeID', isRequired: true }
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProcedure) {
      setName(editingProcedure.name);
      setCode(editingProcedure.code || '');
      setCategory(editingProcedure.category);
      setKeywordsInput(editingProcedure.keywords.join(', '));
      setActionUrl(editingProcedure.actionUrl);
      setVideoTutorialUrl(editingProcedure.videoTutorialUrl || '');
      setVideoDataUrl(editingProcedure.videoDataUrl);
      setVideoFileName(editingProcedure.videoFileName);
      setSummary(editingProcedure.summary);
      setCounterDepartment(editingProcedure.counterDepartment || 'Quầy tiếp nhận Một cửa');
      setProcessingTime(editingProcedure.processingTime || 'Trong ngày làm việc');
      setFee(editingProcedure.fee || 'Miễn phí');
      setCustomSpeechText(editingProcedure.customSpeechText || '');
      setSteps(editingProcedure.steps.length ? editingProcedure.steps : [{ title: 'Bước 1', description: '', tips: '' }]);
      setDocs(editingProcedure.requiredDocuments.length ? editingProcedure.requiredDocuments : [{ name: '', isRequired: true }]);
    } else {
      setName('');
      setCode('');
      setCategory('Hộ tịch');
      setKeywordsInput('');
      setActionUrl('https://dichvucong.gov.vn');
      setVideoTutorialUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      setVideoDataUrl(undefined);
      setVideoFileName(undefined);
      setSummary('');
      setCounterDepartment('Quầy số 01 - Tiếp nhận & Trả kết quả (Một cửa UBND Phường Tân Mỹ)');
      setProcessingTime('Trong ngày làm việc');
      setFee('Miễn phí');
      setCustomSpeechText('');
      setSteps([
        { title: 'Bước 1: Chuẩn bị hồ sơ', description: 'Chuẩn bị đầy đủ giấy tờ theo quy định.', tips: '' },
        { title: 'Bước 2: Nộp trực tuyến qua VNeID', description: 'Đăng nhập VNeID bằng cách quét mã QR hoặc số CCCD và nộp hồ sơ.', tips: '' }
      ]);
      setDocs([
        { name: 'Căn cước công dân của người thực hiện', note: 'Bản chính hoặc VNeID', isRequired: true }
      ]);
    }
    setFormError(null);
  }, [editingProcedure, isOpen]);

  if (!isOpen) return null;

  // Add new step
  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        title: `Bước ${steps.length + 1}: `,
        description: '',
        tips: ''
      }
    ]);
  };

  const handleUpdateStep = (index: number, field: keyof ProcedureStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  // Add new doc
  const handleAddDoc = () => {
    setDocs([...docs, { name: '', note: '', isRequired: true }]);
  };

  const handleUpdateDoc = (index: number, field: keyof RequiredDocument, value: any) => {
    const updated = [...docs];
    updated[index] = { ...updated[index], [field]: value };
    setDocs(updated);
  };

  const handleRemoveDoc = (index: number) => {
    if (docs.length <= 1) return;
    setDocs(docs.filter((_, i) => i !== index));
  };

  // Auto generate speech preview strictly adhering to user's desired format
  const handleAutoGenerateSpeech = () => {
    const docList = docs
      .filter(d => d.name.trim())
      .map((d, i) => `Thứ ${i + 1}: ${d.name}${d.note ? ' (' + d.note + ')' : ''}`)
      .join('. ');

    const stepSummary = steps
      .filter(s => s.title.trim())
      .map((s, idx) => `Bước ${idx + 1}: ${s.title}`)
      .join('. ');

    const generated = `Trước khi thực hiện dịch vụ ${name || 'thủ tục này'}, bạn cần chuẩn bị các loại hồ sơ sau: ${docList || 'các giấy tờ theo quy định'}. Sau đây là các bước hướng dẫn thực hiện: ${stepSummary}. Sau khi chuẩn bị xong, bạn bấm vào nút màu xanh lá cây đang nhấp nháy để quét mã VNeID hoặc nhập số định danh để nộp hồ sơ, hoặc bấm vào nút Video bên cạnh để xem hướng dẫn thao tác.`;
    setCustomSpeechText(generated);
  };

  const handleTestSpeech = () => {
    if (customSpeechText) {
      ttsManager.speak(customSpeechText);
    } else {
      handleAutoGenerateSpeech();
      setTimeout(() => {
        ttsManager.speak(`Trước khi thực hiện dịch vụ ${name || 'thủ tục'}, bạn cần chuẩn bị các loại hồ sơ theo quy định.`);
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setFormError('Vui lòng nhập tên thủ tục chính thức.');
      return;
    }

    const parsedKeywords = keywordsInput
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    if (parsedKeywords.length === 0) {
      setFormError('Vui lòng nhập ít nhất một từ khóa giọng nói (ví dụ: khai sinh, giấy khai sinh).');
      return;
    }

    if (!actionUrl.trim()) {
      setFormError('Vui lòng nhập đường link Cổng dịch vụ công trực tuyến.');
      return;
    }

    const procedure: Procedure = {
      id: editingProcedure ? editingProcedure.id : `proc-${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      category,
      keywords: parsedKeywords,
      actionUrl: actionUrl.trim(),
      videoTutorialUrl: videoTutorialUrl.trim() || undefined,
      videoDataUrl: videoDataUrl,
      videoFileName: videoFileName,
      summary: summary.trim() || `Thực hiện thủ tục ${name.trim()} tại UBND Phường Tân Mỹ.`,
      counterDepartment: counterDepartment.trim(),
      processingTime: processingTime.trim(),
      fee: fee.trim(),
      steps: steps.filter(s => s.title.trim() || s.description.trim()),
      requiredDocuments: docs.filter(d => d.name.trim()),
      customSpeechText: customSpeechText.trim(),
      createdAt: editingProcedure ? editingProcedure.createdAt : Date.now(),
      updatedAt: Date.now()
    };

    onSave(procedure);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
              HỆ THỐNG QUẢN TRỊ CMS • UBND PHƯỜNG TÂN MỸ
            </span>
            <h3 className="text-xl font-black mt-0.5">
              {editingProcedure ? 'Chỉnh sửa thủ tục hành chính' : 'Thêm mới thủ tục hành chính'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-sm font-semibold">
              ⚠️ {formError}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Thông tin chung thủ tục
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Tên thủ tục chính thức <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Đăng ký khai sinh (Dưới 14 tuổi)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Lĩnh vực hành chính</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium bg-white"
                >
                  <option value="Hộ tịch">Hộ tịch</option>
                  <option value="Cư trú">Cư trú</option>
                  <option value="Chứng thực">Chứng thực</option>
                  <option value="Đất đai - Xây dựng">Đất đai - Xây dựng</option>
                  <option value="Bảo trợ xã hội">Bảo trợ xã hội</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Đường link nộp hồ sơ Cổng DVC <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="https://dichvucong.gov.vn/..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-blue-700 font-mono"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Video hướng dẫn thao tác (Xem trực tiếp trên ứng dụng)</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">Tải file MP4</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-blue-400 bg-blue-50/60 hover:bg-blue-100/60 text-xs font-bold text-blue-900 cursor-pointer transition-colors">
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>{videoFileName ? `Đã chọn: ${videoFileName}` : 'Bấm để tải file video (.mp4, .webm) từ máy tính'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setVideoDataUrl(ev.target?.result as string);
                            setVideoFileName(file.name);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {videoDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoDataUrl(undefined);
                        setVideoFileName(undefined);
                      }}
                      className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-bold border border-red-200 cursor-pointer"
                      title="Xóa video đã chọn"
                    >
                      Xóa video
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Từ khóa nhận diện giọng nói (Cách nhau bằng dấu phẩy) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="khai sinh, giấy khai sinh, sinh con, làm khai sinh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-500">
                Khi người dân nói bất kỳ từ nào trong danh sách trên, nút micro sẽ ẩn đi và hiển thị nội dung thủ tục này.
              </p>
              {/* Keyword preview pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {keywordsInput
                  .split(',')
                  .map(k => k.trim())
                  .filter(Boolean)
                  .map((k, i) => (
                    <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                      #{k}
                    </span>
                  ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Mô tả tóm tắt cho người dân</label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Mô tả ngắn gọn điều kiện, đối tượng thực hiện thủ tục..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            {/* Quick Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Quầy Một cửa tiếp nhận</label>
                <input
                  type="text"
                  value={counterDepartment}
                  onChange={(e) => setCounterDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Thời hạn giải quyết</label>
                <input
                  type="text"
                  value={processingTime}
                  onChange={(e) => setProcessingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Lệ phí quy định</label>
                <input
                  type="text"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Required Documents (CÁN BỘ NHẬP LIỆU ĐỂ AI DỰA VÀO PHÁT LOA CHO DÂN) */}
          <div className="space-y-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-300">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                  Danh mục hồ sơ giấy tờ cần chuẩn bị (Cán bộ nhập liệu)
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  AI sẽ dựa trực tiếp vào danh sách hồ sơ này để đọc to cho người dân nghe: "Trước khi thực hiện dịch vụ này, bạn cần chuẩn bị các loại hồ sơ sau..."
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddDoc}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg border border-amber-400 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm giấy tờ
              </button>
            </div>

            <div className="space-y-2">
              {docs.map((doc, dIdx) => (
                <div key={dIdx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-xs font-bold text-amber-800 w-5 text-center">
                    {dIdx + 1}.
                  </span>
                  <input
                    type="text"
                    value={doc.name}
                    onChange={(e) => handleUpdateDoc(dIdx, 'name', e.target.value)}
                    placeholder="Tên loại giấy tờ (ví dụ: Giấy chứng sinh bản chính)"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={doc.note || ''}
                    onChange={(e) => handleUpdateDoc(dIdx, 'note', e.target.value)}
                    placeholder="Ghi chú (Bản chính/Bản sao)"
                    className="w-40 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <label className="flex items-center gap-1 text-xs text-slate-700 cursor-pointer whitespace-nowrap px-2">
                    <input
                      type="checkbox"
                      checked={doc.isRequired}
                      onChange={(e) => handleUpdateDoc(dIdx, 'isRequired', e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Bắt buộc</span>
                  </label>
                  {docs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(dIdx)}
                      className="text-red-500 hover:text-red-700 p-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Steps Guide */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Quy trình các bước hướng dẫn người dân
              </h4>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm bước mới
              </button>
            </div>

            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-900">
                      Bước {idx + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="Xóa bước này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                    placeholder="Tiêu đề bước (ví dụ: Bước 1: Chuẩn bị hồ sơ)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold"
                  />

                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                    placeholder="Mô tả chi tiết nội dung cần làm ở bước này..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />

                  <input
                    type="text"
                    value={step.tips || ''}
                    onChange={(e) => handleUpdateStep(idx, 'tips', e.target.value)}
                    placeholder="Lưu ý của cán bộ phường cho người dân (nếu có)..."
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/50 text-xs text-amber-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Text-to-Speech Custom Script (GIỌNG NÓI CỦA AI SẼ NÓI CÁI GÌ) */}
          <div className="space-y-2 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-indigo-700" />
                  Kịch bản giọng nói của AI sẽ đọc cho người dân nghe
                </label>
                <p className="text-[11px] text-indigo-700">
                  Cán bộ nhập vào đây câu nói mà AI sẽ phát loa khi nhận diện thủ tục.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoGenerateSpeech}
                  className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Tạo tự động theo hồ sơ
                </button>
                <button
                  type="button"
                  onClick={handleTestSpeech}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Nghe thử loa AI
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={customSpeechText}
              onChange={(e) => setCustomSpeechText(e.target.value)}
              placeholder="Trước khi thực hiện dịch vụ này, bạn cần chuẩn bị các loại hồ sơ sau... Sau đó là các bước hướng dẫn..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-indigo-200 text-xs bg-white text-slate-800 leading-relaxed font-medium"
            />
          </div>
        </form>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{editingProcedure ? 'Cập nhật thủ tục' : 'Lưu thủ tục mới'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
