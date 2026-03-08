

## Auto Breakdown Toggle for Receipt Scanner

### What Changes

**Add an "Auto Breakdown" switch** (`src/pages/DigitalReceipt.tsx`):
- A `Switch` toggle labeled "Auto Item Breakdown" persisted in `localStorage`, defaulting to **on**
- Place it in the scanner form area, between the Note field and the breakdown section
- When **on**: after scan, auto-populate `lineItems` from parsed results and auto-expand the breakdown (current behavior)
- When **off**: don't auto-populate line items after scan. Instead show a "Show Item Breakdown" collapsible button that lets the user manually add items

**Behavior details**:
- New state: `autoBreakdown` (boolean, persisted in localStorage)
- In `performOCR` success handler (around line 206-209): only set `lineItems` and `setShowBreakdown(true)` if `autoBreakdown` is true
- The collapsible breakdown section remains as-is but its trigger text changes:
  - Auto ON + items detected: "Item Breakdown (auto)" with items pre-filled
  - Auto OFF: "Add Item Breakdown" — opens empty manual entry form

**UI**: Switch component placed inline with a label, compact row style matching the existing form aesthetic.

### Files Modified
- `src/pages/DigitalReceipt.tsx` — add Switch import, `autoBreakdown` state, conditional logic in OCR handler, toggle UI element

