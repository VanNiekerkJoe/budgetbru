

## Mobile-First UX Overhaul Plan

### Problem Summary
The app has rich features but suffers from visual clutter, duplicate headers (MainLayout top bar + page sticky headers), inconsistent spacing, and friction when adding expenses/income. On mobile, content competes for space and key actions are buried.

### Plan

#### 1. Remove duplicate headers on Expenses and Income pages
Both pages render their own sticky `<header>` with summary stats, but MainLayout already has a top bar. This creates a double-header on mobile eating ~120px of viewport. The fix: remove the custom sticky headers from Expenses and Income, and instead show the key stat (total spent / total income) as a compact inline card within the page content flow.

**Files:** `src/pages/Expenses.tsx`, `src/pages/Income.tsx`

#### 2. Add a global Floating Action Button (FAB) for quick add
Place a persistent `+` FAB on the bottom-right (above the navbar) that opens a bottom sheet with two options: "Add Expense" and "Add Income". This gives instant access from any page without navigating.

**Files:** `src/components/layout/MainLayout.tsx` (new FAB component inline or extracted)

#### 3. Streamline the Dashboard (Index page)
- Remove the search bar from the top (move to Activity tab only)
- Combine the greeting + balance card into one compact hero section
- Replace the 4-card quick actions grid with a horizontal scrollable chip row (saves vertical space)
- Remove the Explore tab entirely (it's placeholder content with "Coming soon" toasts)
- Remove the Campus Map preview (it's a heavy component on the homepage)
- Keep: Balance Card, Quick Add, Recent Activity, Category Hubs

**Files:** `src/pages/Index.tsx`

#### 4. Simplify QuickExpenseTracker on Dashboard
The current quick add has category chips that auto-add R20 with one tap (no confirmation), which is confusing. Refactor to: tap category → enter amount → confirm. Keep it to 2 taps max.

**Files:** `src/components/dashboard/QuickExpenseTracker.tsx`

#### 5. Declutter all tab bars
Several pages use 4-tab layouts with icons + text that overflow on small screens. Standardize to text-only tab triggers with smaller font, ensuring they fit on 320px screens. Apply to: Expenses (4 tabs), Income (4 tabs), Savings (4 tabs), IOU (4 tabs), Insights.

**Files:** `src/pages/Expenses.tsx`, `src/pages/Income.tsx`, `src/pages/Savings.tsx`, `src/pages/IOUPage.tsx`, `src/pages/Insights.tsx`

#### 6. Remove ambient background effects for performance
The `ParticleBackground` and per-page animated blur blobs add visual noise and hurt performance on low-end phones. Remove them.

**Files:** `src/App.tsx`, `src/pages/Expenses.tsx`

#### 7. Improve MobileNavbar with a center FAB
Replace the current 5-item (4 + More) layout with: Home | Expenses | **[+ FAB]** | Savings | More. The center button is the primary add action, making it the most prominent element.

**Files:** `src/components/layout/MobileNavbar.tsx`

#### 8. Tighten spacing and typography globally
- Reduce `space-y-6` to `space-y-4` on dashboard
- Set consistent card padding: `p-3` on mobile, `p-4` on desktop
- Cap card border-radius at `rounded-xl` (not `rounded-2xl` or `rounded-3xl`)
- Ensure all text is readable: min 12px body, 14px labels

**Files:** `src/index.css`, `src/pages/Index.tsx`, and each page file

#### 9. Make the "More" bottom sheet cleaner
Current grid is 4-col which is tight. Switch to 3-column with larger touch targets and section headers ("Finance" / "Social").

**Files:** `src/components/layout/MobileNavbar.tsx`

### Technical Details

- No new dependencies needed
- All changes are CSS/JSX restructuring
- The FAB bottom sheet will use `framer-motion` AnimatePresence (already in project)
- Tab triggers will use responsive classes: `text-[11px] sm:text-xs`
- ParticleBackground removal is a simple delete of the component render in App.tsx

### Estimated scope: ~10 files modified, 0 new files

