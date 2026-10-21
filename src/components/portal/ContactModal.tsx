import React, { useState, useEffect } from 'react';
import { AdministrativeContact } from '../../types';
import { X, PhoneCall, Building2, User, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: AdministrativeContact) => void;
  initialData?: AdministrativeContact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [unitName, setUnitName] = useState('');
  const [personInCharge, setPersonInCharge] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [hotline, setHotline] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('Thứ 2 - Thứ 6 (07:30 - 11:30 & 13:30 - 17:00)');
  const [category, setCategory] = useState<AdministrativeContact['category']>('Một cửa');

  useEffect(() => {
    if (initialData) {
      setUnitName(initialData.unitName);
      setPersonInCharge(initialData.personInCharge);
      setRole(initialData.role);
      setPhone(initialData.phone);
      setHotline(initialData.hotline || '');
      setEmail(initialData.email);
      setAddress(initialData.address);
      setWorkingHours(initialData.workingHours);
      setCategory(initialData.category);
    } else {
      setUnitName('');
      setPersonInCharge('');
      setRole('');
      setPhone('');
      setHotline('');
      setEmail('');
      setAddress('Trụ sở UBND Phường Tân Mỹ');
      setWorkingHours('Thứ 2 - Thứ 6 (07:30 - 11:30 & 13:30 - 17:00)');
      setCategory('Một cửa');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim() || !phone.trim()) return;

    onSave({
      id: initialData?.id || `contact-${Date.now()}`,
      unitName: unitName.trim(),
      personInCharge: personInCharge.trim() || 'Cán bộ phụ trách',
      role: role.trim() || 'Tiếp nhận thông tin',
      phone: phone.trim(),
      hotline: hotline.trim() || undefined,
      email: email.trim() || 'ubnd.tanmy@tphcm.gov.vn',
      address: address.trim() || 'Trụ sở UBND Phường Tân Mỹ',
      workingHours: workingHours.trim() || 'Giờ hành chính',
      category
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {initialData ? 'Chỉnh sửa Liên hệ / Đường dây nóng' : 'Thêm Đơn vị / Số điện thoại liên hệ'}
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật thông tin danh bạ hành chính cho bà con liên hệ thuận tiện
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
              Tên đơn vị / Bộ phận / Tổ chức (*):
            </label>
            <input
              type="text"
              required
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="VD: Bộ phận Tiếp nhận & Trả kết quả (Một cửa)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Phân loại khối:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AdministrativeContact['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="Một cửa">Một cửa</option>
                <option value="Thường trực Lãnh đạo">Thường trực Lãnh đạo</option>
                <option value="Công an - Quân sự">Công an - Quân sự</option>
                <option value="Đoàn thể">Đoàn thể</option>
                <option value="Khu phố">Khu phố</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Số điện thoại liên hệ (*):
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(028) 3771 xxxx"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Người phụ trách / Đ/c:
              </label>
              <input
                type="text"
                value={personInCharge}
                onChange={(e) => setPersonInCharge(e.target.value)}
                placeholder="VD: Đ/c Trần Thị Mai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chức vụ / Nhiệm vụ:
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="VD: Phó Chủ tịch UBND Phụ trách"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Đường dây nóng (nếu có):
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                placeholder="1900 88 66 99"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email công vụ:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ubnd.tanmy@tphcm.gov.vn"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Địa chỉ tiếp nhận:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="VD: Sảnh chính Tầng trệt, Trụ sở UBND Phường Tân Mỹ"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Thời gian làm việc:
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="VD: Sáng 07:30 - 11:30, Chiều 13:30 - 17:00 (Thứ 2 đến Thứ 6)"
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
              <span>{initialData ? 'Lưu thay đổi' : 'Thêm liên hệ ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
