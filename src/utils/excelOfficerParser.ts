import { Officer } from '../types';

export const DEFAULT_OFFICERS: Officer[] = [
  {
    id: 'off-01',
    code: 'CB-ADMIN-01',
    name: 'Nguyễn Văn An',
    role: 'Trưởng Bộ phận Một cửa (Quản trị viên)',
    assignedCategory: 'Tất cả',
    email: 'an.nguyen@tanmy.gov.vn',
    phone: '0908.123.456',
    isActive: true
  },
  {
    id: 'off-02',
    code: 'CB-HOTICH-02',
    name: 'Trần Thị Mai',
    role: 'Công chức Tư pháp - Hộ tịch',
    assignedCategory: 'Hộ tịch',
    email: 'mai.tran@tanmy.gov.vn',
    phone: '0903.234.567',
    isActive: true
  },
  {
    id: 'off-03',
    code: 'CB-DATDAI-03',
    name: 'Lê Hoàng Nam',
    role: 'Công chức Địa chính - Đất đai & Xây dựng',
    assignedCategory: 'Đất đai - Xây dựng',
    email: 'nam.le@tanmy.gov.vn',
    phone: '0912.345.678',
    isActive: true
  },
  {
    id: 'off-04',
    code: 'CB-CHUNGTHUC-04',
    name: 'Phạm Minh Tuấn',
    role: 'Chuyên viên Tiếp nhận Chứng thực',
    assignedCategory: 'Chứng thực',
    email: 'tuan.pham@tanmy.gov.vn',
    phone: '0988.456.789',
    isActive: true
  },
  {
    id: 'off-05',
    code: 'CB-CUTRU-05',
    name: 'Vũ Thị Hoa',
    role: 'Cán bộ Quản lý Cư trú & VNeID',
    assignedCategory: 'Cư trú',
    email: 'hoa.vu@tanmy.gov.vn',
    phone: '0977.567.890',
    isActive: true
  }
];

export const OFFICERS_STORAGE_KEY = 'tan_my_ward_officers_v1';

export function getStoredOfficers(): Officer[] {
  try {
    const raw = localStorage.getItem(OFFICERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(OFFICERS_STORAGE_KEY, JSON.stringify(DEFAULT_OFFICERS));
      return DEFAULT_OFFICERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_OFFICERS;
  } catch (e) {
    return DEFAULT_OFFICERS;
  }
}

export function saveStoredOfficers(officers: Officer[]): void {
  try {
    localStorage.setItem(OFFICERS_STORAGE_KEY, JSON.stringify(officers));
  } catch (e) {
    console.error('Failed to save officers to localStorage', e);
  }
}

/**
 * Generate a downloadable Excel / CSV template for officer permissions
 */
export function generateOfficerExcelTemplate(): void {
  const headers = ['Mã cán bộ', 'Họ và tên', 'Chức vụ', 'Lĩnh vực phụ trách', 'Email', 'Số điện thoại'];
  const sampleRows = [
    ['CB-HT-01', 'Trần Thị Mai', 'Công chức Tư pháp - Hộ tịch', 'Hộ tịch', 'mai.tran@tanmy.gov.vn', '0903123456'],
    ['CB-DD-02', 'Lê Hoàng Nam', 'Công chức Địa chính - Đất đai', 'Đất đai - Xây dựng', 'nam.le@tanmy.gov.vn', '0912345678'],
    ['CB-CT-03', 'Phạm Minh Tuấn', 'Chuyên viên Chứng thực', 'Chứng thực', 'tuan.pham@tanmy.gov.vn', '0988456789'],
    ['CB-CR-04', 'Vũ Thị Hoa', 'Cán bộ Quản lý Cư trú & VNeID', 'Cư trú', 'hoa.vu@tanmy.gov.vn', '0977567890'],
    ['CB-ALL-00', 'Nguyễn Văn An', 'Trưởng Một cửa', 'Tất cả', 'an.nguyen@tanmy.gov.vn', '0908123456']
  ];

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...sampleRows.map(r => r.map(cell => `"${cell}"`).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Mau_Phan_Quyen_Can_Bo_Phuong_Tan_My.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parse an uploaded CSV / Excel export file
 */
export function parseOfficerCsv(csvText: string): Officer[] {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parsedOfficers: Officer[] = [];

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma taking into account quoted cells
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (matches.length >= 6) break;
    }

    if (matches.length >= 4 && matches[1]) {
      const code = matches[0] || `CB-${Date.now()}-${i}`;
      const name = matches[1];
      const role = matches[2] || 'Chuyên viên phụ trách';
      let rawCategory = matches[3] || 'Tất cả';

      // Normalize category
      let category: Officer['assignedCategory'] = 'Tất cả';
      if (rawCategory.includes('Hộ tịch')) category = 'Hộ tịch';
      else if (rawCategory.includes('Đất')) category = 'Đất đai - Xây dựng';
      else if (rawCategory.includes('Cư trú')) category = 'Cư trú';
      else if (rawCategory.includes('Chứng thực')) category = 'Chứng thực';
      else if (rawCategory.includes('Bảo trợ')) category = 'Bảo trợ xã hội';

      parsedOfficers.push({
        id: `off-${Date.now()}-${i}`,
        code,
        name,
        role,
        assignedCategory: category,
        email: matches[4] || `${code.toLowerCase()}@tanmy.gov.vn`,
        phone: matches[5] || '',
        isActive: true
      });
    }
  }

  return parsedOfficers;
}
