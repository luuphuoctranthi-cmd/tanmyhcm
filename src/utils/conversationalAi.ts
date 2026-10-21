import { GoogleGenAI } from '@google/genai';
import { Procedure } from '../types';

let genAIClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY);
  if (apiKey) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

/**
 * Rich, articulate, empathetic fallback answers with full explanations
 * for administrative procedures, ward info, health & daily life.
 */
function getFallbackKnowledgeAnswer(query: string, procedures: Procedure[]): string {
  const q = query.toLowerCase().trim();

  // 1. Check matching procedures
  for (const proc of procedures) {
    if (proc.keywords.some(k => q.includes(k.toLowerCase())) || q.includes(proc.name.toLowerCase())) {
      const docList = proc.requiredDocuments
        .map((d, index) => `${index + 1}. ${d.name} (${d.isRequired ? 'Bắt buộc phải có' : 'Nộp kèm nếu có'}${d.note ? ` - Lưu ý: ${d.note}` : ''})`)
        .join('\n');

      return `Dạ, chào bạn! Về thủ tục "${proc.name}", Trợ lý xin phép được hướng dẫn chi tiết và đầy đủ để bạn chuẩn bị chu đáo như sau ạ:

📌 1. Các loại giấy tờ bạn cần chuẩn bị:
${docList}

🏢 2. Nơi tiếp nhận & Thời gian giải quyết:
- Bộ phận tiếp nhận: ${proc.counterDepartment} (Trụ sở UBND Phường Tân Mỹ - Số 01 Đường Tân Mỹ).
- Thời hạn trả kết quả: ${proc.processingTime}.
- Mức thu phí/lệ phí: ${proc.fee}.

📲 3. Hướng dẫn nộp hồ sơ trực tuyến thuận tiện:
- Bạn có thể thực hiện nộp trực tuyến qua Cổng Dịch vụ công Quốc gia để tiết kiệm thời gian đi lại.
- Khi nộp, bạn chọn đăng nhập bằng VNeID: Mở ứng dụng VNeID trên điện thoại để quét mã QR hoặc nhập số định danh 12 số cùng mật khẩu.
- Sau khi đăng nhập, hệ thống sẽ tự động điền sẵn thông tin cư trú của bạn, bạn chỉ cần tải ảnh chụp các giấy tờ nêu trên lên và bấm Gửi hồ sơ.

Nếu trong quá trình chuẩn bị có bất kỳ vướng mắc nào, bạn có thể gọi hotline Một cửa 1900 88 66 99 hoặc đến trực tiếp Quầy số 1 để cán bộ phường hướng dẫn tận tình bạn nhé!`;
    }
  }

  // 2. Health & Medical inquiries (Sức khỏe, Y tế, Dinh dưỡng, Huyết áp, Tim mạch...)
  if (q.includes('huyết áp') || q.includes('tim mạch')) {
    return `Dạ chào bạn, về vấn đề kiểm soát huyết áp và sức khỏe tim mạch, Trợ lý xin chia sẻ những hướng dẫn khoa học đã được Bộ Y tế và Tổ chức Y tế Thế giới (WHO) khuyến nghị như sau ạ:

🫀 1. Chỉ số huyết áp tiêu chuẩn:
- Người trưởng thành có huyết áp bình thường là dưới 120/80 mmHg. Huyết áp từ 140/90 mmHg trở lên được xem là tăng huyết áp.

🥗 2. Chế độ dinh dưỡng khoa học (Chế độ ăn DASH):
- Giảm lượng muối ăn hàng ngày: Không ăn quá 5g muối/ngày (tương đương 1 thìa cà phê), hạn chế các loại mắm mặn, dưa cà muối chua, thực phẩm đóng hộp.
- Tăng cường rau xanh, củ quả tươi giàu kali (chuối, cam, bơ, cà chua, rau bina) giúp điều hòa áp lực mạch máu.
- Hạn chế mỡ động vật, phủ tạng và đồ ăn chiên xào; ưu tiên chất béo tốt từ dầu mè, dầu oliu, các loại hạt.
- Uống đủ từ 1,5 đến 2 lít nước ấm mỗi ngày; kiêng rượu, bia, thuốc lá và giảm cà phê đặc.

🏃‍♂️ 3. Sinh hoạt & Vận động:
- Đi bộ nhẹ nhàng, tập thể dục dưỡng sinh hoặc đạp xe 30 - 45 phút mỗi ngày, tránh gắng sức quá mức khi trời nắng gắt hoặc quá lạnh.
- Giữ tinh thần thư thái, ngủ đủ 7 - 8 tiếng mỗi đêm, tránh lo âu và không tắm khuya bằng nước lạnh.

⚠️ 4. Dấu hiệu cảnh báo nguy hiểm:
Nếu bạn hoặc người thân có cảm giác đau tức ngực, khó thở, chóng mặt, hoa mắt, tê nửa mặt hoặc yếu tay chân, hãy gọi ngay cấp cứu 115 hoặc đưa đến Trạm Y tế Phường Tân Mỹ (Số 12 Đường Số 2, KDC Tân Mỹ) để được bác sĩ xử trí kịp thời bạn nhé!`;
  }

  if (q.includes('tiểu đường') || q.includes('đường huyết')) {
    return `Dạ chào bạn, đối với người mắc hoặc có nguy cơ đái tháo đường (tiểu đường), việc kiểm soát đường huyết ổn định là chìa khóa để phòng ngừa các biến chứng nguy hiểm. Dưới đây là những nguyên tắc vàng theo y khoa:

🌾 1. Chế độ ăn uống cân bằng:
- Chia nhỏ các bữa ăn (3 bữa chính kèm 1 - 2 bữa phụ nhẹ) để tránh đường huyết tăng vọt sau ăn.
- Giảm tinh bột hấp thu nhanh (cơm trắng, bánh mì trắng, nước ngọt có ga, bánh kẹo). Nên thay bằng gạo lứt, yến mạch, khoai lang luộc.
- Ăn nhiều rau củ có chất xơ hòa tan trước khi ăn cơm và thức ăn đạm để làm chậm quá trình hấp thu đường.
- Không bỏ bữa, đặc biệt là bữa sáng.

🩺 2. Theo dõi & Kiểm tra định kỳ:
- Thường xuyên đo đường huyết mao mạch lúc đói (mục tiêu 4,4 - 7,2 mmol/L) và sau ăn 2 giờ (dưới 10 mmol/L).
- Kiểm tra chỉ số HbA1c định kỳ 3 tháng một lần tại cơ sở y tế.
- Chăm sóc kỹ bàn chân hàng ngày: Đi giày dép mềm, kiểm tra kỹ các vết xước nhỏ để tránh nhiễm trùng.

Bạn có thể liên hệ Trạm Y tế Phường Tân Mỹ để được tư vấn theo dõi chương trình quản lý bệnh không lây nhiễm miễn phí của trạm y tế nhé!`;
  }

  if (q.includes('sốt xuất huyết') || q.includes('sốt')) {
    return `Dạ chào bạn, sốt xuất huyết là bệnh truyền nhiễm do muỗi vằn Aedes truyền bệnh, có thể diễn tiến nguy hiểm nếu không chăm sóc đúng cách. Dưới đây là phác đồ hướng dẫn an toàn từ cơ quan y tế:

🌡️ 1. Dấu hiệu nhận biết:
- Sốt cao đột ngột, liên tục 39 - 40 độ C, khó hạ sốt dù đã uống thuốc.
- Đau đầu dữ dội, đau hốc mắt, đau nhức cơ khớp, có thể có chấm xuất huyết dưới da hoặc chảy máu chân răng.

💊 2. Hướng dẫn chăm sóc tại nhà:
- Hạ sốt: Chỉ dùng duy nhất Paracetamol với liều 10 - 15mg/kg cân nặng mỗi 4 - 6 giờ (không quá 4 lần/ngày). TUYỆT ĐỐI KHÔNG dùng Aspirin, Ibuprofen hay Analgin vì gây nguy cơ xuất huyết dạ dày đe dọa tính mạng!
- Bù nước tích cực: Uống nhiều dung dịch Oresol (pha đúng tỉ lệ theo hướng dẫn trên gói), nước dừa tươi, nước cam, nước ép hoa quả.
- Nghỉ ngơi tuyệt đối tại giường, ăn thức ăn lỏng, dễ tiêu như cháo, súp.

🚨 3. Dấu hiệu nguy hiểm cần đưa đi bệnh viện ngay lập tức:
- Đau bụng dữ dội, nôn ói liên tục, li bì hoặc bồn chồn hốt hoảng.
- Chân tay lạnh, vã mồ hôi, tiểu ít hoặc không tiểu.
- Chảy máu mũi, nôn ra máu, đi ngoài phân đen.

UBND Phường Tân Mỹ cũng khuyến cáo bà con thường xuyên lật úp lu khạp, dọn dẹp phế thải đọng nước xung quanh nhà để diệt lăng quăng, bọ gậy, bảo vệ sức khỏe cho cả gia đình ạ!`;
  }

  if (q.includes('dinh dưỡng') || q.includes('người già') || q.includes('người cao tuổi')) {
    return `Dạ chào bạn! Chăm sóc dinh dưỡng cho người cao tuổi đòi hỏi sự chu đáo và khoa học vì hệ tiêu hóa và hấp thu của các bác lớn tuổi đã suy giảm. Trợ lý xin chia sẻ các lời khuyên thiết thực:

🍵 1. Nguyên tắc chế biến & Thức ăn:
- Thức ăn nên được nấu mềm, nhừ, thái nhỏ hoặc hầm kỹ để dễ nhai nuốt và hấp thu tốt.
- Bổ sung đủ canxi từ sữa ít đường, sữa chua, đậu phụ, cá nhỏ kho nhừ cả xương để phòng ngừa loãng xương.
- Ưu tiên chất đạm dễ tiêu từ cá, thịt nạc gà, trứng, các loại đậu hạt; giảm ăn thịt đỏ và mỡ động vật.

💧 2. Uống nước và tiêu hóa:
- Nhắc nhở người lớn tuổi uống từng ngụm nước ấm rải rác trong ngày (khoảng 1,5 lít), không đợi đến khi khát mới uống.
- Ăn nhiều rau xanh mềm (rau ngót, mồng tơi, bầu bí) và trái cây chín mềm (đu đủ, chuối) để tránh táo bón.

☀️ 3. Tinh thần & Vận động:
- Khuyến khích các bác đi dạo, hít thở không khí trong lành vào buổi sáng sớm (15 - 30 phút), tiếp xúc ánh nắng nhẹ giúp cơ thể tự tổng hợp Vitamin D.
- Tạo không khí gia đình vui vẻ, ấm cúng trong mỗi bữa cơm giúp các bác ăn ngon miệng và sống vui khỏe mỗi ngày.`;
  }

  // 3. Citizen Reception & Leadership Work Schedule
  if (q.includes('tiếp dân') || q.includes('tiếp công dân') || q.includes('chủ tịch tiếp') || q.includes('gặp chủ tịch')) {
    return `Dạ chào bạn, về lịch tiếp công dân của Lãnh đạo UBND Phường Tân Mỹ:

🏛️ 1. Lịch định kỳ của Chủ tịch UBND Phường:
- Thời gian: Định kỳ vào Thứ Năm hàng tuần.
- Buổi sáng: Từ 08:00 đến 11:30.
- Buổi chiều: Từ 14:00 đến 16:30.
- Địa điểm: Phòng Tiếp công dân (Tầng trệt - Trụ sở UBND Phường Tân Mỹ, Số 01 Đường Tân Mỹ).

📋 2. Nội dung tiếp nhận:
- Chủ tịch UBND Phường trực tiếp lắng nghe, tiếp nhận và chỉ đạo giải quyết các ý kiến, phản ánh, kiến nghị, khiếu nại, tố cáo của bà con nhân dân trên địa bàn.
- Các ngày làm việc còn lại trong tuần, cán bộ thường trực tiếp dân luôn có mặt tại phòng để tiếp nhận hồ sơ và báo cáo lãnh đạo xử lý theo quy định.

Bạn có thể liên hệ số điện thoại (028) 3771 8899 hoặc hotline 1900 88 66 99 để được sắp xếp chu đáo bạn nhé!`;
  }

  // 4. VNeID & Digital ID
  if (q.includes('vneid') || q.includes('định danh') || q.includes('quét mã') || q.includes('đăng nhập')) {
    return `Dạ chào bạn, để đăng nhập và nộp hồ sơ dịch vụ công bằng tài khoản định danh điện tử VNeID, bạn có 2 cách rất đơn giản và an toàn:

📱 Cách 1: Sử dụng điện thoại quét mã QR (Rất nhanh chóng & tiện lợi):
1. Trên màn hình máy tính hoặc Kiosk tại bộ phận một cửa, bấm vào ô "Đăng nhập bằng tài khoản VNeID".
2. Hệ thống sẽ hiển thị một mã QR Code trên màn hình.
3. Bạn mở ứng dụng VNeID trên điện thoại của mình, chọn biểu tượng Quét mã QR ở góc trên bên phải.
4. Hướng camera vào mã QR trên màn hình, sau đó xác nhận mã Passcode trên điện thoại là đăng nhập thành công ngay lập tức!

🔢 Cách 2: Nhập số định danh cá nhân trực tiếp:
1. Bạn chọn mục "Đăng nhập bằng tài khoản Định danh điện tử cấp bởi Bộ Công an".
2. Nhập 12 chữ số Căn cước công dân gắn chip của bạn vào ô Tên đăng nhập.
3. Nhập mật khẩu tài khoản VNeID của bạn và bấm Đăng nhập.
4. Hệ thống sẽ gửi một mã OTP 6 số về tin nhắn điện thoại hoặc ứng dụng VNeID, bạn nhập mã này vào là hoàn tất.

*Lưu ý: Để nộp được đầy đủ các thủ tục hành chính công trực tuyến, bạn cần đăng ký tài khoản VNeID Mức độ 2 (đến Công an Phường Tân Mỹ để được làm miễn phí trong 5 phút).*`;
  }

  // 5. Office hours & Address
  if (q.includes('giờ làm việc') || q.includes('mấy giờ') || q.includes('thời gian làm việc') || q.includes('thứ bảy')) {
    return `Dạ chào bạn, thời gian làm việc chính thức của UBND Phường Tân Mỹ và Bộ phận Tiếp nhận & Trả kết quả Một cửa như sau ạ:

⏰ 1. Từ Thứ Hai đến Thứ Sáu:
- Buổi sáng: Từ 07:30 đến 11:30.
- Buổi chiều: Từ 13:30 đến 17:00.

⏰ 2. Sáng Thứ Bảy:
- Tiếp nhận và giải quyết hồ sơ từ 07:30 đến 11:30 (tập trung vào các thủ tục cấp bách như sao y chứng thực, khai sinh, khai tử...).
- Chiều Thứ Bảy và ngày Chủ Nhật: Cơ quan nghỉ theo quy định của Nhà nước.

📍 Trụ sở UBND Phường đặt tại: Số 01 Đường Tân Mỹ, Phường Tân Mỹ.
Tổng đài hỗ trợ Một cửa: 1900 88 66 99.`;
  }

  if (q.includes('địa chỉ') || q.includes('ở đâu') || q.includes('vị trí')) {
    return `Dạ chào bạn, Trụ sở Đảng ủy - HĐND - UBND Phường Tân Mỹ và Bộ phận Tiếp nhận & Trả kết quả (Một cửa điện tử) tọa lạc tại:
📍 Địa chỉ: Số 01 Đường Tân Mỹ, Phường Tân Mỹ.
📞 Điện thoại Văn phòng: (028) 3771 8899 — Hotline Một cửa: 1900 88 66 99.
Thời gian làm việc từ sáng Thứ Hai đến hết sáng Thứ Bảy hàng tuần. Bộ phận Một cửa luôn sẵn sàng đón tiếp và tận tình phục vụ bà con nhân dân ạ!`;
  }

  // 6. Land and Construction
  if (q.includes('đất đai') || q.includes('sổ đỏ') || q.includes('xây dựng') || q.includes('sửa nhà') || q.includes('cấp phép')) {
    return `Dạ chào bạn, đối với các thủ tục liên quan đến Lĩnh vực Đất đai - Xây dựng tại Phường Tân Mỹ:

🏗️ 1. Các thủ tục phổ biến được giải quyết tại phường:
- Xác nhận hiện trạng sử dụng đất, nhà ở không có tranh chấp khiếu nại.
- Thông báo khởi công xây dựng, sửa chữa cải tạo nhà ở riêng lẻ.
- Xác nhận trích đo địa chính thửa đất phục vụ cấp đổi Giấy chứng nhận (Sổ đỏ/Sổ hồng).
- Đăng ký biến động đất đai và xác nhận quy hoạch xây dựng chi tiết.

📋 2. Giấy tờ cơ bản bạn cần mang theo:
- Bản chính và bản sao Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở (Sổ đỏ).
- Căn cước công dân gắn chip của chủ sở hữu.
- Bản vẽ hiện trạng vị trí hoặc bản vẽ xin phép xây dựng (nếu có).

Bạn vui lòng liên hệ trực tiếp Quầy Đất đai - Xây dựng (Quầy số 3 tại Bộ phận Một cửa UBND Phường) để được công chức chuyên trách trực tiếp kiểm tra hồ sơ và hướng dẫn cụ thể bạn nhé!`;
  }

  // 7. General warm helpful greeting
  return `Dạ, Trợ lý số thông minh Phường Tân Mỹ xin kính chào bạn!

Tôi là người bạn đồng hành số của nhân dân phường Tân Mỹ, sẵn sàng hỗ trợ bạn chu đáo về:
1. Tra cứu và hướng dẫn chi tiết hồ sơ các thủ tục hành chính công (Khai sinh, Kết hôn, Khai tử, Chứng thực, Cư trú, Đất đai, Chế độ chính sách...).
2. Hướng dẫn nộp hồ sơ trực tuyến qua Cổng Dịch vụ công Quốc gia và đăng nhập VNeID.
3. Cung cấp lịch làm việc, lịch tiếp công dân định kỳ của Lãnh đạo phường.
4. Đồng hành tư vấn các kiến thức khoa học về sức khỏe, y tế gia đình, dinh dưỡng và giải đáp thắc mắc đời sống hàng ngày.

Bạn có thể gõ câu hỏi hoặc bấm vào chiếc micro màu đỏ trên màn hình để nói cho tôi biết bạn đang cần giúp đỡ điều gì nhé!`;
}

export interface ChatHistoryItem {
  role: 'user' | 'model';
  text: string;
}

/**
 * Ask Companion AI Chatbot:
 * Serves as an empathetic, articulate companion for citizens.
 * 1. For administrative queries: strictly adheres to official ward procedures (zero-hallucination).
 * 2. For life, wellness, health, medical questions: provides expert, science-based, compassionate advice.
 */
export async function askCompanionChatbot(
  userQuery: string,
  procedures: Procedure[],
  history: ChatHistoryItem[] = []
): Promise<string> {
  const client = getClient();

  if (!client) {
    return getFallbackKnowledgeAnswer(userQuery, procedures);
  }

  try {
    const procedureContext = procedures.map(p => `
Thủ tục: ${p.name}
Lĩnh vực: ${p.category}
Từ khóa: ${p.keywords.join(', ')}
Nơi tiếp nhận: ${p.counterDepartment}
Thời hạn giải quyết: ${p.processingTime}
Mức phí / Lệ phí: ${p.fee}
Thành phần hồ sơ gồm có:
${p.requiredDocuments.map((d, idx) => `  ${idx + 1}. ${d.name} (${d.isRequired ? 'Bắt buộc' : 'Không bắt buộc'}${d.note ? ` - Chú thích: ${d.note}` : ''})`).join('\n')}
`).join('\n---\n');

    const systemPrompt = `Bạn là "Trợ lý Số Đồng Hành" của UBND Phường Tân Mỹ — người bạn thông minh, tận tâm, thấu tình đạt lý, mạch lạc, chi tiết, ân cần và trọn vẹn câu chữ của mọi người dân.

YÊU CẦU ĐẶC BIỆT VỀ CHẤT LƯỢNG TRẢ LỜI:
- Tuyệt đối KHÔNG trả lời cộc lốc, ngắn ngủn hoặc qua loa.
- Trả lời đầy đủ, mạch lạc, sâu sắc, có đầu có đuôi, dùng ngôn ngữ tiếng Việt chuẩn mực, lễ độ, ấm áp ("Dạ, chào bạn...", "Trợ lý xin phép được hướng dẫn chu đáo như sau ạ...", "Chúc bạn và gia đình dồi dào sức khỏe!").
- Luôn trình bày rõ ràng bằng các đề mục số, gạch đầu dòng khoa học để người dân, đặc biệt là người lớn tuổi, dễ đọc và dễ nắm bắt.

1. ĐỐI VỚI THỦ TỤC HÀNH CHÍNH & CÔNG TÁC PHƯỜNG:
   - Tuân thủ nguyên tắc Không bịa đặt (Zero Hallucination), bám sát 100% dữ liệu thực tế của UBND Phường Tân Mỹ dưới đây:
${procedureContext}
   - Trụ sở: Số 01 Đường Tân Mỹ, Phường Tân Mỹ. Hotline Một cửa: 1900 88 66 99.
   - Giờ làm việc: Thứ 2 đến Thứ 6 (Sáng 07:30 - 11:30, Chiều 13:30 - 17:00); Sáng Thứ Bảy (07:30 - 11:30).
   - Lịch tiếp công dân của Chủ tịch UBND Phường: Định kỳ Thứ Năm hàng tuần tại Phòng Tiếp dân.
   - Hướng dẫn nộp online: Quét mã QR VNeID hoặc nhập 12 số CCCD, nộp qua Cổng Dịch vụ công Quốc gia.

2. ĐỐI VỚI CÂU HỎI CUỘC SỐNG, SỨC KHỎE, Y TẾ, DINH DƯỠNG:
   - Trả lời như một chuyên gia y tế, khoa học giàu kinh nghiệm, ân cần và có căn cứ khoa học chuẩn mực (WHO, Bộ Y tế Việt Nam).
   - Phân tích nguyên nhân, cơ chế dễ hiểu, hướng dẫn từng bước chăm sóc, chế độ ăn uống, sinh hoạt, tập luyện và những điều cần kiêng khem.
   - Dặn dò kỹ lưỡng các triệu chứng cảnh báo nguy hiểm cần đưa đi cấp cứu hoặc đến khám tại Trạm Y tế Phường Tân Mỹ (Số 12 Đường Số 2, KDC Tân Mỹ).

3. ĐỐI VỚI VĂN BẢN VÀ DÂN SINH:
   - Nếu công dân thắc mắc về trật tự đô thị, rác thải, lịch công tác, công khai ngân sách... hãy hướng dẫn tận tình các kênh tiếp nhận phản ánh của phường.`;

    const contents = [
      ...history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      { role: 'user', parts: [{ text: userQuery }] }
    ];

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        maxOutputTokens: 2000,
      }
    });

    const reply = response.text?.trim();
    return reply || getFallbackKnowledgeAnswer(userQuery, procedures);
  } catch (err) {
    console.warn('Gemini API call failed, using fallback knowledge:', err);
    return getFallbackKnowledgeAnswer(userQuery, procedures);
  }
}

/**
 * Legacy wrapper for backward compatibility
 */
export async function askConversationalAssistant(
  userQuery: string,
  procedures: Procedure[]
): Promise<string> {
  return askCompanionChatbot(userQuery, procedures, []);
}
