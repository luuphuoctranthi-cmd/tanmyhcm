import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  Users,
  Award,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles
} from 'lucide-react';

import { PartyGovLeader } from '../../types';
import { DEFAULT_PARTY_GOV_LEADERS } from '../../data/portalData';

interface PartyGovSectionProps {
  leaders?: PartyGovLeader[];
}

export const PartyGovSection: React.FC<PartyGovSectionProps> = ({
  leaders = DEFAULT_PARTY_GOV_LEADERS
}) => {
  const [activeTab, setActiveTab] = useState<'dang_uy' | 'hdnd_ubnd' | 'doan_the' | 'chi_dao'>('dang_uy');

  // Dynamic party leaders from props or fallback
  const partyLeaders = leaders.filter(l => l.group === 'dang_uy').length > 0
    ? leaders.filter(l => l.group === 'dang_uy')
    : [
        {
          id: 'pg-1',
          role: 'Bí thư Đảng ủy Phường',
          name: 'Đồng chí Trần Quốc Tuấn',
          responsibilities: 'Phụ trách toàn diện công tác xây dựng Đảng, chính trị tư tưởng, tổ chức cán bộ và quốc phòng an ninh.',
          phone: '(028) 3771 8891'
        },
        {
          id: 'pg-2',
          role: 'Phó Bí thư Thường trực Đảng ủy - Chủ tịch HĐND Phường',
          name: 'Đồng chí Lê Thị Kim Oanh',
          responsibilities: 'Chủ trì công tác văn phòng cấp ủy, kiểm tra giám sát, dân vận, quy chế dân chủ cơ sở và hoạt động của HĐND.',
          phone: '(028) 3771 8892'
        },
        {
          id: 'pg-3',
          role: 'Phó Bí thư Đảng ủy - Chủ tịch UBND Phường',
          name: 'Đồng chí Nguyễn Văn An',
          responsibilities: 'Lãnh đạo, chỉ đạo điều hành toàn diện hoạt động của UBND Phường; phụ trách trực tiếp cải cách hành chính, an ninh quốc phòng.',
          phone: '(028) 3771 8893'
        }
      ];

  const govLeaders = leaders.filter(l => l.group === 'hdnd_ubnd').length > 0
    ? leaders.filter(l => l.group === 'hdnd_ubnd').map(l => ({
        role: l.role,
        name: l.name,
        field: l.responsibilities
      }))
    : [
        {
          role: 'Chủ tịch UBND Phường Tân Mỹ',
          name: 'Đồng chí Nguyễn Văn An',
          field: 'Chỉ đạo điều hành chung, quy hoạch phát triển kinh tế - xã hội, tổ chức bộ máy, ngân sách và quốc phòng - an ninh.'
        },
        {
          role: 'Phó Chủ tịch UBND (Phụ trách Văn hóa - Xã hội)',
          name: 'Đồng chí Trần Thị Mai',
          field: 'Trực tiếp chỉ đạo Bộ phận Một cửa, Cải cách hành chính, Giáo dục, Y tế, LĐ-TB&XH, Chuyển đổi số và an sinh nhân dân.'
        },
        {
          role: 'Phó Chủ tịch UBND (Phụ trách Đô thị - Địa chính)',
          name: 'Đồng chí Lê Hoàng Quân',
          field: 'Trực tiếp chỉ đạo công tác quản lý đất đai, trật tự xây dựng, tài nguyên môi trường, PCCC và trật tự an toàn giao thông.'
        }
      ];

  const massOrganizations = [
    {
      name: 'Ủy ban Mặt trận Tổ quốc Việt Nam Phường',
      leader: 'Chủ tịch UBMTTQVN Phường',
      description: 'Xây dựng khối đại đoàn kết toàn dân tộc, giám sát và phản biện xã hội, vận động Quỹ "Vì người nghèo".',
      badge: 'Khối Đại đoàn kết'
    },
    {
      name: 'Đoàn TNCS Hồ Chí Minh Phường Tân Mỹ',
      leader: 'Bí thư Đoàn Phường',
      description: 'Xung kích chuyển đổi số, tổ chức "Thứ Bảy tình nguyện" hỗ trợ người dân nộp dịch vụ công trực tuyến và cài đặt VNeID.',
      badge: 'Thanh niên xung kích'
    },
    {
      name: 'Hội Liên hiệp Phụ nữ Phường',
      leader: 'Chủ tịch Hội Phụ nữ',
      description: 'Phong trào "Xây dựng gia đình 5 không, 3 sạch", hỗ trợ phụ nữ khởi nghiệp, vay vốn ngân hàng chính sách.',
      badge: 'Vì sự tiến bộ phụ nữ'
    },
    {
      name: 'Hội Cựu chiến binh Phường',
      leader: 'Chủ tịch Hội Cựu chiến binh',
      description: 'Phát huy phẩm chất "Bộ đội Cụ Hồ", gương mẫu giữ gìn an ninh trật tự tại các khu dân cư.',
      badge: 'Gương mẫu kỷ cương'
    },
    {
      name: 'Hội Chữ thập đỏ & Hội Khuyến học',
      leader: 'Chủ tịch Hội',
      description: 'Công tác từ thiện nhân đạo, hiến máu tình nguyện, trao học bổng cho học sinh nghèo vượt khó.',
      badge: 'Nhân ái sẻ chia'
    }
  ];

  const directives = [
    {
      code: 'Nghị quyết số 12-NQ/ĐU',
      title: 'Nghị quyết của Đảng ủy phường về nâng cao chỉ số phục vụ nhân dân và số hóa 100% hồ sơ TTHC năm 2026',
      date: '10/10/2026',
      type: 'Nghị quyết Đảng ủy'
    },
    {
      code: 'Kế hoạch số 89/KH-UBND',
      title: 'Kế hoạch triển khai Kiosk thông minh và Trợ lý số tiếng Việt tại bộ phận Một cửa UBND Phường Tân Mỹ',
      date: '14/10/2026',
      type: 'Kế hoạch UBND'
    },
    {
      code: 'Thông báo số 215/TB-UBND',
      title: 'Thông báo về việc tăng cường kiểm tra xử lý vi phạm trật tự lòng lề đường và an toàn PCCC quý IV/2026',
      date: '16/10/2026',
      type: 'Thông báo chỉ đạo'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" /> HỆ THỐNG CHÍNH TRỊ CƠ SỞ
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              UBND Phường Tân Mỹ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Đảng ủy — HĐND — UBND & Các Đoàn thể Phường
          </h2>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('dang_uy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'dang_uy'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Đảng ủy Phường Tân Mỹ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hdnd_ubnd')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'hdnd_ubnd'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          HĐND & UBND Phường
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doan_the')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'doan_the'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Mặt trận & Các Đoàn thể
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chi_dao')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'chi_dao'
              ? 'bg-indigo-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Văn bản chỉ đạo điều hành
        </button>
      </div>

      {/* TAB 1: ĐẢNG BỘ PHƯỜNG */}
      {activeTab === 'dang_uy' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-700 to-rose-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              BAN CHẤP HÀNH ĐẢNG BỘ PHƯỜNG TÂN MỸ
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Đoàn kết — Dân chủ — Kỷ cương — Sáng tạo — Phát triển
            </h3>
            <p className="text-xs sm:text-sm text-red-100 max-w-2xl leading-relaxed">
              Lãnh đạo toàn diện các mặt công tác chính trị, kinh tế, văn hóa - xã hội, quốc phòng - an ninh trên địa bàn; xây dựng Đảng bộ và hệ thống chính trị trong sạch, vững mạnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partyLeaders.map((p, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black text-sm">
                  ★
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-red-700 block">
                    {p.role}
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    {p.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.responsibilities}
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
                  Điện thoại: {p.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HĐND & UBND PHƯỜNG */}
      {activeTab === 'hdnd_ubnd' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              ỦY BAN NHÂN DÂN PHƯỜNG TÂN MỸ
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Chính quyền thân thiện — Phục vụ nhân dân — Hiệu quả, minh bạch
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Cơ quan chấp hành của HĐND phường, cơ quan hành chính nhà nước ở địa phương, chịu trách nhiệm trước nhân dân và cơ quan nhà nước cấp trên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {govLeaders.map((g, i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                  {i + 1}
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-blue-800 block">
                    {g.role}
                  </span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">
                    {g.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {g.field}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ĐOÀN THỂ */}
      {activeTab === 'doan_the' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {massOrganizations.map((m, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {m.badge}
                </span>
                <span className="text-xs text-slate-500 font-bold">{m.leader}</span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                {m.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CHỈ ĐẠO ĐIỀU HÀNH */}
      {activeTab === 'chi_dao' && (
        <div className="space-y-3">
          {directives.map((d, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200">
                    {d.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">{d.code}</span>
                  <span className="text-xs text-slate-400">• Ngày ban hành: {d.date}</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  {d.title}
                </h4>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Xem văn bản</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
