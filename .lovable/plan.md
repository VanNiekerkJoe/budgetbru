

## Map UI/UX Improvement Plan

### Current Issues
- The map works but feels basic — limited interactivity, cluttered floating controls, and the detail card/drawer could be more polished
- DiscountFinder uses hardcoded styles (`bg-white`, `dark:bg-gray-800`) instead of design tokens
- No loading state, no empty states for campus view, no quick-access shortcuts
- Category chips and floating buttons feel disconnected from a cohesive design system
- PlaceDetailCard is positioned at `bottom-20` which may overlap with the drawer trigger at `bottom-3`

### Plan

**1. Redesign the top search bar and category filters**
- Add a subtle gradient overlay behind the top controls for readability over any map style
- Make the search bar larger with a frosted glass effect and smooth focus animation
- Redesign category chips as pill-shaped with icons only (expand on tap to show label), saving horizontal space
- Add a "Popular" quick-filter chip that highlights top-rated spots (rating >= 4.3)

**2. Redesign floating controls into a unified control dock**
- Group Exit Map, Map Style, and Locate Me into a single vertical pill on the right side
- Add icon tooltips and a subtle divider between buttons
- Show current map style as an icon instead of a separate label pill (remove the `bottom-18` style label)
- Add a compass/north indicator button that resets map rotation

**3. Upgrade PlaceDetailCard**
- Redesign as a swipeable bottom sheet instead of a floating card — more mobile-native feel
- Add opening hours placeholder (e.g., "Open now" / "Closed"), even as mock data
- Add photo placeholder area with a gradient overlay
- Add tag chips (from the location's `tags` array) for quick context
- Improve action buttons with labels visible (not just icons for Save/Share)

**4. Improve the bottom drawer**
- Add a "Nearby" tab alongside Places and Deals (shows closest 10 POIs with distance)
- Redesign place list items with better visual hierarchy — larger icons, rating stars rendered visually, price level as colored dots
- Add skeleton loading states
- Fix DiscountFinder to use design tokens (`bg-card`, `text-foreground`, `border-border`) instead of hardcoded colors

**5. Add campus view enhancements**
- Show a quick-stats bar when zoomed into a campus: "12 Bars · 8 Restaurants · 5 Cafés" as a horizontal scroll
- Add a "What's popular" section showing top 3 rated spots for that campus
- Animate marker appearance with staggered fade-in when entering campus view

**6. Add a loading/splash state**
- Show a brief skeleton with pulsing map placeholder while Leaflet initializes
- Fade in the map once tiles have loaded

### Files to modify
- `src/pages/Map.tsx` — restructure layout, unified controls, campus stats, loading state
- `src/components/map/MapView.tsx` — add tile load callback, staggered marker animations
- `src/components/map/PlaceDetailCard.tsx` — redesign as bottom sheet with tags, hours, photo area
- `src/components/map/DiscountFinder.tsx` — fix design tokens, visual polish

