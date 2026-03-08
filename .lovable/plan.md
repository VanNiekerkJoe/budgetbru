

## Fully Functional Receipt Scanner

### Problem
The current receipt scanner uses random mock data — it doesn't actually read the receipt image. We'll integrate **Tesseract.js** (client-side OCR) to extract real text from receipt photos, then parse that text to detect amounts, store names, dates, and auto-categorize.

### Plan

**1. Add Tesseract.js dependency**
- Install `tesseract.js` for in-browser OCR processing

**2. Create a receipt parsing utility (`src/utils/receiptParser.ts`)**
- Takes raw OCR text and extracts:
  - **Total amount**: regex patterns for "TOTAL", "AMOUNT DUE", "BALANCE", "GRAND TOTAL" followed by numbers (R/ZAR prefix supported)
  - **Store/merchant name**: first non-empty line of the receipt (common receipt format)
  - **Date**: regex for common date formats (DD/MM/YYYY, YYYY-MM-DD, etc.)
  - **Category mapping**: keyword-based — e.g. "Checkers/Pick n Pay/Shoprite" → groceries, "Uber/Bolt" → transport, "pharmacy" → health, etc.
- Returns a typed `ParsedReceipt` object with confidence indicators

**3. Rewrite `DigitalReceipt.tsx` with real OCR flow**
- Replace `simulateReceiptScanning()` with actual Tesseract.js processing
- Show real progress percentage during OCR (Tesseract provides a progress callback)
- Display the extracted raw text in a collapsible section so users can verify
- Pre-fill amount, description, category, and date from parsed results
- Users can still edit any field before saving
- On "Save Expense", calls `addExpense()` which persists to localStorage and flows into dashboard/insights
- Add a "Scanned receipts" history section at the bottom showing past scanned receipts

**4. Enhanced UX**
- Multi-step progress indicator: "Uploading → Recognizing text → Extracting details"
- Confidence badges on parsed fields (green = high confidence, amber = low, needs review)
- Image crop/rotate hint for better results
- Validation before save (amount > 0 required)

### Technical Notes
- Tesseract.js runs entirely client-side — no API keys or backend needed
- First load downloads ~2MB language data (cached after that)
- The `addExpense` call already persists to localStorage and updates all dashboard/insights pages automatically

