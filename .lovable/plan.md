

## Enhance Auto-Category Detection on Receipt Scanner

### Current State
The receipt parser already has a `determineCategory` function with keyword matching, and the UI already sets the category from the scan result. However, the keyword lists could be expanded and the detected category could be displayed more prominently in the scanner UI so users immediately see what category was auto-detected.

### Changes

**1. Expand category keywords (`src/utils/receiptParser.ts`)**
- Add more South African-relevant keywords:
  - **transport**: "petrol station", "total energies", "astron", "e-toll", "gautrain", "prasa", "metrorail"
  - **education**: "study", "tuition", "wits", "uct", "unisa", "tut", "uj", "nsfas", "bursary", "exam", "semester"
  - **groceries**: "bakery", "butchery", "meat", "dairy", "fresh", "frozen", "household"
  - **health**: "script", "prescription", "vitamins", "supplement"
  - **utilities**: "prepaid", "eskom", "municipality", "rates"
  - **clothing**: "sportscene", "totalsports", "markham", "jet", "woolworths fashion"
  - **entertainment**: "spotify", "apple music", "youtube", "gaming"
- Add a **fuel/petrol** sub-detection: if text contains "litre", "l/price", "pump", "fuel levy" → transport with high confidence

**2. Show detected category prominently in scanner UI (`src/pages/DigitalReceipt.tsx`)**
- After scan completes, display a colored category chip/banner above the form showing the auto-detected category with its emoji (e.g., "🚗 Transport" or "🛒 Groceries")
- If confidence is high, show a green accent; if medium/low, show amber with "Tap to change" hint
- This makes it immediately clear what category the expense will be saved under

**3. Ensure category passes through to Expenses page correctly**
- Already working via `addExpense` — just verify the category field is included in the `handleSaveExpense` call (it is on line ~180)

### Summary
Mostly a data/keyword expansion in the parser plus a small UI enhancement to make the auto-detected category visually prominent. No new dependencies needed.

