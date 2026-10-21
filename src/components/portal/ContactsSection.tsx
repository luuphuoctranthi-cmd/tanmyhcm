import React, { useState } from 'react';
import { DEFAULT_CONTACTS } from '../../data/portalData';
import { AdministrativeContact } from '../../types';
import {
  PhoneCall,
  MapPin,
  Clock,
  Mail,
  ShieldAlert,
  Search,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Users
} from 'lucide-react';

interface ContactsSectionProps {
  contacts?: AdministrativeContact[];
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({
  contacts = DEFAULT_CONTACTS
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const emergencyNumbers = [
    { name: 'Công an khẩn cấp', number: '113', sub: 'Trực ban 24/24', color: 'from-red-600 to-rose-700' },
    { name: 'Cứu hỏa & Cứu nạn', number: '114', sub: 'PCCC phường Tân Mỹ', color: 'from-orange-600 to-amber-700' },
    { name: 'Cấp cứu Y tế', number: '115', sub: 'Trạm cấp cứu lưu động', color: 'from-emerald-600 to-teal-700' },
    { name: 'Đường dây nóng Phường', number: '1900 88 66 99', sub: 'Tiếp nhận phản ánh Một cửa', color: 'from-blue-700 to-indigo-900' }
  ];

  const neighborhoodLeaders = [
    { name: 'Ông Nguyễn Văn Hùng', role: 'Trưởng Khu phố 1', phone: '0903 112 345', address: 'Văn phòng KP1, Đường Số 1' },
    { name: 'Bà Lê Thị Thu', role: 'Trưởng Khu phố 2', phone: '0908 223 456', address: 'Văn phòng KP2, Đường Số 3' },
    { name: 'Ông Trần Văn Nam', role: 'Trưởng Khu phố 3', phone: '0913 334 567', address: 'Văn phòng KP3, Đường Số 5' },
    { name: 'Bà Phạm Mai Lan', role: 'Trưởng Khu phố 4', phone: '0989 445 678', address: 'Văn phòng KP4, Đường Số 7' },
    { name: 'Ông Hoàng Đình Trọng', role: 'Trưởng Khu phố 5', phone: '0978 556 789', address: 'Văn phòng KP5, Đường Số 9' }
  ];

  const categories = ['Tất cả', 'Thường trực Lãnh đạo', 'Một cửa', 'Công an - Quân sự', 'Đoàn thể'];

  const filteredContacts = contacts.filter(c => {
    const matchesCat = selectedCategory === 'Tất cả' || c.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      c.unitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.personInCharge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" /> DANH BẠ HÀNH CHÍNH & KHẨN CẤP
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              UBND Phường Tân Mỹ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Đường dây nóng & Danh bạ liên hệ các đơn vị trên địa bàn
          </h2>
        </div>
      </div>

      {/* 4 Emergency Hotline Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {emergencyNumbers.map((em, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${em.color} text-white p-5 rounded-3xl shadow-md space-y-2 flex flex-col justify-between`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block">
                {em.name}
              </span>
              <a
                href={`tel:${em.number.replace(/\s+/g, '')}`}
                className="text-2xl sm:text-3xl font-black font-mono tracking-tight block hover:underline mt-1"
              >
                {em.number}
              </a>
            </div>
            <span className="text-[11px] text-white/90 font-medium">
              {em.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm đơn vị, tên cán bộ phụ trách hoặc số điện thoại..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm font-medium"
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

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                {contact.category}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(contact.phone, contact.id)}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedId === contact.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Đã copy số!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {contact.unitName}
              </h3>
              <p className="text-xs text-blue-900 font-bold mt-0.5">
                {contact.role} — {contact.personInCharge}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{contact.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="font-mono text-slate-700">{contact.email}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Số điện thoại:</span>
                <span className="text-base font-black text-slate-900 font-mono tracking-tight">
                  {contact.phone}
                </span>
              </div>

              <a
                href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Gọi ngay</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Neighborhood Leader Directory (Trưởng khu phố) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Danh bạ Ban điều hành các Khu phố trên địa bàn Phường Tân Mỹ
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">5 Khu phố</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {neighborhoodLeaders.map((kp, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-black uppercase text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded">
                  {kp.role}
                </span>
                <h4 className="font-black text-slate-900 text-sm mt-1">{kp.name}</h4>
                <p className="text-[11px] text-slate-500">{kp.address}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-800">{kp.phone}</span>
                <a
                  href={`tel:${kp.phone.replace(/\s+/g, '')}`}
                  className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-lg border border-slate-200 flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Gọi</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
