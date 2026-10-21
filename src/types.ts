export interface ProcedureStep {
  title: string;
  description: string;
  tips?: string;
}

export interface RequiredDocument {
  name: string;
  note?: string;
  isRequired: boolean;
}

export interface Procedure {
  id: string;
  name: string;
  code?: string;
  category: 'Hộ tịch' | 'Cư trú' | 'Chứng thực' | 'Đất đai - Xây dựng' | 'Bảo trợ xã hội' | 'Khác';
  keywords: string[];
  actionUrl: string;
  videoTutorialUrl?: string; // Link web hoặc YouTube
  videoDataUrl?: string;     // Video file tải trực tiếp lên để xem ngay trên ứng dụng
  videoFileName?: string;
  summary: string;
  counterDepartment: string;
  processingTime: string;
  fee: string;
  steps: ProcedureStep[];
  requiredDocuments: RequiredDocument[];
  customSpeechText?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Officer {
  id: string;
  code: string;
  name: string;
  role: string;
  assignedCategory: 'Tất cả' | 'Hộ tịch' | 'Cư trú' | 'Chứng thực' | 'Đất đai - Xây dựng' | 'Bảo trợ xã hội' | 'Khác';
  email: string;
  phone?: string;
  isActive: boolean;
}

export interface AppStatistics {
  totalVisits: number;
  totalVoiceQueries: number;
  satisfiedVotes: number;
  totalRatings: number;
  averageRating: number;
  likesCount: number;
  procedureViews: Record<string, number>;
}

export type AppViewMode = 'public' | 'admin';

export type FontSizeLevel = 'normal' | 'large' | 'huge';

export type PortalTab =
  | 'home'          // 1. Trang chủ (Trợ lý số & Kiosk Một cửa)
  | 'news'          // 2. Tin tức và Sự kiện
  | 'schedule'      // 3. Lịch công tác & Tiếp công dân
  | 'party_gov'     // 4. Đảng ủy - HĐND - UBND Phường
  | 'procedures'    // 5. Kho Thủ tục hành chính & Biểu mẫu
  | 'transparency'  // 6. Niêm yết và giám sát minh bạch (Thủ tục & Tài chính, ngân sách, đầu tư)
  | 'feedback'      // 7. Góp ý & Phản ánh của nhân dân
  | 'traffic_flood' // 8. Tra cứu Tuyến đường Ngập sâu & Kẹt xe (Thời gian thực)
  | 'contacts';     // 9. Danh bạ & Đường dây nóng liên hệ

export interface TransparencyItem {
  id: string;
  title: string;
  documentCode?: string;
  category: 'Thủ tục hành chính' | 'Tài chính - Ngân sách' | 'Đầu tư công - Dự án' | 'Quỹ vận động nhân dân';
  issueDate: string;
  issuingAuthority: string;
  summary: string;
  details?: string;
  amountOrBudget?: string; // Số tiền hoặc quy mô ngân sách
  status: 'Đang niêm yết' | 'Đã nghiệm thu' | 'Công khai định kỳ';
  fileFormat?: 'PDF' | 'DOCX' | 'XLSX';
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Hoạt động Phường' | 'Chuyển đổi số' | 'An ninh trật tự' | 'Chính sách mới' | 'Mặt trận - Đoàn thể';
  imageUrl: string;
  sourceUrl?: string; // Link Facebook hoặc báo điện tử
  publishedAt: string;
  author: string;
  viewsCount: number;
  isFeatured?: boolean;
}

export interface WorkScheduleItem {
  id: string;
  leaderName: string;
  leaderRole: string;
  dateStr: string;
  timeStr: string;
  location: string;
  type: 'Tiếp công dân' | 'Chỉ đạo điều hành' | 'Họp giao ban' | 'Kiểm tra địa bàn';
  content: string;
  isImportant?: boolean;
}

export interface CitizenFeedback {
  id: string;
  senderName: string;
  phone: string;
  neighborhood: string;
  category: 'Thủ tục hành chính' | 'Trật tự đô thị' | 'Vệ sinh môi trường' | 'An ninh trật tự' | 'Góp ý khác';
  content: string;
  createdAt: string;
  status: 'Đã tiếp nhận' | 'Đang xử lý' | 'Đã giải quyết';
  officialResponse?: string;
  officerInCharge?: string;
}

export interface AdministrativeContact {
  id: string;
  unitName: string;
  personInCharge: string;
  role: string;
  phone: string;
  hotline?: string;
  email: string;
  address: string;
  workingHours: string;
  category: 'Thường trực Lãnh đạo' | 'Một cửa' | 'Công an - Quân sự' | 'Đoàn thể' | 'Khu phố';
}

export interface FormTemplateDocument {
  id: string;
  title: string;
  code: string;
  category: string;
  description: string;
  fileFormat: 'DOCX' | 'PDF';
  downloadUrl?: string;
  serviceActionUrl?: string;
}

export type FloodLevel = 'none' | 'low' | 'medium' | 'deep'; // 'none': Nước rút / Khô ráo, 'low': Ngập nhẹ (<20cm), 'medium': Ngập vừa (20-40cm), 'deep': Ngập sâu (>40cm, cảnh báo chết máy)
export type TrafficLevel = 'clear' | 'slow' | 'jammed'; // 'clear': Thông thoáng, 'slow': Di chuyển chậm, 'jammed': Kẹt xe nghiêm trọng

export interface StatusUpdateLog {
  id: string;
  timestamp: string;
  updatedBy: string; // e.g. "Người dân địa phương", "Cán bộ Đô thị", "Công dân KP2"
  floodLevel: FloodLevel;
  trafficLevel: TrafficLevel;
  note: string;
}

export interface TrafficFloodReport {
  id: string;
  streetName: string; // Tuyến đường
  sectionDescription: string; // Đoạn từ đâu đến đâu
  neighborhood?: string; // Khu phố (Khu phố 1..5)
  floodLevel: FloodLevel;
  trafficLevel: TrafficLevel;
  waterDepthCm?: number; // Mực nước ước tính (cm)
  reportedAt: string; // Thời gian báo
  lastUpdatedAt: string; // Cập nhật lần cuối
  reporterName: string; // Tên người báo
  reporterPhone?: string;
  description: string; // Mô tả hiện trường
  recommendedAlternative?: string; // Lộ trình tránh ngập khuyên dùng
  confirmedCount: number; // Lượt người dân xác nhận đúng
  resolvedCount: number; // Lượt người dân báo nước đã rút / thông thoáng
  isOfficialAlert?: boolean; // Cảnh báo chính thức từ UBND phường
  imageUrl?: string;
  historyLogs: StatusUpdateLog[];
}

export interface PartyGovLeader {
  id: string;
  group: 'dang_uy' | 'hdnd_ubnd' | 'doan_the';
  role: string;
  name: string;
  responsibilities: string;
  phone?: string;
  email?: string;
}
