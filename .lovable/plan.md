

## Add Line-Item Breakdown to Receipt Scanner

### What
Extract individual line items from receipt OCR text (e.g., "2L Water R50.00", "Petrol R100.00") and display them as an itemized breakdown. The description field will be auto-populated with a formatted summary of all items.

### Changes

**1. `src/utils/receiptParser.ts`**
- Add a new `LineItem` type: `{ name: string; amount: number | null; raw: string }`
- Add `lineItems: LineItem[]` to the `ParsedReceipt` interface
- New `extractLineItems(lines)` function that scans each line for patterns like:
  - `description R amount` or `R amount description`
  - `description amount.00` (number at end of line)
  - Skip lines containing "total", "subtotal", "change", "cash", "vat", "tax"
- Returns array of parsed items with name and amount

**2. `src/pages/DigitalReceipt.tsx`**
- After scan completes, display a "Receipt Breakdown" section showing each extracted line item in a list (item name + amount)
- Auto-generate the description field as a summary, e.g.: "Checkers: 2L Water (R50), Petrol (R100), ..."
- Users can still edit the description manually
- Each line item shown with a small pill/row: item name on left, amount on right

### Technical Notes
- Line-item parsing is best-effort since OCR text varies wildly — we show what we can detect
- The description auto-fill combines store name + top items for a useful expense label
- No new dependencies needed

