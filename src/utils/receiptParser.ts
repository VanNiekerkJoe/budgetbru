import { ExpenseCategory } from '@/contexts/BudgetContext';

export interface LineItem {
  name: string;
  amount: number | null;
  raw: string;
}

export interface ParsedReceipt {
  amount: number | null;
  amountConfidence: 'high' | 'medium' | 'low';
  storeName: string;
  storeConfidence: 'high' | 'medium' | 'low';
  date: string | null;
  dateConfidence: 'high' | 'medium' | 'low';
  category: ExpenseCategory;
  categoryConfidence: 'high' | 'medium' | 'low';
  lineItems: LineItem[];
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

  const amountResult = extractAmount(rawText, lines);
  const storeResult = extractStoreName(lines);
  const dateResult = extractDate(rawText);
  const categoryResult = determineCategory(textLower);
  const lineItems = extractLineItems(lines);

  // Cross-validate: if line items sum is close to detected total, boost confidence
  if (amountResult.value && lineItems.length >= 2) {
    const itemSum = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const roundedSum = Math.round(itemSum * 100) / 100;
    if (Math.abs(roundedSum - amountResult.value) < 1) {
      amountResult.confidence = 'high';
    }
  }

  return {
    amount: amountResult.value,
    amountConfidence: amountResult.confidence,
    storeName: storeResult.value,
    storeConfidence: storeResult.confidence,
    date: dateResult.value,
    dateConfidence: dateResult.confidence,
    category: categoryResult.value,
    categoryConfidence: categoryResult.confidence,
    lineItems,
    rawText,
  };
}

function extractAmount(text: string): { value: number | null; confidence: 'high' | 'medium' | 'low' } {
  // Try patterns from most to least specific
  // Allow amounts like R8, R80, R8.00, R80.00, R800.50
  const patterns = [
    // "GRAND TOTAL" / "TOTAL DUE" / "AMOUNT DUE" followed by currency — highest confidence
    /(?:grand\s*total|total\s*due|amount\s*due|balance\s*due|total\s*payable|nett\s*total)\s*[:\s]*R?\s*(\d[\d\s,.]*)/i,
    // "TOTAL" followed by currency
    /(?:total)\s*[:\s]*R?\s*(\d[\d\s,.]*)/i,
    // ZAR or R prefix amounts (word boundary to avoid matching inside words like "R8oad")
    /(?:ZAR|R)\s*(\d+(?:[.,]\d{1,2})?)\b/i,
    // Standalone number on a line (fallback)
    /^\s*R?\s*(\d+[.,]\d{2})\s*$/m,
  ];

  for (let i = 0; i < patterns.length; i++) {
    // For total-related patterns, find ALL matches and pick the largest (likely the grand total)
    if (i <= 1) {
      const allMatches: number[] = [];
      let m: RegExpExecArray | null;
      const regex = new RegExp(patterns[i].source, 'gi');
      while ((m = regex.exec(text)) !== null) {
        const val = cleanAmount(m[1]);
        if (val !== null && val > 0 && val < 1000000) allMatches.push(val);
      }
      if (allMatches.length > 0) {
        const best = Math.max(...allMatches);
        return { value: best, confidence: i === 0 ? 'high' : 'high' };
      }
      continue;
    }

    const matches = text.match(patterns[i]);
    if (matches?.[1]) {
      const val = cleanAmount(matches[1]);
      if (val !== null && val > 0 && val < 1000000) {
        const confidence = i === 2 ? 'medium' : 'low';
        return { value: val, confidence };
      }
    }
  }

  return { value: null, confidence: 'low' };
}

/** Clean a captured amount string into a number. Handles "80", "80.00", "1,200.50", "1 200.50" */
function cleanAmount(raw: string): number | null {
  let cleaned = raw.trim().replace(/\s/g, '');
  // If there are both commas and dots, treat last one as decimal separator
  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  if (lastComma > lastDot) {
    // Comma is the decimal separator (European style): 1.200,50
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    // Dot is the decimal separator: 1,200.50
    cleaned = cleaned.replace(/,/g, '');
  } else {
    // Only one or neither — just remove commas
    cleaned = cleaned.replace(/,/g, '.');
  }

  // Handle trailing dot (e.g. "80.")
  if (cleaned.endsWith('.')) cleaned = cleaned.slice(0, -1);

  const val = parseFloat(cleaned);
  return isNaN(val) ? null : Math.round(val * 100) / 100;
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

const SKIP_KEYWORDS = ['total', 'subtotal', 'sub total', 'grand total', 'change', 'cash', 'card', 'vat', 'tax', 'balance', 'payment', 'tendered', 'amount due', 'rounding'];

function extractLineItems(lines: string[]): LineItem[] {
  const items: LineItem[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (SKIP_KEYWORDS.some(kw => lower.includes(kw))) continue;
    if (line.length < 4) continue;
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(line)) continue;
    if (/^(tel|phone|fax|vat|tax|addr)/i.test(line)) continue;

    let match: RegExpMatchArray | null;

    // "description R amount" or "description ZAR amount" — with or without decimals
    // e.g. "2L WATER R50.00", "BREAD R8", "MILK R12.50"
    match = line.match(/^(.+?)\s+(?:R|ZAR)\s*(\d+(?:[.,]\d{1,2})?)\s*$/i);
    if (match && match[1].trim().length >= 2) {
      const amt = cleanAmount(match[2]);
      items.push({ name: match[1].trim(), amount: amt, raw: line });
      continue;
    }

    // "R amount description" — e.g. "R 25.00 MILK" or "R8 BREAD"
    match = line.match(/^(?:R|ZAR)\s*(\d+(?:[.,]\d{1,2})?)\s+(.+)$/i);
    if (match && match[2].trim().length >= 2) {
      const amt = cleanAmount(match[1]);
      items.push({ name: match[2].trim(), amount: amt, raw: line });
      continue;
    }

    // "description amount" (number at end, no currency symbol) — require decimal for safety
    match = line.match(/^(.{3,}?)\s+(\d+[.,]\d{2})\s*$/);
    if (match) {
      const name = match[1].trim();
      if (/[a-zA-Z]/.test(name)) {
        const amt = cleanAmount(match[2]);
        items.push({ name, amount: amt, raw: line });
        continue;
      }
    }

    // "qty x description amount" — e.g. "2 x BREAD 25.00"
    match = line.match(/^(\d+)\s*[xX]\s+(.+?)\s+(?:R?\s*)?(\d+(?:[.,]\d{1,2})?)\s*$/);
    if (match && match[2].trim().length >= 2) {
      const amt = cleanAmount(match[3]);
      const qty = parseInt(match[1]);
      const name = qty > 1 ? `${qty}x ${match[2].trim()}` : match[2].trim();
      items.push({ name, amount: amt, raw: line });
      continue;
    }
  }

  return items;
}

export function generateDescription(storeName: string, lineItems: LineItem[]): string {
  if (lineItems.length === 0) return storeName;
  const itemSummaries = lineItems.slice(0, 5).map(item =>
    item.amount ? `${item.name} (R${item.amount.toFixed(2)})` : item.name
  );
  const suffix = lineItems.length > 5 ? `, +${lineItems.length - 5} more` : '';
  return `${storeName}: ${itemSummaries.join(', ')}${suffix}`;
}
