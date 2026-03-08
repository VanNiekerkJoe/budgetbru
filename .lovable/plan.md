

# Reinvent the Tutorial: Interactive Guided Tour

## Problem
The current tutorial is a static modal slideshow with 9 text-heavy steps. Users click Next/Previous through walls of text — it's passive, boring, and not connected to the actual UI.

## New Approach: Spotlight Tour Over the Real UI

Replace the modal slideshow with an interactive spotlight/tooltip tour that highlights actual elements on the dashboard. The tutorial will:

1. **Dim the page and spotlight real UI elements** — a cutout overlay highlights the actual balance card, nav buttons, etc.
2. **Show compact tooltip cards** positioned next to the highlighted element
3. **Reduce to 5 focused steps** (not 9 walls of text):
   - Step 1: Balance card — "This is your financial overview"
   - Step 2: Quick nav grid — "Tap any icon to explore features"  
   - Step 3: Quick expense tracker — "Add expenses in seconds"
   - Step 4: Recent activity — "All your transactions appear here"
   - Step 5: Bottom nav — "Navigate the app from here"
4. **Add a pulsing "tap to continue" indicator** and swipe/tap gestures
5. **Animate the spotlight** smoothly between elements using framer-motion

## Technical Plan

### File: `src/components/TutorialGuide.tsx` — Full Rewrite
- Accept no props change (`onComplete`, `onSkip`)
- Each step defines a `targetId` string matching a `data-tutorial` attribute on real UI elements
- On mount, query the DOM for the target element, get its `getBoundingClientRect()`
- Render a full-screen SVG overlay with a transparent cutout around the target element (rounded rect)
- Position a floating tooltip card (above/below the spotlight) with:
  - Step icon + short title (1 line)
  - Brief description (1-2 sentences max)
  - Step dots indicator
  - "Tap to continue" or "Got it!" button
- Animate spotlight position between steps with `motion.div` layout animations
- On last step, button says "Let's Go!" and calls `onComplete`

### File: `src/pages/Index.tsx` — Add `data-tutorial` attributes
- Add `data-tutorial="balance"` to the hero balance card
- Add `data-tutorial="quick-nav"` to the quick nav grid
- Add `data-tutorial="quick-expense"` to the QuickExpenseTracker wrapper
- Add `data-tutorial="recent-activity"` to the recent transactions section
- Add `data-tutorial="bottom-nav"` — this one targets the mobile navbar

### File: `src/components/layout/MobileNavbar.tsx` — Add `data-tutorial` attribute
- Add `data-tutorial="bottom-nav"` to the root nav container

### Key UX Details
- Spotlight has a soft glow/pulse animation around the cutout edge
- Background is darkened at 70% opacity with backdrop-blur
- Tooltip has a small arrow/caret pointing to the spotlighted element
- Step dots at the bottom of the tooltip show progress
- Keyboard/tap anywhere on the overlay advances to next step
- Skip button (X) in the tooltip corner to dismiss

