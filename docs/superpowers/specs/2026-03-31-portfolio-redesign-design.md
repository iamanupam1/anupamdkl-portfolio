# Portfolio Redesign — Design Spec

## Overview

Redesign of Anupam's portfolio site. Replace GSAP with Motion for animations, restructure page layout, and elevate the visual design toward a bold + atmospheric creative showcase aesthetic.

## Animation Library

**Remove**: `gsap` package (including ScrollTrigger plugin) — ~47KB gzipped.

**Add**: `motion` package — ~16KB gzipped.

Motion API surface used:

- `animate()` — entrance animations, hover effects, cursor spring physics
- `scroll()` — scroll-linked progress animations (replaces ScrollTrigger scrub)
- `inView()` — trigger animations when elements enter viewport (replaces ScrollTrigger enter/leave)
- `spring` easing — organic, physical motion for cursor, hover states, and entrance reveals
- `stagger` — sequential entrance animations for lists (project cards, blog cards, nav links)

Constellation canvas and particle effects remain vanilla JS/CSS — no library needed for those.

## Page Structure

Top to bottom, single page:

1. **Nav** (fixed)
2. **Hero** (full viewport)
3. **Projects** (full-width alternating)
4. **About + Blog** (interleaved section)
5. **Contact** (social links)

### 1. Nav

Fixed position, transparent on top, blurs on scroll past hero. Same behavior as current.

- Logo left ("ANUPAM"), links right (Work, Blog, About, Contact)
- Mobile: hamburger menu with full-screen overlay
- Scroll detection via Motion's `scroll()` instead of ScrollTrigger

### 2. Hero — Typography-Driven

Full viewport height. The text is the centerpiece.

**Layout:**
- Centered content: label ("Full-Stack Engineer"), oversized title ("Building digital experiences"), divider line, subtitle ("Crafting code that feels alive")
- Title font-size: `clamp(40px, 8vw, 80px)`, weight 200, accent word ("experiences") weight 700 with gradient text fill (indigo → purple → pink)

**Atmospheric effects (all CSS, no JS):**
- 3 radial gradient blurs that drift slowly via `@keyframes` (8-12s cycles, alternating)
- Noise texture overlay at low opacity (SVG filter, same as current)
- 5-8 floating particle dots via CSS animations (varying sizes, colors from palette, different durations)

**Motion entrance animation:**
- Staggered reveal: label fades up → title words slide up with stagger → divider scales in → subtitle fades up → nav links fade in
- Spring easing on text reveals for physical feel
- Scroll-linked: hero content parallaxes up and fades out as user scrolls past

### 3. Projects — Full-Width Alternating

Each project spans full width. Image/visual on one side, details on the other, alternating left/right per project.

**Layout per project row:**
- Two-column grid: 60% image area, 40% details area
- Odd projects: image left, details right
- Even projects: details left, image right
- Image area: gradient background (per project), placeholder text until real screenshots are added
- Details area: tag label, title, summary paragraph, tech stack pills, links (Live Demo, GitHub)

**Hover interactions:**
- Image area: subtle scale (1.02) and parallax tilt via CSS transform
- Gradient color shift on hover
- All links visible at all times — no overlay/modal

**Motion animations:**
- Each project row animates in via `inView()` — slides in from its image side (left projects from left, right projects from right)
- Spring easing, staggered timing between rows
- Image and text content animate separately for layered depth

**Mobile (< 768px):**
- Stack to single column: image on top, details below
- All projects stack the same way (no alternating needed)

### 4. About + Blog — Interleaved Section

One continuous section that weaves personal narrative with blog content.

**About portion:**
- Section label ("About") + title ("A bit about me")
- Two conversational paragraphs — who you are, what drives you, how you think about craft
- Stats grid (2x2): Years Experience, Projects Shipped, Technologies, Curiosity
- Stats animate counting up on scroll into view via `inView()`

**Blog portion:**
- Follows directly after About content within the same section
- Sub-header: "Thoughts & explorations"
- Blog cards in a 3-column grid (2-column on tablet, 1-column on mobile)
- "View all posts" link button at bottom
- Cards animate in with stagger via `inView()`

**Motion animations:**
- About paragraphs: fade up with stagger
- Stats: fade up with stagger, number count-up animation
- Blog cards: fade up with stagger, triggered when blog grid enters viewport

### 5. Contact — Simple Links

Minimal footer section.

**Layout:**
- Centered row of social/contact links: Email, GitHub, LinkedIn, Twitter/X
- Each link is an icon or text label
- Footer line below: "Designed with intention. Built with care."

**Hover:** Links shift color on hover (muted → accent).

No form, no CTA block.

### 6. Custom Cursor — Dot + Trailing Ring

**Elements:**
- Small dot (6px, white) follows mouse position exactly
- Larger ring (36px diameter, 1.5px indigo border) trails behind with spring physics via Motion's `animate()` with spring easing

**Hover states:**
- On interactive elements (links, buttons, project cards): ring expands to ~52px, border color intensifies
- Transition uses spring easing for organic feel

**Implementation:**
- Track mouse position via `mousemove` listener
- Dot: set position directly (no lag)
- Ring: animate to mouse position using Motion spring — this creates the natural trailing effect
- Apply `cursor: none` to body
- On touch devices: hide both elements entirely, restore default cursor. Detect via `('ontouchstart' in window)` or `pointer: coarse` media query.

**Performance:**
- Use `transform: translate()` for positioning (GPU-accelerated)
- Use `will-change: transform` on both elements

## Color Palette

No changes. Keep current palette:

```
--bg: #0a0a0f
--text-primary: #f1f5f9
--text-muted: #94a3b8
--text-dim: #64748b
--accent: #6366f1 (indigo)
--accent-light: #818cf8
--accent-purple: #a78bfa
--accent-violet: #c084fc
--accent-pink: #f472b6
```

## File Changes

**Remove:**
- `src/scripts/animations.ts` — replaced entirely by new Motion-based animations
- `src/scripts/overlay.ts` — no more overlay/modal
- `src/components/ProjectOverlay.astro` — removed
- `src/components/Constellation.astro` — removed (hero particles and gradient blurs replace this)
- `src/scripts/constellation.ts` — removed

**Modify:**
- `package.json` — remove `gsap`, add `motion`
- `src/pages/index.astro` — updated imports and script block
- `src/layouts/Layout.astro` — add cursor elements, update noscript/reduced-motion selectors
- `src/styles/global.css` — add cursor styles, update CSS variables (keep existing additions)
- `src/components/Hero.astro` — keep atmospheric effects, update structure if needed
- `src/components/Projects.astro` — full-width alternating layout
- `src/components/ProjectCard.astro` — redesign for alternating row layout
- `src/components/About.astro` — conversational text, keep stats
- `src/components/Blog.astro` — move under About section flow
- `src/components/BlogCard.astro` — minor style updates
- `src/components/Contact.astro` — social links row instead of plain footer
- `src/components/Nav.astro` — Motion-based scroll detection

**Add:**
- `src/scripts/animations.ts` — new file using Motion API (same name, fully rewritten)
- `src/scripts/cursor.ts` — custom cursor logic

## Accessibility

- Custom cursor: hidden on touch/mobile devices, does not replace native cursor functionality (clicking still works normally)
- Reduced motion: all Motion animations respect `prefers-reduced-motion` — set elements to final state without animation
- Noscript: all content visible with `opacity: 1` and `transform: none`
- Keyboard navigation: focus-visible outlines maintained on all interactive elements
- Project links: always visible (no hidden-behind-hover), proper `<a>` tags with descriptive text
- Semantic HTML: sections use proper heading hierarchy, nav uses `<nav>`, projects use `<article>`

## Browser Support

- Motion supports all modern browsers (Chrome 80+, Firefox 80+, Safari 14+, Edge 80+)
- CSS `backdrop-filter` for nav: prefixed with `-webkit-backdrop-filter` for Safari
- `clamp()` for responsive type: supported in all target browsers
- Custom cursor: graceful degradation — if JS fails, native cursor remains functional
