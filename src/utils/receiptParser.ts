import { ExpenseCategory } from '@/contexts/BudgetContext';

export interface ParsedReceipt {
  amount: number | null;
  amountConfidence: 'high' | 'medium' | 'low';
  storeName: string;
  storeConfidence: 'high' | 'medium' | 'low';
  date: string | null;
  dateConfidence: 'high' | 'medium' | 'low';
  category: ExpenseCategory;
  categoryConfidence: 'high' | 'medium' | 'low';
  rawText: string;
}

const CATEGORY_KEYWORDS: Record<string, { category: ExpenseCategory; keywords: string[] }> = {
  groceries: {
    category: 'groceries',
    keywords: ['checkers', 'pick n pay', 'pick-n-pay', 'shoprite', 'woolworths', 'spar', 'food lover', 'foodlovers', 'makro', 'game', 'grocery', 'supermarket', 'fruit', 'veg'],
  },
  transport: {
    category: 'transport',
    keywords: ['uber', 'bolt', 'lyft', 'taxi', 'petrol', 'fuel', 'engen', 'shell', 'caltex', 'sasol', 'bp', 'garage', 'parking', 'toll'],
  },
  food: {
    category: 'food',
    keywords: ['restaurant', 'cafe', 'coffee', 'kfc', 'mcdonalds', 'nandos', 'steers', 'burger', 'pizza', 'sushi', 'wimpy', 'mugg & bean', 'ocean basket', 'debonairs'],
  },
  entertainment: {
    category: 'entertainment',
    keywords: ['cinema', 'movie', 'ster-kinekor', 'nu metro', 'netflix', 'showmax', 'dstv', 'game', 'concert', 'ticket'],
  },
  health: {
    category: 'health',
    keywords: ['pharmacy', 'clicks', 'dis-chem', 'dischem', 'doctor', 'medical', 'hospital', 'clinic', 'dentist', 'optometrist', 'medicine'],
  },
  clothing: {
    category: 'clothing',
    keywords: ['mr price', 'truworths', 'edgars', 'foschini', 'cotton on', 'zara', 'h&m', 'clothing', 'shoes', 'fashion', 'ackermans', 'pep'],
  },
  education: {
    category: 'education',
    keywords: ['university', 'college', 'school', 'tuition', 'textbook', 'stationery', 'cna', 'exclusive books', 'bookstore'],
  },
  utilities: {
    category: 'utilities',
    keywords: ['electricity', 'water', 'internet', 'wifi', 'vodacom', 'mtn', 'cell c', 'telkom', 'fibre', 'airtime', 'data'],
  },
  rent: {
    category: 'rent',
    keywords: ['rent', 'lease', 'accommodation', 'housing', 'landlord'],
  },
};

export function parseReceiptText(rawText: string): ParsedReceipt {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const textLower = rawText.toLowerCase();

  // --- Extract amount ---
  const amountResult = extractAmount(rawText);

  // --- Extract store name ---
  const storeResult = extractStoreName(lines);

  // --- Extract date ---
  const dateResult = extractDate(rawText);

  // --- Determine category ---
  const categoryResult = determineCategory(textLower);

  return {
    amount: amountResult.value,
    amountConfidence: amountResult.confidence,
    storeName: storeResult.value,
    storeConfidence: storeResult.confidence,
    date: dateResult.value,
    dateConfidence: dateResult.confidence,
    category: categoryResult.value,
    categoryConfidence: categoryResult.confidence,
    rawText,
  };
}

function extractAmount(text: string): { value: number | null; confidence: 'high' | 'medium' | 'low' } {
  // Try patterns from most to least specific
  const patterns = [
    // "TOTAL" or "GRAND TOTAL" or "AMOUNT DUE" followed by currency
    /(?:grand\s*total|total\s*due|amount\s*due|balance\s*due|total\s*payable|nett\s*total)\s*[:\s]*R?\s*(\d[\d\s,.]*\d)/i,
    /(?:total)\s*[:\s]*R?\s*(\d[\d\s,.]*\d)/i,
    // ZAR or R prefix amounts
    /(?:ZAR|R)\s*(\d[\d\s,.]*\d)/i,
    // Standalone large number on a line (fallback)
    /^\s*R?\s*(\d{2,}[.,]\d{2})\s*$/m,
  ];

  for (let i = 0; i < patterns.length; i++) {
    const matches = text.match(patterns[i]);
    if (matches?.[1]) {
      const cleaned = matches[1].replace(/\s/g, '').replace(/,/g, '.');
      // Take last decimal point as the decimal separator
      const lastDot = cleaned.lastIndexOf('.');
      let numStr = cleaned;
      if (lastDot > 0) {
        numStr = cleaned.substring(0, lastDot).replace(/\./g, '') + '.' + cleaned.substring(lastDot + 1);
      }
      const val = parseFloat(numStr);
      if (!isNaN(val) && val > 0 && val < 1000000) {
        const confidence = i === 0 ? 'high' : i === 1 ? 'high' : i === 2 ? 'medium' : 'low';
        return { value: Math.round(val * 100) / 100, confidence };
      }
    }
  }

  return { value: null, confidence: 'low' };
}

function extractStoreName(lines: string[]): { value: string; confidence: 'high' | 'medium' | 'low' } {
  // Usually the first 1-3 lines contain the store name
  // Skip lines that are mostly numbers, dates, or very short
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length < 3) continue;
    if (/^\d+[\/\-]\d+[\/\-]\d+/.test(line)) continue; // skip dates
    if (/^\d+$/.test(line.replace(/\s/g, ''))) continue; // skip pure numbers
    if (/^(tel|phone|fax|vat|tax)/i.test(line)) continue;

    // Check if it matches a known store
    const lower = line.toLowerCase();
    for (const group of Object.values(CATEGORY_KEYWORDS)) {
      for (const kw of group.keywords) {
        if (lower.includes(kw)) {
          return { value: line, confidence: 'high' };
        }
      }
    }

    // First meaningful text line is likely the store
    if (i < 2 && /[a-zA-Z]{3,}/.test(line)) {
      return { value: line, confidence: 'medium' };
    }
  }

  return { value: lines[0] || 'Unknown Store', confidence: 'low' };
}

function extractDate(text: string): { value: string | null; confidence: 'high' | 'medium' | 'low' } {
  const patterns = [
    // DD/MM/YYYY or DD-MM-YYYY
    { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](20\d{2})/g, format: 'dmy' },
    // YYYY/MM/DD or YYYY-MM-DD
    { regex: /(20\d{2})[\/\-](\d{1,2})[\/\-](\d{1,2})/g, format: 'ymd' },
    // DD Mon YYYY
    { regex: /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(20\d{2})/gi, format: 'dMonY' },
  ];

  const monthMap: Record<string, string> = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
  };

  for (const { regex, format } of patterns) {
    const match = regex.exec(text);
    if (match) {
      let dateStr: string;
      if (format === 'dmy') {
        const d = match[1].padStart(2, '0');
        const m = match[2].padStart(2, '0');
        dateStr = `${match[3]}-${m}-${d}`;
      } else if (format === 'ymd') {
        const m = match[2].padStart(2, '0');
        const d = match[3].padStart(2, '0');
        dateStr = `${match[1]}-${m}-${d}`;
      } else {
        const d = match[1].padStart(2, '0');
        const m = monthMap[match[2].toLowerCase().substring(0, 3)] || '01';
        dateStr = `${match[3]}-${m}-${d}`;
      }

      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return { value: dateStr, confidence: 'high' };
      }
    }
  }

  return { value: null, confidence: 'low' };
}

function determineCategory(textLower: string): { value: ExpenseCategory; confidence: 'high' | 'medium' | 'low' } {
  let bestMatch: { category: ExpenseCategory; count: number } = { category: 'other', count: 0 };

  for (const group of Object.values(CATEGORY_KEYWORDS)) {
    let count = 0;
    for (const kw of group.keywords) {
      if (textLower.includes(kw)) count++;
    }
    if (count > bestMatch.count) {
      bestMatch = { category: group.category, count };
    }
  }

  if (bestMatch.count >= 2) return { value: bestMatch.category, confidence: 'high' };
  if (bestMatch.count === 1) return { value: bestMatch.category, confidence: 'medium' };
  return { value: 'other', confidence: 'low' };
}
