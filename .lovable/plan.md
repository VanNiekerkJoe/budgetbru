

# Reinvent the BudgetBru Intro Animation

## Current State
The current welcome animation is basic: a static gradient background, the LogoBadge scales in, text fades up, and a pink progress bar fills across the bottom. It lasts 2.5 seconds and feels generic.

## Plan

### New Intro Concept: "Money in Motion"
A cinematic 3.5-second splash screen with three phases:

**Phase 1 (0-1s): The Coin Drop**
- Dark background with a subtle radial gradient pulse
- Animated floating Rand signs (R) and coin circles drift upward like bubbles, using staggered framer-motion animations
- A glowing "B" letter drops into center with a spring bounce

**Phase 2 (1-2.2s): Brand Reveal**
- The "B" expands into the full "BudgetBru" wordmark, letters animate in with a wave/stagger effect
- Each letter section gets its brand color (pink, indigo, teal) with a shimmer sweep across the text
- Tagline "You must budget, bru!" types in with a typewriter effect
- Concentric rings pulse outward from the logo

**Phase 3 (2.2-3.5s): Exit**
- Everything scales up slightly and fades, creating a "zoom through" feeling into the app
- Background transitions from dark to match the app's background color for seamless handoff

### Technical Approach
- **File modified**: `src/components/WelcomeAnimation.tsx` (full rewrite)
- **No new dependencies** -- pure framer-motion + CSS
- Floating symbols rendered as an array of `motion.div` elements with randomized positions, delays, and speeds
- Shimmer effect via a CSS `@keyframes` gradient sweep on the text
- Phase sequencing via framer-motion's `delay` prop and state transitions
- Duration extended from 2.5s to 3.5s in the timeout, exit animation unchanged
- `App.tsx` unchanged (session-based show-once logic stays)

### Key Visual Elements
- Dark navy/indigo gradient background (`from-[#0a0e27] via-[#1a1f4e] to-[#0d1233]`)
- 12-15 floating financial symbols (R, coins, chart icons) as subtle background particles
- Glowing/neon effect on the "B" using box-shadow and text-shadow
- CSS shimmer gradient sweep across the wordmark
- Smooth typewriter effect for the tagline
- Pulsing ring animation emanating from center

