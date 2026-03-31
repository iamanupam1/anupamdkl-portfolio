# About & Contact Section Redesign

## Summary

Redesign the About and Contact sections of the portfolio to increase visual impact and match the atmospheric energy of the hero section. Both remain as separate sections.

## Current State

- **About**: Two-column grid — constellation canvas on left, bio text + resume button on right. Flat dark background, no visual weight on the left panel. The constellation floats in empty space.
- **Contact**: Centered layout with "Say hello" heading and horizontal pill-shaped links (Email, GitHub, LinkedIn). Flat dark background, no atmospheric treatment. Feels like a footnote.

## Design: About Section — Split Panel with Stats

### Layout

- Two-column split: left panel (45%) and right panel (55%)
- Left panel has a tinted background (`linear-gradient(160deg, rgba(124,106,239,0.07), rgba(167,139,250,0.03))`) with a subtle right border (`1px solid rgba(124,106,239,0.08)`)
- A radial glow inside the left panel: `radial-gradient(ellipse at 50% 40%, rgba(124,106,239,0.1) 0%, transparent 70%)`
- Constellation canvas fills the upper ~70% of the left panel
- Stats row sits at the bottom of the left panel

### Stats Row

- Three stat items separated by vertical gradient dividers
- Each stat: large number (font-display, ~36px, bold, text-primary) + small label (11px, uppercase, letter-spacing, text-dim)
- Dividers: `1px wide, linear-gradient(to bottom, transparent, rgba(124,106,239,0.2), transparent)`
- Default stats: "5+" / Years Exp. — "20+" / Projects — "∞" / Curiosity
- Stats should be easily editable in the component (not hardcoded deep in markup)

### Right Panel

- Unchanged structurally: section-label → section-title → gradient divider → paragraphs → resume button
- Same typography, spacing, and animation behavior as current

### Mobile (≤768px)

- Single column stack: text content first (order 1), then constellation + stats below (order 2)
- On mobile, the constellation + stats area becomes a rounded card with the tinted background and a subtle border — visually distinct from the flat background
- Constellation height: 200px on mobile (down from filling the left panel)
- Stats row below the constellation inside the same card

### Animations

- Existing GSAP scroll-triggered animations for paragraphs and resume button remain unchanged
- Stats row: staggered fade-up on scroll trigger, same pattern as paragraph animations

## Design: Contact Section — Atmospheric with Tile Links

### Layout

- Centered layout (same as current) but with atmospheric background treatment
- Max-width container for content, but atmospheric effects (gradients, orbs) extend full-width

### Atmospheric Background

- Gradient divider line across the top of the section: `linear-gradient(90deg, transparent, rgba(124,106,239,0.3), rgba(232,121,168,0.2), transparent)` — positioned with 15% inset from each side
- Radial gradients: `radial-gradient(ellipse at 50% 70%, rgba(124,106,239,0.18) 0%, transparent 55%)` and `radial-gradient(ellipse at 30% 20%, rgba(232,121,168,0.06) 0%, transparent 40%)`
- 3 floating orbs (same style as hero): positioned absolute, large blurred circles with subtle accent colors, using the existing `orbFloat` animation from the hero

### Content

- Section label: "Get in Touch" (same style as current)
- Title: "Say" / "hello" (hello in gradient italic, same as current)
- Subtitle: "Always open to interesting conversations and collaborations." (same as current)

### Tile Links (replacing pill links)

- 3 tiles in a horizontal flex row with gap
- Each tile: ~120px wide, padded (20px 16px), rounded corners (16px), border (1px solid rgba(255,255,255,0.06)), background (rgba(255,255,255,0.02))
- Inside each tile: icon in a circle (36px, accent-colored border + background) centered above a label (14px, font-weight 500)
- Icons: use the existing SVG icons from the current contact links
- Hover state: gradient background fill appears (`linear-gradient(135deg, rgba(124,106,239,0.08), rgba(232,121,168,0.05))`), border glows (`border-glow`), slight lift (`translateY(-3px)`), box-shadow glow

### Footer

- Footer text "Designed with intention. Built with care." is integrated into the contact section at the bottom
- No separate `<footer>` element with border-top
- Same styling: 12px, text-dim, letter-spacing, weight 300

### Mobile (≤768px)

- Tiles stay horizontal in a row (flex-wrap if needed), each tile shrinks proportionally
- Orbs hidden on mobile (same as hero orbs)
- Radial gradients remain but at reduced intensity
- Footer text remains at the bottom of the section

### Animations

- Existing GSAP timeline for contact section remains: title → subtitle → links stagger
- Floating orbs use CSS animation (same `orbFloat` keyframes from hero)
- Tiles animate in with the same stagger pattern as the current pill links

## Nav Link Updates

- Both "About" (`#about`) and "Contact" (`#contact`) nav links remain, pointing to their respective sections
- No changes to navigation structure

## Files to Modify

- `src/components/About.astro` — new split panel layout with stats
- `src/components/Contact.astro` — atmospheric background, tile links, integrated footer
- `src/scripts/animations.ts` — add stats animation in `initAboutAnimations`
- `src/styles/global.css` — extract `orbFloat` keyframes from Hero.astro scoped styles to global so both Hero and Contact can use them

## Files to Remove

- None

## Out of Scope

- Content changes (placeholder text stays as-is)
- Blog pages
- Hero, Projects, or Blog sections
- Nav component changes beyond what's already been fixed
