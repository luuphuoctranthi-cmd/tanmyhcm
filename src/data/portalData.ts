import {
  NewsArticle,
  WorkScheduleItem,
  CitizenFeedback,
  AdministrativeContact,
  FormTemplateDocument,
  TrafficFloodReport,
  PartyGovLeader,
  TransparencyItem
} from '../types';

export const DEFAULT_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'UBND Phường Tân Mỹ chính thức triển khai "Trợ lý số thông minh" hướng dẫn thủ tục hành chính bằng giọng nói',
    summary: 'Ứng dụng chuyển đổi số vượt trội giúp người dân, đặc biệt là người cao tuổi, dễ dàng tra cứu hồ sơ và tiếp cận dịch vụ công trực tuyến một cách thân thiện.',
    content: `Nhằm đẩy mạnh công tác cải cách hành chính và nâng cao chỉ số phục vụ nhân dân, sáng nay UBND Phường Tân Mỹ đã chính thức đưa vào vận hành hệ sinh thái "Trợ lý số thông minh".
Hệ thống tích hợp công nghệ nhận diện giọng nói tiếng Việt chuẩn xác, hỗ trợ người dân tự động tra cứu danh mục giấy tờ cần chuẩn bị, hướng dẫn 2 cách đăng nhập VNeID và cung cấp đường link nộp hồ sơ trực tuyến ngay tại quầy tiếp nhận một cửa.`,
    category: 'Chuyển đổi số',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://facebook.com/ubndphuongtanmy',
    publishedAt: '20/10/2026',
    author: 'Tổ Chuyển đổi số Phường',
    viewsCount: 1420,
    isFeatured: true
  },
  {
    id: 'news-2',
    title: 'Công an Phường Tân Mỹ tổ chức cấp tài khoản định danh điện tử VNeID mức 2 lưu động tại các khu phố',
    summary: 'Đoàn công tác trực tiếp đến từng tổ dân phố để hướng dẫn và kích hoạt VNeID mức 2 cho bà con nhân dân, kết hợp hỗ trợ tích hợp giấy tờ.',
    content: `Thực hiện Đề án 06 của Chính phủ, Công an Phường Tân Mỹ phối hợp cùng Đoàn Thanh niên tổ chức các điểm cấp và kích hoạt VNeID lưu động vào các buổi tối trong tuần tại các nhà văn hóa khu phố. Người dân chỉ cần mang theo Căn cước công dân gắn chip để được xử lý nhanh chóng trong vòng 5 phút.`,
    category: 'An ninh trật tự',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    sourceUrl: 'https://facebook.com/conganphuongtanmy',
    publishedAt: '18/10/2026',
    author: 'Công an Phường Tân Mỹ',
    viewsCount: 980,
    isFeatured: true
  },
  {
    id: 'news-3',
    title: 'Chi trả chế độ an sinh xã hội, người có công tháng qua tài khoản an sinh số',
    summary: 'Thực hiện chi trả kịp thời, chính xác cho 100% đối tượng thụ hưởng chính sách an sinh xã hội trên địa bàn phường Tân Mỹ qua tài khoản ngân hàng.',
    content: `Bộ phận Lao động - Thương binh và Xã hội UBND Phường Tân Mỹ thông báo đã hoàn tất việc chuyển tiền trợ cấp hàng tháng cho các gia đình người có công, bảo trợ xã hội và hộ cận nghèo qua tài khoản an sinh xã hội. Đối với người cao tuổi neo đơn, cán bộ bưu điện phối hợp công chức phường mang trợ cấp đến tận nhà trao tận tay.`,
    category: 'Chính sách mới',
    imageUrl: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=800&q=80',
    publishedAt: '15/10/2026',
    author: 'Bộ phận LĐ-TB&XH',
    viewsCount: 750,
    isFeatured: false
  },
  {
    id: 'news-4',
    title: 'Phường Tân Mỹ ra quân tổng vệ sinh môi trường, lập lại trật tự lòng lề đường',
    summary: 'Tập trung xử lý nghiêm các trường hợp lấn chiếm vỉa hè kinh doanh trái phép, xả rác bừa bãi và kiểm tra an toàn PCCC nhà ở kết hợp kinh doanh.',
    content: `Đội Quản lý Trật tự Đô thị phối hợp lực lượng Bảo vệ an ninh trật tự cơ sở đã đồng loạt ra quân kiểm tra các tuyến đường trọng điểm trên địa bàn phường. Đợt ra quân nhận được sự đồng thuận cao của người dân, trả lại không gian thông thoáng cho người đi bộ.`,
    category: 'Hoạt động Phường',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    publishedAt: '12/10/2026',
    author: 'Đội Trật tự Đô thị',
    viewsCount: 620,
    isFeatured: false
  }
];

export const DEFAULT_SCHEDULE: WorkScheduleItem[] = [
  {
    id: 'sch-1',
    leaderName: 'Đồng chí Nguyễn Văn An',
    leaderRole: 'Chủ tịch UBND Phường',
    dateStr: 'Thứ Năm, 22/10/2026',
    timeStr: '08:00 - 11:30',
    location: 'Phòng Tiếp công dân (Trụ sở UBND Phường)',
    type: 'Tiếp công dân',
    content: 'Chủ tịch UBND Phường trực tiếp chủ trì phiên tiếp công dân định kỳ tuần 43. Lắng nghe, xử lý phản ánh, khiếu nại của người dân trên địa bàn.',
    isImportant: true
  },
  {
    id: 'sch-2',
    leaderName: 'Đồng chí Trần Thị Mai',
    leaderRole: 'Phó Chủ tịch UBND (Văn xã)',
    dateStr: 'Thứ Năm, 22/10/2026',
    timeStr: '14:00 - 16:30',
    location: 'Bộ phận Một cửa UBND Phường',
    type: 'Kiểm tra địa bàn',
    content: 'Kiểm tra quy trình tiếp nhận hồ sơ TTHC, giám sát hoạt động Trợ lý số bằng giọng nói và kiểm tra tiến độ trả kết quả cấp bản sao hộ tịch.',
    isImportant: false
  },
  {
    id: 'sch-3',
    leaderName: 'Đồng chí Lê Hoàng Quân',
    leaderRole: 'Phó Chủ tịch UBND (Đô thị)',
    dateStr: 'Thứ Sáu, 23/10/2026',
    timeStr: '08:30 - 11:00',
    location: 'Hội trường Tầng 2 - Trụ sở UBND',
    type: 'Họp giao ban',
    content: 'Họp giao ban chuyên đề quản lý đất đai, trật tự xây dựng và công tác phòng cháy chữa cháy 9 tháng đầu năm với các Trưởng khu phố.',
    isImportant: true
  },
  {
    id: 'sch-4',
    leaderName: 'Thường trực Đảng ủy - HĐND - UBND',
    leaderRole: 'Ban Thường vụ Đảng ủy',
    dateStr: 'Thứ Hai, 26/10/2026',
    timeStr: '07:30 - 09:00',
    location: 'Sân cờ & Phòng họp Đảng ủy',
    type: 'Chỉ đạo điều hành',
    content: 'Lễ Chào cờ đầu tuần và Họp giao ban Thường trực Đảng ủy - HĐND - UBND đánh giá công tác tuần, triển khai nhiệm vụ trọng tâm tuần mới.',
    isImportant: true
  }
];

export const DEFAULT_FORM_TEMPLATES: FormTemplateDocument[] = [
  {
    id: 'form-1',
    title: 'Tờ khai đăng ký khai sinh',
    code: 'Mẫu TP/HT-2020-TKKS',
    category: 'Hộ tịch',
    description: 'Ban hành kèm theo Thông tư 04/2020/TT-BTP của Bộ Tư pháp. Dùng để đăng ký khai sinh cho trẻ mới sinh dưới 14 tuổi.',
    fileFormat: 'DOCX',
    serviceActionUrl: 'https://dichvucong.gov.vn'
  },
  {
    id: 'form-2',
    title: 'Tờ khai đăng ký kết hôn',
    code: 'Mẫu TP/HT-2020-TKKH',
    category: 'Hộ tịch',
    description: 'Dành cho hai bên nam nữ có đủ điều kiện kết hôn theo quy định của Luật Hôn nhân và gia đình làm thủ tục đăng ký kết hôn.',
    fileFormat: 'DOCX',
    serviceActionUrl: 'https://dichvucong.gov.vn'
  },
  {
    id: 'form-3',
    title: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân',
    code: 'Mẫu TP/HT-2020-TKXNTTHN',
    category: 'Hộ tịch',
    description: 'Dùng để xác nhận tình trạng độc thân phục vụ mục đích kết hôn, vay vốn ngân hàng, chuyển nhượng quyền sử dụng đất.',
    fileFormat: 'DOCX',
    serviceActionUrl: 'https://dichvucong.gov.vn'
  },
  {
    id: 'form-4',
    title: 'Tờ khai thay đổi thông tin cư trú (CT01)',
    code: 'Mẫu CT01 - BCA',
    category: 'Cư trú',
    description: 'Ban hành kèm theo Thông tư 56/2021/TT-BCA của Bộ Công an. Dùng để đăng ký thường trú, tạm trú, khai báo tạm vắng, xóa đăng ký cư trú.',
    fileFormat: 'PDF',
    serviceActionUrl: 'https://dichvucong.gov.vn'
  },
  {
    id: 'form-5',
    title: 'Tờ khai đăng ký khai tử',
    code: 'Mẫu TP/HT-2020-TKKT',
    category: 'Hộ tịch',
    description: 'Dùng làm thủ tục đăng ký khai tử khi có người thân qua đời, căn cứ Giấy báo tử của cơ sở y tế hoặc chính quyền.',
    fileFormat: 'DOCX',
    serviceActionUrl: 'https://dichvucong.gov.vn'
  },
  {
    id: 'form-6',
    title: 'Giấy đề nghị cấp bản sao Trích lục hộ tịch',
    code: 'Mẫu TP/HT-2020-TLHT',
    category: 'Chứng thực',
    description: 'Dùng xin cấp trích lục bản sao giấy khai sinh, kết hôn, khai tử từ sổ hộ tịch lưu trữ tại UBND phường.',
    fileFormat: 'DOCX',
    serviceActionUrl: 'https://dichvucong.gov.vn'
  }
];

export const DEFAULT_FEEDBACKS: CitizenFeedback[] = [
  {
    id: 'fb-1',
    senderName: 'Bác Lê Văn Dũng',
    phone: '0903 *** 124',
    neighborhood: 'Khu phố 2, Phường Tân Mỹ',
    category: 'Thủ tục hành chính',
    content: 'Tôi 68 tuổi, vừa rồi đến bộ phận Một cửa làm thủ tục trích lục khai sinh được các cháu cán bộ hướng dẫn dùng Trợ lý số bằng giọng nói rất thuận tiện, không cần phải bấm kính đọc chữ nhỏ. Xin cảm ơn UBND phường.',
    createdAt: '19/10/2026',
    status: 'Đã giải quyết',
    officialResponse: 'UBND Phường Tân Mỹ trân trọng cảm ơn ý kiến đóng góp quý báu của Bác. Phường sẽ tiếp tục nâng cao chất lượng phục vụ nhân dân ngày càng tốt hơn.',
    officerInCharge: 'Bộ phận Tiếp nhận & Trả kết quả'
  },
  {
    id: 'fb-2',
    senderName: 'Chị Nguyễn Hoài Phương',
    phone: '0918 *** 892',
    neighborhood: 'Khu phố 4, Phường Tân Mỹ',
    category: 'Vệ sinh môi trường',
    content: 'Đoạn đường đầu hẻm số 14 có xe chở phế liệu để bao tải rác che khuất tầm nhìn của người tham gia giao thông. Đề nghị phường nhắc nhở.',
    createdAt: '17/10/2026',
    status: 'Đã giải quyết',
    officialResponse: 'Đội Trật tự Đô thị phối hợp Ban điều hành Khu phố 4 đã xuống hiện trường lập biên bản nhắc nhở hộ kinh doanh, yêu cầu dọn dẹp vệ sinh ngay trong ngày.',
    officerInCharge: 'Đội Trật tự Đô thị'
  },
  {
    id: 'fb-3',
    senderName: 'Anh Phạm Minh Tuấn',
    phone: '0977 *** 450',
    neighborhood: 'Khu phố 1, Phường Tân Mỹ',
    category: 'Trật tự đô thị',
    content: 'Xin hỏi lịch làm việc vào sáng thứ Bảy của bộ phận Một cửa có giải quyết chứng thực hợp đồng mua bán nhà đất không?',
    createdAt: '16/10/2026',
    status: 'Đã giải quyết',
    officialResponse: 'Dạ chào Anh Tuấn, sáng thứ Bảy (07:30 - 11:30) bộ phận Một cửa tiếp nhận chứng thực sao y bản chính, chứng thực chữ ký và các thủ tục hộ tịch cấp bách. Thủ tục chứng thực hợp đồng giao dịch đất đai được giải quyết từ thứ Hai đến thứ Sáu để phối hợp công chức Tư pháp và Địa chính kiểm tra hồ sơ.',
    officerInCharge: 'Quầy Tư pháp - Hộ tịch'
  }
];

export const DEFAULT_CONTACTS: AdministrativeContact[] = [
  {
    id: 'contact-1',
    unitName: 'Trụ sở Đảng ủy - HĐND - UBND Phường Tân Mỹ',
    personInCharge: 'Văn phòng HĐND & UBND Phường',
    role: 'Bộ phận Tiếp nhận thông tin & Đường dây nóng',
    phone: '(028) 3771 8899',
    hotline: '1900 88 66 99',
    email: 'ubnd.tanmy@tphcm.gov.vn',
    address: 'Số 01 Đường Tân Mỹ, Phường Tân Mỹ',
    workingHours: 'Thứ 2 - Thứ 6 (07:30 - 11:30 & 13:30 - 17:00); Thứ 7 (07:30 - 11:30)',
    category: 'Thường trực Lãnh đạo'
  },
  {
    id: 'contact-2',
    unitName: 'Bộ phận Một cửa Điện tử (Bộ phận Tiếp nhận & Trả kết quả)',
    personInCharge: 'Đ/c Trần Thị Mai',
    role: 'Phó Chủ tịch UBND phụ trách Một cửa',
    phone: '(028) 3771 8890',
    email: 'motcua.tanmy@tphcm.gov.vn',
    address: 'Sảnh chính Tầng trệt, Trụ sở UBND Phường Tân Mỹ',
    workingHours: 'Sáng 07:30 - 11:30, Chiều 13:30 - 17:00 (Thứ 2 đến sáng Thứ 7)',
    category: 'Một cửa'
  },
  {
    id: 'contact-3',
    unitName: 'Công an Phường Tân Mỹ',
    personInCharge: 'Đ/c Trưởng Công an Phường',
    role: 'Trực ban Hình sự - Đăng ký Cư trú & VNeID',
    phone: '(028) 3771 5113',
    hotline: '113',
    email: 'congan.tanmy@tphcm.gov.vn',
    address: 'Số 05 Đường Tân Mỹ, Phường Tân Mỹ',
    workingHours: 'Trực chiến 24/24 giờ tất cả các ngày trong tuần',
    category: 'Công an - Quân sự'
  },
  {
    id: 'contact-4',
    unitName: 'Ban Chỉ huy Quân sự Phường Tân Mỹ',
    personInCharge: 'Đ/c Chỉ huy trưởng Quân sự',
    role: 'Quản lý Dân quân & Nghĩa vụ quân sự',
    phone: '(028) 3771 2234',
    email: 'quansu.tanmy@tphcm.gov.vn',
    address: 'Số 01 Đường Tân Mỹ (Khu nhà công vụ)',
    workingHours: 'Giờ hành chính & Trực ban phòng chống bão lụt 24/24',
    category: 'Công an - Quân sự'
  },
  {
    id: 'contact-5',
    unitName: 'Trạm Y tế Phường Tân Mỹ',
    personInCharge: 'Bác sĩ Trưởng Trạm',
    role: 'Tiêm chủng mở rộng - Khám chữa bệnh ban đầu',
    phone: '(028) 3771 4456',
    hotline: '115',
    email: 'tramyte.tanmy@tphcm.gov.vn',
    address: 'Số 12 Đường Số 2, Khu Dân cư Tân Mỹ',
    workingHours: '07:30 - 17:00 hàng ngày & Trực cấp cứu ban đầu',
    category: 'Đoàn thể'
  },
  {
    id: 'contact-6',
    unitName: 'Ủy ban Mặt trận Tổ quốc Việt Nam Phường Tân Mỹ',
    personInCharge: 'Đ/c Chủ tịch UBMTTQVN Phường',
    role: 'Khối Đại đoàn kết toàn dân & Giám sát cộng đồng',
    phone: '(028) 3771 6789',
    email: 'mttq.tanmy@tphcm.gov.vn',
    address: 'Tầng 2, Trụ sở UBND Phường Tân Mỹ',
    workingHours: 'Giờ hành chính (Thứ 2 đến Thứ 6)',
    category: 'Đoàn thể'
  }
];

// Helper functions for LocalStorage persistence
const NEWS_STORAGE_KEY = 'tanmy_portal_news_v1';
const SCHEDULE_STORAGE_KEY = 'tanmy_portal_schedule_v1';
const FEEDBACK_STORAGE_KEY = 'tanmy_portal_feedback_v1';

export function getStoredNews(): NewsArticle[] {
  try {
    const raw = localStorage.getItem(NEWS_STORAGE_KEY);
    if (!raw) return DEFAULT_NEWS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_NEWS;
  } catch {
    return DEFAULT_NEWS;
  }
}

export function saveStoredNews(news: NewsArticle[]): void {
  try {
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(news));
  } catch (e) {
    console.error('Failed to save news', e);
  }
}

export function getStoredSchedule(): WorkScheduleItem[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!raw) return DEFAULT_SCHEDULE;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SCHEDULE;
  } catch {
    return DEFAULT_SCHEDULE;
  }
}

export function saveStoredSchedule(schedule: WorkScheduleItem[]): void {
  try {
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedule));
  } catch (e) {
    console.error('Failed to save schedule', e);
  }
}

export function getStoredFeedbacks(): CitizenFeedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return DEFAULT_FEEDBACKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FEEDBACKS;
  } catch {
    return DEFAULT_FEEDBACKS;
  }
}

export function saveStoredFeedbacks(feedbacks: CitizenFeedback[]): void {
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbacks));
  } catch (e) {
    console.error('Failed to save feedbacks', e);
  }
}

export const DEFAULT_TRANSPARENCY_DOCS: import('../types').TransparencyItem[] = [
  {
    id: 'trans-01',
    title: 'Quyết định công bố Danh mục Thủ tục hành chính chuẩn hóa áp dụng tại UBND Phường Tân Mỹ',
    documentCode: 'QĐ-1582/QĐ-UBND',
    category: 'Thủ tục hành chính',
    issueDate: '01/01/2026',
    issuingAuthority: 'UBND Phường Tân Mỹ',
    summary: 'Niêm yết công khai toàn bộ 156 thủ tục hành chính thuộc thẩm quyền giải quyết cấp xã/phường trên các lĩnh vực: Hộ tịch, Cư trú, Chứng thực, Đất đai - Xây dựng, Lao động - Thương binh & Xã hội.',
    details: 'Đầy đủ thời hạn giải quyết, quy trình tiếp nhận một cửa điện tử, thành phần hồ sơ và cam kết không trễ hẹn.',
    status: 'Đang niêm yết',
    fileFormat: 'PDF'
  },
  {
    id: 'trans-02',
    title: 'Bảng niêm yết công khai Mức thu Phí, Lệ phí giải quyết thủ tục hành chính theo Nghị quyết HĐND',
    documentCode: 'TB-89/TB-UBND',
    category: 'Thủ tục hành chính',
    issueDate: '15/01/2026',
    issuingAuthority: 'Hội đồng nhân dân & UBND Phường',
    summary: 'Công khai mức thu phí chứng thực sao y bản chính, đăng ký kết hôn, chứng thực chữ ký, cấp bản sao trích lục hộ tịch và các trường hợp được miễn phí hoàn toàn.',
    details: 'Quy định rõ các đối tượng chính sách, người có công, hộ nghèo và trẻ em dưới 6 tuổi được miễn 100% lệ phí theo luật định.',
    status: 'Đang niêm yết',
    fileFormat: 'PDF'
  },
  {
    id: 'trans-03',
    title: 'Công khai Dự toán thu — chi Ngân sách Nhà nước năm 2026 của UBND Phường Tân Mỹ',
    documentCode: 'BC-24/BC-UBND',
    category: 'Tài chính - Ngân sách',
    issueDate: '20/01/2026',
    issuingAuthority: 'Ban Kinh tế - Ngân sách HĐND & UBND Phường',
    summary: 'Công khai dự toán thu ngân sách địa phương và phương án phân bổ ngân sách chi thường xuyên, đầu tư phát triển và an sinh xã hội năm 2026.',
    amountOrBudget: '18 tỷ 450 triệu VNĐ',
    details: 'Bao gồm chi cho giáo dục, y tế cơ sở, an ninh quốc phòng, cải cách hành chính và chuyển đổi số.',
    status: 'Công khai định kỳ',
    fileFormat: 'XLSX'
  },
  {
    id: 'trans-04',
    title: 'Báo cáo Quyết toán thu — chi ngân sách phường và các nguồn quỹ công khai năm trước',
    documentCode: 'QT-08/BC-UBND',
    category: 'Tài chính - Ngân sách',
    issueDate: '10/03/2026',
    issuingAuthority: 'UBND Phường Tân Mỹ',
    summary: 'Quyết toán chi tiết các khoản chi hành chính, quản lý trật tự đô thị, phòng chống thiên tai và chế độ cho cán bộ không chuyên trách khu phố.',
    amountOrBudget: '16 tỷ 820 triệu VNĐ',
    details: 'Số liệu được Kiểm toán Nhà nước và Phòng Tài chính - Kế hoạch quận kiểm tra, phê duyệt đạt chuẩn 100%.',
    status: 'Đã nghiệm thu',
    fileFormat: 'PDF'
  },
  {
    id: 'trans-05',
    title: 'Công khai Dự án nâng cấp, mở rộng và thảm nhựa tuyến hẻm 14 & hệ thống cống thoát nước Khu phố 3',
    documentCode: 'DA-03/QĐ-UBND',
    category: 'Đầu tư công - Dự án',
    issueDate: '15/04/2026',
    issuingAuthority: 'Ban Quản lý Dự án Đầu tư Phường Tân Mỹ',
    summary: 'Dự án cải tạo đường giao thông dân sinh, lắp đặt cống hộp chống ngập và hệ thống đèn chiếu sáng năng lượng mặt trời.',
    amountOrBudget: '2 tỷ 850 triệu VNĐ',
    details: 'Nhà thầu thi công: Công ty Xây dựng Đô thị số 7. Thời gian thi công: 90 ngày. Có Ban Giám sát đầu tư của cộng đồng Khu phố 3 theo dõi.',
    status: 'Đang niêm yết',
    fileFormat: 'PDF'
  },
  {
    id: 'trans-06',
    title: 'Công khai Dự án cải tạo Nhà văn hóa và khu vui chơi sinh hoạt thiếu nhi Khu phố 5',
    documentCode: 'DA-05/QĐ-UBND',
    category: 'Đầu tư công - Dự án',
    issueDate: '01/06/2026',
    issuingAuthority: 'UBND Phường Tân Mỹ',
    summary: 'Xây mới phòng sinh hoạt cộng đồng, lắp đặt dụng cụ thể dục ngoài trời và trang bị tủ sách điện tử cho nhân dân khu phố.',
    amountOrBudget: '1 tỷ 200 triệu VNĐ',
    details: 'Công trình hoàn thành chào mừng ngày Quốc khánh, đã bàn giao đưa vào sử dụng phục vụ bà con nhân dân.',
    status: 'Đã nghiệm thu',
    fileFormat: 'PDF'
  },
  {
    id: 'trans-07',
    title: 'Báo cáo công khai kết quả vận động, quản lý và sử dụng Quỹ "Vì người nghèo" và Quỹ "Đền ơn đáp nghĩa"',
    documentCode: 'BC-12/MTTQ-UBND',
    category: 'Quỹ vận động nhân dân',
    issueDate: '01/10/2026',
    issuingAuthority: 'UBMTTQVN Phường Tân Mỹ & UBND Phường',
    summary: 'Báo cáo minh bạch thu - chi các nguồn đóng góp tự nguyện của nhân dân, nhà hảo tâm, doanh nghiệp; danh sách các gia đình chính sách được nhận hỗ trợ.',
    amountOrBudget: '485 triệu VNĐ',
    details: 'Đã trao 32 suất học bổng, sửa chữa 2 căn nhà tình thương cho hộ khó khăn tại Khu phố 2 và Khu phố 4.',
    status: 'Công khai định kỳ',
    fileFormat: 'XLSX'
  }
];

const TRANSPARENCY_STORAGE_KEY = 'tanmy_portal_transparency_v1';
const CONTACTS_STORAGE_KEY = 'tanmy_portal_contacts_v1';
const PARTY_GOV_STORAGE_KEY = 'tanmy_portal_partygov_v1';
const TRAFFIC_STORAGE_KEY = 'tanmy_portal_traffic_v1';

export function getStoredTransparencyDocs(): TransparencyItem[] {
  try {
    const raw = localStorage.getItem(TRANSPARENCY_STORAGE_KEY);
    if (!raw) return DEFAULT_TRANSPARENCY_DOCS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TRANSPARENCY_DOCS;
  } catch {
    return DEFAULT_TRANSPARENCY_DOCS;
  }
}

export function saveStoredTransparencyDocs(items: TransparencyItem[]): void {
  try {
    localStorage.setItem(TRANSPARENCY_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save transparency items', e);
  }
}

export function getStoredContacts(): AdministrativeContact[] {
  try {
    const raw = localStorage.getItem(CONTACTS_STORAGE_KEY);
    if (!raw) return DEFAULT_CONTACTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CONTACTS;
  } catch {
    return DEFAULT_CONTACTS;
  }
}

export function saveStoredContacts(contacts: AdministrativeContact[]): void {
  try {
    localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save contacts', e);
  }
}

export const DEFAULT_PARTY_GOV_LEADERS: PartyGovLeader[] = [
  {
    id: 'pg-1',
    group: 'dang_uy',
    role: 'Bí thư Đảng ủy Phường',
    name: 'Đồng chí Trần Quốc Tuấn',
    responsibilities: 'Phụ trách toàn diện công tác xây dựng Đảng, chính trị tư tưởng, tổ chức cán bộ và quốc phòng an ninh.',
    phone: '(028) 3771 8891',
    email: 'tuantq.tanmy@tphcm.gov.vn'
  },
  {
    id: 'pg-2',
    group: 'dang_uy',
    role: 'Phó Bí thư Thường trực Đảng ủy - Chủ tịch HĐND Phường',
    name: 'Đồng chí Lê Thị Kim Oanh',
    responsibilities: 'Chủ trì công tác văn phòng cấp ủy, kiểm tra giám sát, dân vận, quy chế dân chủ cơ sở và hoạt động của HĐND.',
    phone: '(028) 3771 8892',
    email: 'oanhltk.tanmy@tphcm.gov.vn'
  },
  {
    id: 'pg-3',
    group: 'hdnd_ubnd',
    role: 'Phó Bí thư Đảng ủy - Chủ tịch UBND Phường',
    name: 'Đồng chí Nguyễn Văn An',
    responsibilities: 'Lãnh đạo, chỉ đạo điều hành toàn diện hoạt động của UBND Phường; phụ trách trực tiếp cải cách hành chính, an ninh quốc phòng.',
    phone: '(028) 3771 8893',
    email: 'annv.tanmy@tphcm.gov.vn'
  },
  {
    id: 'pg-4',
    group: 'hdnd_ubnd',
    role: 'Phó Chủ tịch UBND (Văn hóa - Xã hội)',
    name: 'Đồng chí Trần Thị Mai',
    responsibilities: 'Trực tiếp chỉ đạo Bộ phận Một cửa, Cải cách hành chính, Giáo dục, Y tế, LĐ-TB&XH, Chuyển đổi số và an sinh nhân dân.',
    phone: '(028) 3771 8890',
    email: 'maitt.tanmy@tphcm.gov.vn'
  },
  {
    id: 'pg-5',
    group: 'hdnd_ubnd',
    role: 'Phó Chủ tịch UBND (Đô thị - Địa chính)',
    name: 'Đồng chí Lê Hoàng Quân',
    responsibilities: 'Trực tiếp chỉ đạo quản lý đất đai, trật tự xây dựng, tài nguyên môi trường, PCCC, chống ngập và an toàn giao thông.',
    phone: '(028) 3771 8894',
    email: 'quanlh.tanmy@tphcm.gov.vn'
  },
  {
    id: 'pg-6',
    group: 'doan_the',
    role: 'Chủ tịch UBMTTQVN Phường Tân Mỹ',
    name: 'Đồng chí Nguyễn Thanh Phong',
    responsibilities: 'Chủ trì khối Đại đoàn kết toàn dân tộc, các cuộc vận động nhân dân, giám sát và phản biện xã hội.',
    phone: '(028) 3771 6789',
    email: 'mttq.tanmy@tphcm.gov.vn'
  }
];

export function getStoredPartyGovLeaders(): PartyGovLeader[] {
  try {
    const raw = localStorage.getItem(PARTY_GOV_STORAGE_KEY);
    if (!raw) return DEFAULT_PARTY_GOV_LEADERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PARTY_GOV_LEADERS;
  } catch {
    return DEFAULT_PARTY_GOV_LEADERS;
  }
}

export function saveStoredPartyGovLeaders(leaders: PartyGovLeader[]): void {
  try {
    localStorage.setItem(PARTY_GOV_STORAGE_KEY, JSON.stringify(leaders));
  } catch (e) {
    console.error('Failed to save party gov leaders', e);
  }
}

export const DEFAULT_TRAFFIC_REPORTS: TrafficFloodReport[] = [
  {
    id: 'traffic-1',
    streetName: 'Đường Nguyễn Thị Thập',
    sectionDescription: 'Đoạn từ ngã tư Huỳnh Tấn Phát đến Chợ Tân Mỹ (Km 1+200)',
    neighborhood: 'Khu phố 2 & Khu phố 3',
    floodLevel: 'medium',
    trafficLevel: 'jammed',
    waterDepthCm: 30,
    reportedAt: '16:45 hôm nay',
    lastUpdatedAt: '17:15 hôm nay',
    reporterName: 'Đội Trật tự Đô thị & CSGT',
    reporterPhone: '0903 *** 888',
    description: 'Do triều cường dâng cao kết hợp mưa lớn, nước mấp mé bánh xe máy. Xe di chuyển rất chậm, ùn ứ dài từ chân cầu Tân Mỹ hướng về chợ.',
    recommendedAlternative: 'Ô tô và xe máy nên rẽ vào đường Nguyễn Văn Linh hoặc đường Mai Văn Vĩnh để tránh đoạn ngập.',
    confirmedCount: 38,
    resolvedCount: 6,
    isOfficialAlert: true,
    historyLogs: [
      {
        id: 'log-1',
        timestamp: '16:45 hôm nay',
        updatedBy: 'Bác Ba Chợ Tân Mỹ',
        floodLevel: 'deep',
        trafficLevel: 'jammed',
        note: 'Nước bắt đầu tràn lên vỉa hè, nhiều xe máy chết máy.'
      },
      {
        id: 'log-2',
        timestamp: '17:15 hôm nay',
        updatedBy: 'Cán bộ Đô thị Phường',
        floodLevel: 'medium',
        trafficLevel: 'jammed',
        note: 'Máy bơm chống ngập trạm Tân Mỹ đã vận hành hết công suất, nước đang hạ dần 10cm nhưng xe vẫn đông.'
      }
    ]
  },
  {
    id: 'traffic-2',
    streetName: 'Đường Huỳnh Tấn Phát',
    sectionDescription: 'Đoạn giao đường Tân Mỹ và đường dẫn lên Cầu Phú Mỹ',
    neighborhood: 'Khu phố 1',
    floodLevel: 'deep',
    trafficLevel: 'jammed',
    waterDepthCm: 45,
    reportedAt: '16:30 hôm nay',
    lastUpdatedAt: '17:20 hôm nay',
    reporterName: 'Anh Minh (Tài xế giao hàng)',
    reporterPhone: '0912 *** 345',
    description: 'Ngập sâu hơn 40cm đoạn trước số nhà 120-150. Xe máy bị chết máy liên tục, ô tô gầm thấp không thể qua được. Lực lượng dân quân đang hỗ trợ người dân đẩy xe.',
    recommendedAlternative: 'Nên đi vòng qua đường Trần Trọng Khiêm hoặc đường Gò Ô Môi.',
    confirmedCount: 52,
    resolvedCount: 3,
    isOfficialAlert: true,
    historyLogs: [
      {
        id: 'log-2a',
        timestamp: '16:30 hôm nay',
        updatedBy: 'Người dân KP1',
        floodLevel: 'deep',
        trafficLevel: 'jammed',
        note: 'Nước dâng nhanh ngập lút ống xả xe máy.'
      }
    ]
  },
  {
    id: 'traffic-3',
    streetName: 'Đường Lâm Văn Bền',
    sectionDescription: 'Đoạn trước Trường THCS Tân Mỹ đến giao lộ Nguyễn Thị Thập',
    neighborhood: 'Khu phố 4',
    floodLevel: 'low',
    trafficLevel: 'slow',
    waterDepthCm: 15,
    reportedAt: '16:50 hôm nay',
    lastUpdatedAt: '17:10 hôm nay',
    reporterName: 'Chị Lan Phụ huynh học sinh',
    reporterPhone: '0988 *** 678',
    description: 'Nước ngập mấp mé mép đường khoảng 10-15cm, xe máy vẫn di chuyển bình thường nhưng phụ huynh đón con đông nên di chuyển chậm.',
    recommendedAlternative: 'Lưu thông bình thường, giảm tốc độ khi đi qua khu vực trường học.',
    confirmedCount: 19,
    resolvedCount: 12,
    isOfficialAlert: false,
    historyLogs: [
      {
        id: 'log-3a',
        timestamp: '17:10 hôm nay',
        updatedBy: 'Người dân địa phương',
        floodLevel: 'low',
        trafficLevel: 'slow',
        note: 'Nước rút nhanh qua các miệng cống vừa được nạo vét.'
      }
    ]
  },
  {
    id: 'traffic-4',
    streetName: 'Đường Tân Mỹ (Tuyến chính UBND)',
    sectionDescription: 'Đoạn trước Trụ sở UBND Phường Tân Mỹ và Trạm Y tế',
    neighborhood: 'Khu phố 3',
    floodLevel: 'none',
    trafficLevel: 'clear',
    waterDepthCm: 0,
    reportedAt: '17:00 hôm nay',
    lastUpdatedAt: '17:22 hôm nay',
    reporterName: 'Tổ Trực ban Một cửa UBND Phường',
    description: 'Tuyến đường khô ráo hoàn toàn, hệ thống cống thoát nước hoạt động tốt. Giao thông thông thoáng, người dân đến làm thủ tục một cửa thuận lợi.',
    recommendedAlternative: 'Tuyến đường an toàn, lưu thông tốt.',
    confirmedCount: 41,
    resolvedCount: 28,
    isOfficialAlert: true,
    historyLogs: [
      {
        id: 'log-4a',
        timestamp: '17:22 hôm nay',
        updatedBy: 'Cán bộ Một cửa',
        floodLevel: 'none',
        trafficLevel: 'clear',
        note: 'Đường thông thoáng, không ngập nước.'
      }
    ]
  },
  {
    id: 'traffic-5',
    streetName: 'Đường Mai Văn Vĩnh',
    sectionDescription: 'Đoạn từ đường số 10 đến bờ kè rạch Ông Đội',
    neighborhood: 'Khu phố 5',
    floodLevel: 'medium',
    trafficLevel: 'slow',
    waterDepthCm: 25,
    reportedAt: '16:40 hôm nay',
    lastUpdatedAt: '17:05 hôm nay',
    reporterName: 'Anh Tuấn (Công dân KP5)',
    description: 'Nước triều mấp mé tràn bờ kè, ngập khoảng nửa bánh xe máy đoạn cua rạch. Đã có biển cảnh báo của Phường.',
    recommendedAlternative: 'Đi theo trục đường số 7 hoặc số 9.',
    confirmedCount: 24,
    resolvedCount: 8,
    isOfficialAlert: false,
    historyLogs: []
  }
];

export function getStoredTrafficReports(): TrafficFloodReport[] {
  try {
    const raw = localStorage.getItem(TRAFFIC_STORAGE_KEY);
    if (!raw) return DEFAULT_TRAFFIC_REPORTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TRAFFIC_REPORTS;
  } catch {
    return DEFAULT_TRAFFIC_REPORTS;
  }
}

export function saveStoredTrafficReports(reports: TrafficFloodReport[]): void {
  try {
    localStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save traffic reports', e);
  }
}
