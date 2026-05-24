# GRIZZLY Energy — Design System

## Concept
Full-screen immersive 3D drink slider. Each flavor owns the screen — full bleed background color, giant italic name text BEHIND the floating can, floating fruit/ingredient elements, dramatic entry animations on slide change.

## Layout
- Landscape / wide format — 100vw × 100vh hero
- Horizontal scroll feeling with vertical page sections below
- Nav: minimal, top center, white text

## Color Palette (per flavor)
- Sour Gummy Bear: `#FF6B35` (amber-orange) bg → warm tangerine gradient
- Strawberry Kiwi: `#E8175D` (crimson pink) bg → deep rose gradient
- Orange Mango: `#FF9500` (golden amber) bg → warm sunshine gradient
- Rocket Pop: `#1A3A6B` (deep navy) bg → electric blue gradient

## Global Colors
- Base dark: `#0A0A0A`
- Off-white: `#F5F0E8`
- Accent gold: `#D4A847`
- Text on dark: `#FFFFFF`

## Typography
- Display: "Oswald" or "Barlow Condensed" — ultra bold italic, massive scale
- Body: "Inter" — clean, slightly condensed
- Flavor name behind can: 20-30vw font size, italic, semi-transparent

## Motion
- Slider transition: background color morphs, can zooms from below, text slides across
- Floating ingredients: CSS keyframe float + rotation, staggered
- Scroll sections: fade-up with framer-motion
- Hover: scale + glow on can, magnetic buttons

## Sections
1. Hero slider (full screen, flavor rotator)
2. Brand story (full width dark section)
3. Features/benefits (horizontal scrolling cards)
4. Social proof logos
5. Testimonials
6. Pricing
7. Footer
