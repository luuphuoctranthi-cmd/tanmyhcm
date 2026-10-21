import React, { useState, useEffect } from 'react';
import { PartyGovLeader } from '../../types';
import { X, Landmark, User, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';

interface PartyGovModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leader: PartyGovLeader) => void;
  initialData?: PartyGovLeader | null;
}

export const PartyGovModal: React.FC<PartyGovModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [group, setGroup] = useState<PartyGovLeader['group']>('hdnd_ubnd');
  const [responsibilities, setResponsibilities] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setGroup(initialData.group);
      setResponsibilities(initialData.responsibilities);
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
    } else {
      setName('');
      setRole('');
      setGroup('hdnd_ubnd');
      setResponsibilities('');
      setPhone('');
      setEmail('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    onSave({
      id: initialData?.id || `pg-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      group,
      responsibilities: responsibilities.trim() || 'Thực hiện chức trách, nhiệm vụ được phân công.',
      phone: phone.trim() || undefined,
      email: email.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {initialData ? 'Chỉnh sửa Cán bộ Lãnh đạo' : 'Thêm Cán bộ Lãnh đạo mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Quản lý nhân sự Đảng ủy, Thường trực HĐND, UBND và Đoàn thể Phường Tân Mỹ
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
              Họ và tên đồng chí (*):
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Đồng chí Nguyễn Văn An..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Khối tổ chức (*):
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value as PartyGovLeader['group'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="dang_uy">Đảng ủy Phường</option>
                <option value="hdnd_ubnd">HĐND - UBND Phường</option>
                <option value="doan_the">Mặt trận & Đoàn thể</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Chức vụ đảm nhiệm (*):
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="VD: Chủ tịch UBND Phường..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Lĩnh vực phụ trách / Phân công nhiệm vụ:
            </label>
            <textarea
              rows={3}
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Ghi rõ lĩnh vực chỉ đạo điều hành, các phòng ban phụ trách..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Điện thoại công vụ:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(028) 3771 xxxx"
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
                placeholder="canbo.tanmy@tphcm.gov.vn"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
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
              <span>{initialData ? 'Lưu thay đổi' : 'Thêm cán bộ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
