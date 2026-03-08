

# Develop the Full South Africa Campus Map

## Overview
Rebuild the map page into a fully-featured, South Africa-wide interactive map with real campus locations, points of interest, category filtering, search, and a polished mobile-first UI.

## What Changes

### 1. Rich SA-Wide Location Data (`src/data/mapLocations.ts` — new file)
- Define comprehensive marker data covering major SA universities and surrounding student hotspots:
  - **Universities**: UJ, Wits, UCT, Stellenbosch, UP (Tuks), UKZN, UFS, NWU, Rhodes, TUT, CPUT, DUT, etc.
  - **Student Hotspots**: Budget-friendly restaurants, study cafes, gyms, entertainment venues near each campus
  - **Discount Partners**: Stores/restaurants offering student discounts
- Each marker gets: `id, name, lat, lng, type, category, address, rating, priceLevel, openNow, imageUrl, tags[]`
- Expanded type system: `'university' | 'food' | 'cafe' | 'gym' | 'entertainment' | 'shopping' | 'transport' | 'accommodation' | 'library' | 'discount'`

### 2. Redesigned Map Page (`src/pages/Map.tsx`)
- **Full-screen map** with no padding — edge-to-edge Mapbox
- **Top search bar**: Glassmorphism search input with location autocomplete
- **Category filter chips**: Horizontal scrollable row below search (Universities, Food, Cafes, Gyms, Deals, etc.) with colored icons
- **Bottom sheet**: Swipeable bottom drawer (using `vaul` Drawer) showing nearby places list — replaces the old tab system
- **Map style toggle**: Cycle through street/satellite/dark via a floating button
- **Locate me button**: Floating GPS button in bottom-right
- Remove the old NavBar from this page — use MainLayout's nav instead

### 3. Rebuilt MapView Component (`src/components/map/MapView.tsx`)
- Center on South Africa (`[25.0, -29.0]`, zoom 5) by default
- **Custom marker rendering**: Use inline SVG markers with category-specific colors and icons instead of generic pin SVGs
- **Cluster markers**: Group nearby markers at low zoom levels using Mapbox's built-in clustering (GeoJSON source with cluster properties)
- **Fly-to animation** when selecting a location from search or list
- **Selected marker popup**: Styled card popup with name, rating, distance, price level
- Remove the Mapbox token input field (keep the hardcoded demo token)
- Proper cleanup of markers on unmount

### 4. Place Detail Card (`src/components/map/PlaceDetailCard.tsx` — new)
- Slides up when a marker is tapped
- Shows: place name, category badge, rating stars, address, distance from user, opening status, "Get Directions" button (opens Google Maps), "Save" bookmark button
- Animated with framer-motion

### 5. Search & Filter Logic
- Client-side fuzzy search across place names, categories, and tags
- Category filter chips toggle markers on/off on the map
- "Near Me" sort option when geolocation is available

### 6. Discount Finder Integration
- Keep DiscountFinder as a tab within the bottom drawer
- Update discount coordinates to real SA locations

## Technical Details
- Map default center: `[25.0, -29.0]` (center of SA), zoom 5
- Use `vaul` Drawer for the bottom sheet (already installed)
- Marker colors: University=#9b87f5, Food=#FF9F40, Cafe=#F97316, Gym=#4BC0C0, Entertainment=#EC4899, Shopping=#8B5CF6, Transport=#06B6D4, Discount=#EF4444
- GeoJSON clustering via `map.addSource` with `cluster: true` for performance at country-wide zoom
- Files modified: `Map.tsx`, `MapView.tsx`
- Files created: `src/data/mapLocations.ts`, `src/components/map/PlaceDetailCard.tsx`

