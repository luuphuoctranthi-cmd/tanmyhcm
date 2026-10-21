import { Procedure } from '../types';

export const DEFAULT_PROCEDURES: Procedure[] = [
  {
    id: 'proc-khai-sinh',
    name: 'Đăng ký khai sinh (Dưới 14 tuổi)',
    code: '1.000854.000.00.00.H49',
    category: 'Hộ tịch',
    keywords: ['khai sinh', 'giấy khai sinh', 'sinh con', 'làm khai sinh', 'chứng sinh', 'đăng ký sinh'],
    actionUrl: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.000854.000.00.00.H49',
    videoTutorialUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Link video hướng dẫn thao tác nộp hồ sơ
    summary: 'Thực hiện đăng ký khai sinh cho trẻ em sinh ra dưới 14 tuổi tại UBND phường nơi cư trú của cha hoặc mẹ.',
    counterDepartment: 'Quầy số 01 - Tư pháp & Hộ tịch (Tầng trệt UBND Phường Tân Mỹ)',
    processingTime: 'Ngay trong ngày làm việc',
    fee: 'Miễn phí cho công dân Việt Nam',
    steps: [
      {
        title: 'Bước 1: Chuẩn bị đầy đủ hồ sơ giấy tờ',
        description: 'Chuẩn bị Giấy chứng sinh bản gốc và Căn cước công dân của cha mẹ.',
        tips: 'Nếu sinh tại cơ sở y tế thì lấy Giấy chứng sinh bản chính do viện cấp.'
      },
      {
        title: 'Bước 2: Đăng nhập VNeID và nộp hồ sơ',
        description: 'Bấm nút màu xanh lá cây, chọn đăng nhập bằng tài khoản Định danh điện tử VNeID (quét mã QR hoặc nhập số định danh + mật khẩu) rồi điền biểu mẫu điện tử.',
        tips: 'Đăng nhập VNeID mức 2 sẽ tự động điền sẵn thông tin cha mẹ.'
      },
      {
        title: 'Bước 3: Nhận thông báo thụ lý và Giấy khai sinh',
        description: 'Cán bộ Một cửa phường thụ lý, kiểm tra dữ liệu và trả kết quả Giấy khai sinh chính thức.',
        tips: 'Phường hỗ trợ đồng thời cấp thẻ BHYT và đăng ký thường trú liên thông.'
      }
    ],
    requiredDocuments: [
      { name: 'Giấy chứng sinh (Bản chính do bệnh viện cấp)', isRequired: true, note: 'Bản gốc còn nguyên vẹn' },
      { name: 'Tờ khai đăng ký khai sinh (điền trên cổng dịch vụ công hoặc mẫu giấy)', isRequired: true, note: 'Theo mẫu điện tử' },
      { name: 'Căn cước công dân của cha và mẹ', isRequired: true, note: 'Tự động đồng bộ qua VNeID' },
      { name: 'Giấy chứng nhận kết hôn của cha mẹ (nếu có)', isRequired: false, note: 'Bản trích lục hoặc đối chiếu' }
    ],
    customSpeechText: 'Trước khi thực hiện dịch vụ Đăng ký khai sinh, bạn cần chuẩn bị các loại hồ sơ sau: Thứ nhất, Giấy chứng sinh bản chính do cơ sở y tế cấp. Thứ hai, Căn cước công dân của cha và mẹ để đối chiếu. Thứ ba, Giấy chứng nhận kết hôn của cha mẹ nếu có. Sau đây là các bước hướng dẫn: Bạn hãy bấm vào nút màu xanh lá cây trên màn hình, sau đó sử dụng ứng dụng VNeID trên điện thoại để quét mã QR đăng nhập, hoặc nhập trực tiếp số định danh cá nhân 12 số cùng mật khẩu. Sau đó thực hiện điền các thông tin theo mẫu yêu cầu trên hệ thống. Bạn cũng có thể bấm vào nút Video bên cạnh để xem mẫu thao tác trực quan.',
    createdAt: 1715000000000,
    updatedAt: 1715000000000
  },
  {
    id: 'proc-ket-hon',
    name: 'Đăng ký kết hôn',
    code: '1.000858.000.00.00.H49',
    category: 'Hộ tịch',
    keywords: ['kết hôn', 'lấy vợ', 'lấy chồng', 'đăng ký kết hôn', 'hôn nhân', 'làm hôn thú'],
    actionUrl: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.000858.000.00.00.H49',
    videoTutorialUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Đăng ký kết hôn giữa công dân Việt Nam tại UBND phường nơi cư trú của một trong hai bên.',
    counterDepartment: 'Quầy số 01 - Tư pháp & Hộ tịch (UBND Phường Tân Mỹ)',
    processingTime: 'Trong ngày làm việc',
    fee: 'Miễn phí',
    steps: [
      {
        title: 'Bước 1: Chuẩn bị hồ sơ',
        description: 'Tờ khai đăng ký kết hôn và Giấy xác nhận tình trạng hôn nhân (nếu cư trú ngoài địa bàn phường).',
        tips: 'Nam từ đủ 20 tuổi, nữ từ đủ 18 tuổi.'
      },
      {
        title: 'Bước 2: Nộp trực tuyến qua VNeID hoặc trực tiếp',
        description: 'Đăng nhập Cổng dịch vụ công qua VNeID để kê khai trước, giúp giảm thời gian làm thủ tục tại phường.',
        tips: 'Hai bên nam nữ cùng có mặt để ký vào sổ đăng ký kết hôn.'
      },
      {
        title: 'Bước 3: Ký sổ và nhận Giấy chứng nhận kết hôn',
        description: 'Lãnh đạo UBND phường trao 02 bản chính Giấy chứng nhận kết hôn cho vợ và chồng.',
        tips: 'Mỗi người giữ một bản chính.'
      }
    ],
    requiredDocuments: [
      { name: 'Tờ khai đăng ký kết hôn (hai bên cùng ký tên)', isRequired: true, note: 'Theo mẫu' },
      { name: 'Giấy xác nhận tình trạng hôn nhân (nếu cư trú ngoài phường Tân Mỹ)', isRequired: true, note: 'Bản chính còn hạn 6 tháng' },
      { name: 'Căn cước công dân của hai bên nam nữ', isRequired: true, note: 'Xác thực qua VNeID' }
    ],
    customSpeechText: 'Trước khi thực hiện dịch vụ Đăng ký kết hôn, bạn cần chuẩn bị các loại hồ sơ sau: Thứ nhất, Tờ khai đăng ký kết hôn do hai bên cùng ký. Thứ hai, Giấy xác nhận tình trạng hôn nhân nếu một trong hai người không thường trú tại phường Tân Mỹ. Thứ ba, Căn cước công dân của hai bên nam nữ. Sau đây là các bước hướng dẫn: Bạn hãy bấm vào nút màu xanh lá cây để quét mã QR VNeID hoặc nhập số định danh đăng nhập, sau đó điền tờ khai trực tuyến. Bạn có thể bấm vào nút Video bên cạnh để xem clip hướng dẫn thao tác chi tiết.',
    createdAt: 1715000000000,
    updatedAt: 1715000000000
  },
  {
    id: 'proc-xac-nhan-doc-than',
    name: 'Cấp Giấy xác nhận tình trạng hôn nhân (Độc thân)',
    code: '1.000862.000.00.00.H49',
    category: 'Hộ tịch',
    keywords: ['độc thân', 'giấy độc thân', 'xác nhận độc thân', 'tình trạng hôn nhân', 'chứng nhận độc thân', 'chưa kết hôn'],
    actionUrl: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.000862.000.00.00.H49',
    videoTutorialUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Cấp giấy xác nhận tình trạng hôn nhân để sử dụng kết hôn, vay vốn, mua bán nhà đất...',
    counterDepartment: 'Quầy số 01 - Tư pháp & Hộ tịch (UBND Phường Tân Mỹ)',
    processingTime: 'Trong 03 ngày làm việc',
    fee: '15.000 VNĐ / trường hợp',
    steps: [
      {
        title: 'Bước 1: Chuẩn bị thông tin mục đích sử dụng',
        description: 'Ghi rõ mục đích (kết hôn, chuyển nhượng nhà đất, vay vốn...).',
        tips: 'Mục đích sử dụng không được để trống.'
      },
      {
        title: 'Bước 2: Nộp hồ sơ trực tuyến qua VNeID',
        description: 'Bấm nút nộp trực tuyến, quét mã đăng nhập VNeID và đính kèm giấy tờ ly hôn hoặc chứng tử của vợ/chồng cũ nếu có.',
        tips: 'Nhận kết quả bản điện tử hoặc bản giấy tại một cửa.'
      }
    ],
    requiredDocuments: [
      { name: 'Tờ khai cấp Giấy xác nhận tình trạng hôn nhân', isRequired: true, note: 'Ghi rõ mục đích' },
      { name: 'Căn cước công dân của người yêu cầu', isRequired: true, note: 'Định danh VNeID' },
      { name: 'Trích lục bản án ly hôn hoặc Giấy chứng tử (nếu đã từng kết hôn)', isRequired: false, note: 'Nếu có' }
    ],
    customSpeechText: 'Trước khi thực hiện dịch vụ cấp Giấy xác nhận tình trạng hôn nhân, bạn cần chuẩn bị các loại hồ sơ sau: Thứ nhất, Tờ khai nêu rõ mục đích sử dụng giấy xác nhận. Thứ hai, Căn cước công dân của bạn. Thứ ba, Bản sao quyết định ly hôn hoặc giấy chứng tử của vợ chồng cũ nếu trước đây bạn đã từng kết hôn. Sau đây là hướng dẫn: Bạn hãy bấm vào nút màu xanh lá cây để đăng nhập VNeID bằng cách quét mã QR hoặc nhập số định danh, sau đó thực hiện điền các bước trên form.',
    createdAt: 1715000000000,
    updatedAt: 1715000000000
  },
  {
    id: 'proc-sao-y-cong-chung',
    name: 'Chứng thực bản sao từ bản chính (Sao y, công chứng)',
    code: '1.000870.000.00.00.H49',
    category: 'Chứng thực',
    keywords: ['chứng thực', 'công chứng', 'sao y', 'bản sao', 'photo công chứng', 'chứng thực bản sao', 'sao y bản chính'],
    actionUrl: 'https://dichvucong.gov.vn/p/home/dvc-chi-tiet-thu-tuc-hanh-chinh.html?ma_thu_tuc=1.000870.000.00.00.H49',
    videoTutorialUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Chứng thực bản sao từ bản chính các giấy tờ, văn bằng, chứng chỉ, CCCD...',
    counterDepartment: 'Quầy số 02 - Chứng thực (UBND Phường Tân Mỹ)',
    processingTime: '15 - 30 phút trong ngày làm việc',
    fee: '2.000 VNĐ / trang',
    steps: [
      {
        title: 'Bước 1: Chuẩn bị bản chính và bản photocopy',
        description: 'Mang bản chính nguyên vẹn kèm bản photo cần chứng thực.',
        tips: 'Bản chính không tẩy xóa, rách rời.'
      },
      {
        title: 'Bước 2: Nộp hồ sơ và ký chứng thực',
        description: 'Cán bộ đối chiếu, lãnh đạo ký và đóng dấu mộc đỏ bàn giao.',
        tips: 'Có thể yêu cầu chứng thực bản sao điện tử để dùng online nhiều lần.'
      }
    ],
    requiredDocuments: [
      { name: 'Bản chính giấy tờ, văn bản cần chứng thực', isRequired: true, note: 'Bản gốc rõ chữ' },
      { name: 'Bản photocopy tương ứng cần chứng thực', isRequired: true, note: 'Photo rõ nét' }
    ],
    customSpeechText: 'Trước khi thực hiện dịch vụ Chứng thực bản sao từ bản chính, bạn cần chuẩn bị các loại hồ sơ sau: Thứ nhất, Bản chính giấy tờ còn nguyên vẹn, rõ chữ. Thứ hai, Bản photocopy tương ứng cần sao y. Bạn có thể bấm nút màu xanh lá cây để yêu cầu chứng thực bản sao điện tử qua VNeID, hoặc bấm nút Video bên cạnh để xem thao tác mẫu.',
    createdAt: 1715000000000,
    updatedAt: 1715000000000
  },
  {
    id: 'proc-tam-tru-thuong-tru',
    name: 'Đăng ký tạm trú / Thông báo lưu trú',
    code: '1.000910.000.00.00.H49',
    category: 'Cư trú',
    keywords: ['tạm trú', 'thường trú', 'hộ khẩu', 'nhập khẩu', 'chuyển khẩu', 'cư trú', 'đăng ký tạm trú', 'khai báo tạm trú'],
    actionUrl: 'https://dichvucong.bocongan.gov.vn/bocongan/bothutuc/tthc?matt=27357',
    videoTutorialUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    summary: 'Đăng ký tạm trú cho công dân đến sinh sống tại nơi ở hợp pháp trên 30 ngày.',
    counterDepartment: 'Quầy Công an Phường Tân Mỹ (Bộ phận Một cửa)',
    processingTime: '03 ngày làm việc',
    fee: '7.000 VNĐ (trực tuyến)',
    steps: [
      {
        title: 'Bước 1: Chuẩn bị giấy tờ chỗ ở',
        description: 'Hợp đồng thuê nhà, mượn nhà hoặc giấy tờ quyền sở hữu chỗ ở hợp pháp.',
        tips: 'Cần ý kiến đồng ý của chủ sở hữu chỗ ở.'
      },
      {
        title: 'Bước 2: Đăng nhập VNeID và nộp hồ sơ',
        description: 'Bấm nút nộp trực tuyến, đăng nhập bằng VNeID và đính kèm hồ sơ.',
        tips: 'Kết quả sẽ hiển thị trên VNeID của công dân.'
      }
    ],
    requiredDocuments: [
      { name: 'Tờ khai thay đổi thông tin cư trú (Mẫu CT01)', isRequired: true, note: 'Chủ nhà ký đồng ý' },
      { name: 'Giấy tờ chứng minh chỗ ở hợp pháp (Hợp đồng thuê, sổ đỏ...)', isRequired: true, note: 'Bản sao chụp' },
      { name: 'Căn cước công dân của người đăng ký', isRequired: true, note: 'Định danh VNeID' }
    ],
    customSpeechText: 'Trước khi thực hiện dịch vụ Đăng ký tạm trú, bạn cần chuẩn bị các loại hồ sơ sau: Thứ nhất, Tờ khai thay đổi thông tin cư trú Mẫu CT01 có ý kiến đồng ý của chủ hộ. Thứ hai, Hợp đồng thuê nhà hoặc giấy tờ chứng minh chỗ ở hợp pháp. Thứ ba, Căn cước công dân của bạn. Sau đây là các bước: Bạn hãy bấm vào nút màu xanh lá cây để quét mã QR VNeID hoặc đăng nhập bằng số định danh, sau đó thực hiện gửi hồ sơ trực tuyến theo biểu mẫu.',
    createdAt: 1715000000000,
    updatedAt: 1715000000000
  }
];

export const STORAGE_KEY = 'tan_my_ward_procedures_v2';

export function getStoredProcedures(): Procedure[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROCEDURES));
      return DEFAULT_PROCEDURES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PROCEDURES;
  } catch (err) {
    console.error('Failed to read procedures from localStorage:', err);
    return DEFAULT_PROCEDURES;
  }
}

export function saveStoredProcedures(procedures: Procedure[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(procedures));
  } catch (err) {
    console.error('Failed to save procedures to localStorage:', err);
  }
}
