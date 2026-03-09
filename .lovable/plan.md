

## Redesign the Intro (Welcome Animation + Auth Page)

The current intro has two parts: a splash animation (`WelcomeAnimation.tsx`) and the auth page (`Auth.tsx`). The splash is decent but feels generic, and the auth page is plain. Here is the plan to elevate both.

### 1. Redesign WelcomeAnimation.tsx

**Current issues:** The 3-phase approach feels slow (3.5s total), floating symbols are barely visible, pulsing rings are generic.

**New design:**
- Single dramatic entrance: The "B" logo drops in with a coin-flip/3D rotation effect, then the full "BudgetBru" wordmark reveals with a staggered letter animation
- Replace faint floating symbols with a few bold, colorful Rand (R) coins that float up and fade, using the brand colors (pink, teal, indigo)
- Add a subtle mesh gradient background that shifts colors
- Tagline fades in as a single unit with a blur-to-sharp effect instead of character-by-character typewriter
- Reduce total duration to ~2.8s for snappier feel
- Smoother exit: blur + scale out instead of just opacity

### 2. Redesign Auth.tsx

**Current issues:** Very basic card layout, minimal branding presence, no visual flair.

**New design:**
- Split the page into a left hero panel (desktop) / top section (mobile) with branding and a right panel with the auth form
- Hero section: Large gradient background matching the brand palette, animated "BudgetBru" logo, tagline "You must budget, bru!", and 3 small feature highlights (Track expenses, Save smarter, Budget together) with icons
- Auth card: Glass-morphism styling (backdrop-blur, semi-transparent background), slightly larger with better spacing
- Add a subtle animated gradient orb behind the form
- Mobile: Stack vertically with a compact hero above the form
- Keep all existing auth logic (login, signup, forgot password, OAuth) unchanged

### Files to modify
- `src/components/WelcomeAnimation.tsx` -- full rewrite of animation
- `src/pages/Auth.tsx` -- redesign layout and styling

### Technical notes
- Uses existing framer-motion dependency
- Uses existing brand colors from CSS variables and theme classes
- No new dependencies needed
- All auth logic (handlers, state, OAuth) stays identical

