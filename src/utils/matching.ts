import { Procedure } from '../types';

/**
 * Remove Vietnamese accents and special characters for fuzzy keyword matching
 */
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Clean and normalize spoken transcript
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface MatchResult {
  procedure: Procedure;
  matchedKeyword: string;
  confidence: number;
}

/**
 * Strict Zero-Hallucination matcher:
 * Scans only the procedures in the database.
 * Matches spoken transcript against the procedure's official keywords and name.
 */
export function matchProcedureByVoice(
  transcript: string,
  procedures: Procedure[]
): MatchResult | null {
  if (!transcript || !transcript.trim() || !procedures.length) {
    return null;
  }

  const rawNormalized = normalizeText(transcript);
  const unaccented = removeVietnameseAccents(transcript);

  let bestMatch: MatchResult | null = null;
  let highestScore = 0;

  for (const proc of procedures) {
    // 1. Check each configured keyword
    for (const kw of proc.keywords) {
      const kwNorm = normalizeText(kw);
      const kwUnaccented = removeVietnameseAccents(kw);

      if (!kwNorm) continue;

      if (rawNormalized.includes(kwNorm)) {
        const score = 100 + kwNorm.length;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = { procedure: proc, matchedKeyword: kw, confidence: 1 };
        }
      } else if (unaccented.includes(kwUnaccented)) {
        const score = 80 + kwUnaccented.length;
        if (score > highestScore) {
          highestScore = score;
          bestMatch = { procedure: proc, matchedKeyword: kw, confidence: 0.9 };
        }
      }
    }

    // 2. Check procedure name
    const procNameNorm = normalizeText(proc.name);
    const procNameUnaccented = removeVietnameseAccents(proc.name);

    if (rawNormalized.includes(procNameNorm)) {
      const score = 120 + procNameNorm.length;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { procedure: proc, matchedKeyword: proc.name, confidence: 1 };
      }
    } else if (unaccented.includes(procNameUnaccented)) {
      const score = 90 + procNameUnaccented.length;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { procedure: proc, matchedKeyword: proc.name, confidence: 0.95 };
      }
    }
  }

  return bestMatch;
}

/**
 * Generate AI voice script for specific phase:
 * - 'docs': "Trước khi thực hiện dịch vụ này, bạn cần chuẩn bị các loại hồ sơ sau..."
 * - 'steps': "Sau đây là các bước thực hiện..."
 * - 'ready': "Nếu bạn đã chuẩn bị đầy đủ hồ sơ, hãy bấm vào cái vùng đang nhấp nháy để tiến hành thực hiện việc đăng ký nhé. Chúc bạn thực hiện thành công."
 */
export function getPhaseVoiceScript(proc: Procedure, phase: 'docs' | 'steps' | 'ready'): string {
  if (phase === 'docs') {
    const docSummaries = proc.requiredDocuments.length > 0
      ? proc.requiredDocuments
          .map((d, i) => `Thứ ${i + 1}: ${d.name}${d.note ? ' (' + d.note + ')' : ''}`)
          .join('. ')
      : 'Hồ sơ theo quy định tại bộ phận Một cửa';
    return `Trước khi thực hiện dịch vụ ${proc.name}, bạn cần chuẩn bị các loại hồ sơ sau: ${docSummaries}.`;
  }

  if (phase === 'steps') {
    const stepSummaries = proc.steps
      .map((s, idx) => `Bước ${idx + 1}: ${s.title}. ${s.description}`)
      .join('. ');
    return `Quy trình thực hiện gồm các bước: ${stepSummaries}. Khi vào hệ thống, bạn có thể quét mã VNeID trên điện thoại hoặc nhập số định danh 12 số để đăng nhập.`;
  }

  if (phase === 'ready') {
    return `Nếu bạn đã chuẩn bị đầy đủ hồ sơ, hãy bấm vào cái vùng đang nhấp nháy để tiến hành thực hiện việc đăng ký nhé. Chúc bạn thực hiện thành công. Bạn cũng có thể bấm vào nút Video bên cạnh để xem thao tác mẫu.`;
  }

  return '';
}

/**
 * Full script if user wants complete speech
 */
export function generateSpeechScript(proc: Procedure): string {
  if (proc.customSpeechText && proc.customSpeechText.trim()) {
    return proc.customSpeechText.trim();
  }

  const partDocs = getPhaseVoiceScript(proc, 'docs');
  const partSteps = getPhaseVoiceScript(proc, 'steps');
  const partReady = getPhaseVoiceScript(proc, 'ready');

  return `${partDocs} ${partSteps} ${partReady}`;
}

export interface VoiceCheckboxActionResult {
  action: 'check' | 'uncheck' | 'check_all' | 'uncheck_all';
  targetDocName?: string;
  feedbackMessage: string;
}

/**
 * Recognizes voice commands to check/uncheck document checkboxes
 * Supports:
 * - "Đã có đủ hết", "Đầy đủ rồi", "Có hết rồi" -> check all
 * - "Đã có [tên giấy tờ]", "Có [tên giấy tờ]" -> check specific
 * - "Chưa có [tên giấy tờ]", "Bỏ chọn [tên giấy tờ]" -> uncheck
 */
export function matchDocumentCheckboxVoice(
  spokenText: string,
  documents: { name: string }[]
): VoiceCheckboxActionResult | null {
  if (!spokenText || !spokenText.trim()) return null;

  const raw = normalizeText(spokenText);
  const unaccented = removeVietnameseAccents(spokenText);

  // Check for "check all" phrases
  const checkAllPhrases = [
    'da co du', 'co du', 'day du', 'co het', 'da co tat ca', 'tat ca da co',
    'chuan bi xong', 'da chuan bi xong', 'xong het', 'xong roi', 'co du roi',
    'da co day du', 'du het roi', 'tich het', 'chon tat ca'
  ];

  for (const phrase of checkAllPhrases) {
    if (unaccented.includes(phrase)) {
      return {
        action: 'check_all',
        feedbackMessage: 'Đã đánh dấu chuẩn bị đầy đủ tất cả các loại giấy tờ!'
      };
    }
  }

  // Check for "uncheck all" phrases
  const uncheckAllPhrases = ['bo chon het', 'xoa het', 'chua co gi', 'bo tat ca'];
  for (const phrase of uncheckAllPhrases) {
    if (unaccented.includes(phrase)) {
      return {
        action: 'uncheck_all',
        feedbackMessage: 'Đã bỏ chọn tất cả các loại giấy tờ.'
      };
    }
  }

  // Check for specific document matching
  const isUncheck = unaccented.includes('bo chon') || unaccented.includes('chua co') || unaccented.includes('khong co');

  for (const doc of documents) {
    const docNorm = normalizeText(doc.name);
    const docUnaccented = removeVietnameseAccents(doc.name);

    // Split doc name into key terms (length >= 3)
    const keywords = [
      docNorm,
      docUnaccented,
      ...docUnaccented.split(' ').filter(w => w.length > 3)
    ];

    const isMatch = keywords.some(kw => unaccented.includes(kw) || raw.includes(kw));
    if (isMatch) {
      if (isUncheck) {
        return {
          action: 'uncheck',
          targetDocName: doc.name,
          feedbackMessage: `Đã bỏ đánh dấu: ${doc.name}`
        };
      } else {
        return {
          action: 'check',
          targetDocName: doc.name,
          feedbackMessage: `Đã đánh dấu đã chuẩn bị: ${doc.name}`
        };
      }
    }
  }

  return null;
}
