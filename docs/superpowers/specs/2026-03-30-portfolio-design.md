# Portfolio Website — Design Spec

A cinematic, animation-driven single-page portfolio for a full-stack software engineer. Built as a personal expression site — not a resume or job-hunting tool.

## Tech Stack

- **Framework:** Astro (static site, islands architecture)
- **Animation:** GSAP + ScrollTrigger (free for personal use)
- **Styling:** CSS (scoped Astro styles), no CSS framework
- **Deployment:** Static output, host-agnostic

## Structure

Single page with four sections: Hero, Projects, About, Contact. No routing — smooth scroll between sections. One interactive overlay for project details.

---

## Section 1: Hero

Full-viewport cinematic landing. Sets the mood immediately.

### Layout

- Full-screen dark background (`#0a0a0f`) with animated radial gradient (purple/indigo shifts)
- Floating particle field: 20-30 small glowing dots drifting upward
- Faint grid overlay for depth (CSS `background-image` with thin lines)
- Nav: logo left, links right (Work, About, Contact) — transparent on hero
- Centered content stack: role label → name/tagline → divider → subtitle
- Scroll indicator at bottom (pulsing mouse/arrow icon)

### Animation Sequence (GSAP timeline, plays on page load)

1. Background gradient fades in (0.5s)
2. Particles begin floating (staggered start)
3. Role label fades up from below
4. Main title: word-by-word slide up with stagger
5. Accent word gets gradient text shimmer animation
6. Divider line draws from center outward
7. Subtitle fades up
8. Nav links fade in from right
9. Scroll indicator begins pulse

### Scroll Behavior

- Hero content parallaxes upward faster than background (depth illusion)
- Particles slow and fade as user scrolls past hero

---

## Section 2: Projects

The main showcase. Interactive cards that expand into detail overlays.

### Layout

- Section label ("Selected Work") + title ("Things I've built")
- Grid: 2 columns on desktop, 1 on mobile
- 3-4 project cards, each containing: preview image/gradient, project tag, title, one-line description

### Card Interactions

- **Scroll reveal:** Cards stagger in with fade-up as they enter viewport (GSAP ScrollTrigger)
- **Hover:** Card lifts (`translateY(-4px)`), border glows indigo, shadow expands
- **Click:** Opens project detail overlay

### Project Detail Overlay

- **Open animation:** Card morphs/scales to fill viewport (GSAP)
- **Backdrop:** Blur effect on content behind
- **Content:** Hero image, project title, description paragraph, tech stack tags, links (live demo, GitHub)
- **Close:** Button top-right + ESC key support
- **Close animation:** Reverse morph back to card position
- **Mobile:** Full-screen overlay with swipe-to-close support

---

## Section 3: About

Short, personality-driven. Not a resume.

### Layout

- Two columns: bio text left, abstract visual right
- Left: 2-3 casual paragraphs about who he is and what drives him. Resume download button below the text.
- Right: Constellation visual — a network of small glowing dots connected by faint lines, forming an abstract geometric shape. Dots pulse softly at different rates.
- Resume button: outline style with subtle indigo glow, download icon

### Animation (GSAP ScrollTrigger)

- Section fades in on viewport entry
- Bio text reveals with soft upward stagger (line by line or paragraph by paragraph)
- Right-side visual assembles itself (dots connect into constellation)
- Resume button fades in last

### Tone

Casual and personal. No stats counters, no "years of experience" grids. Tech stack is shown through projects, not listed here.

---

## Section 4: Contact

Minimal, centered closer.

### Layout

- Section label + short line ("Let's connect" or "Say hello")
- Row of social/contact links: Email, GitHub, LinkedIn
- Each link: pill/ghost button style with glow on hover
- Footer line: small text tagline at the very bottom

### Animation (GSAP ScrollTrigger)

- Title fades up
- Contact links stagger in from below
- Glow pulse on hover per link
- Footer fades in last

### No Contact Form

Direct links to email and socials only. No form — avoids backend complexity, spam, and low usage.

---

## Global Design

### Navigation

- Fixed/sticky, follows scroll
- Transparent over hero, gains dark blur background (`backdrop-filter: blur`) once past hero section
- Smooth scroll to sections on click

### Page Load

- Brief dark screen → hero animation sequence plays
- Avoids flash of unstyled content

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0a0a0f` | Page background |
| `text-primary` | `#f1f5f9` | Headings, primary text |
| `text-muted` | `#94a3b8` | Labels, secondary text |
| `text-dim` | `#64748b` | Subtle text, descriptions |
| `accent-start` | `#818cf8` | Gradient start, glows |
| `accent-end` | `#c084fc` | Gradient end |
| `border-subtle` | `rgba(255,255,255,0.06)` | Card borders, dividers |

### Typography

- **Font:** Inter (or similar clean sans-serif)
- **Hero heading:** weight 200-300, `clamp(40px, 8vw, 80px)`
- **Section titles:** weight 300, 36px
- **Body:** weight 400, 14-16px
- **Labels:** weight 400, 10-12px, letter-spacing 2-4px, uppercase

### Animation Principles

- Consistent easing: cubic-bezier for cinematic weight (no linear or default ease)
- ScrollTrigger for all section reveals
- Stagger patterns: 0.1-0.15s between elements
- Duration: 0.6-1s for reveals, 0.3-0.4s for interactions
- `prefers-reduced-motion` media query disables all animations for accessibility

### Responsive

- Desktop-first, fully responsive
- Mobile: single column, reduced particle count (10-15), touch-friendly targets
- Overlay goes full-screen on mobile
- Nav collapses to hamburger on small screens

### Performance

- Astro ships zero JS by default — GSAP loads as an island
- Lazy load project images
- Particles: CSS animations where possible, JS only for complex motion
- Static site output — fast on any CDN
