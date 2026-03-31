# About & Contact Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the About section as a split panel with stats and the Contact section with atmospheric background and tile links.

**Architecture:** About gets a tinted left panel (constellation + stats) with text on the right. Contact gets floating orbs, radial gradients, and tile-style links replacing pills. The `orbFloat` keyframes move to global CSS so both Hero and Contact can use them. Footer is absorbed into Contact.

**Tech Stack:** Astro components, CSS, GSAP (animations.ts)

---

### Task 1: Extract orbFloat keyframes to global CSS

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Add orbFloat keyframes to global.css**

Add at the end of `src/styles/global.css`, before the closing (after the `::selection` block):

```css
/* Shared orb animation */
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -20px) scale(1.05); }
  50% { transform: translate(-20px, 15px) scale(0.95); }
  75% { transform: translate(15px, 25px) scale(1.02); }
}
```

- [ ] **Step 2: Remove orbFloat keyframes from Hero.astro**

In `src/components/Hero.astro`, delete the `@keyframes orbFloat` block (lines 84–89 in the `<style>` section):

```css
  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -20px) scale(1.05); }
    50% { transform: translate(-20px, 15px) scale(0.95); }
    75% { transform: translate(15px, 25px) scale(1.02); }
  }
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Clean build, no errors. The hero orb animation still works because `orbFloat` is now global.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/components/Hero.astro
git commit -m "refactor: extract orbFloat keyframes to global CSS"
```

---

### Task 2: Redesign About section — split panel with stats

**Files:**
- Modify: `src/components/About.astro`

- [ ] **Step 1: Replace the About.astro HTML structure**

Replace the entire HTML (lines 1–30) of `src/components/About.astro` with:

```astro
---
import Constellation from './Constellation.astro';

const stats = [
  { value: '5+', label: 'Years Exp.' },
  { value: '20+', label: 'Projects' },
  { value: '∞', label: 'Curiosity' },
];
---

<section class="about-section" id="about">
  <div class="about-layout">
    <div class="about-visual-col">
      <div class="about-visual">
        <Constellation />
      </div>
      <div class="about-stats">
        {stats.map((stat, i) => (
          <>
            {i > 0 && <div class="about-stat-divider"></div>}
            <div class="about-stat">
              <span class="about-stat-value">{stat.value}</span>
              <span class="about-stat-label">{stat.label}</span>
            </div>
          </>
        ))}
      </div>
    </div>
    <div class="about-text-col">
      <span class="section-label">About</span>
      <h2 class="section-title">A bit<br />about me</h2>
      <div class="about-divider"></div>
      <p class="about-paragraph">
        I'm a full-stack engineer who believes great software is equal parts engineering and artistry. I care deeply about the details — from pixel-perfect interfaces to well-architected backends.
      </p>
      <p class="about-paragraph">
        When I'm not coding, you'll find me exploring new technologies, contributing to open source, or experimenting with creative coding.
      </p>
      <a href="/resume.pdf" download class="resume-button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2v9m0 0L5 8m3 3l3-3M3 13h10" />
        </svg>
        Download Resume
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Replace the About.astro styles**

Replace the entire `<style>` block of `src/components/About.astro` with:

```css
<style>
  .about-section {
    padding: var(--section-padding);
    position: relative;
    max-width: var(--max-width);
    margin: 0 auto;
  }

  .about-layout {
    display: grid;
    grid-template-columns: 0.45fr 0.55fr;
    gap: 0;
    align-items: stretch;
  }

  .about-visual-col {
    position: relative;
    background: linear-gradient(160deg, rgba(124, 106, 239, 0.07) 0%, rgba(167, 139, 250, 0.03) 100%);
    border-right: 1px solid rgba(124, 106, 239, 0.08);
    border-radius: 20px 0 0 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .about-visual-col::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(124, 106, 239, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .about-visual {
    flex: 1;
    position: relative;
    z-index: 1;
    min-height: 320px;
  }

  .about-stats {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    padding: 28px 20px;
    border-top: 1px solid rgba(124, 106, 239, 0.06);
  }

  .about-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    opacity: 0;
  }

  .about-stat-value {
    font-family: var(--font-display);
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  .about-stat-label {
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--text-dim);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 400;
  }

  .about-stat-divider {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, rgba(124, 106, 239, 0.2), transparent);
  }

  .about-text-col {
    position: relative;
    padding: 60px 0 60px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .section-label {
    display: block;
    font-family: var(--font-body);
    color: var(--accent-start);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 400;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 44px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.5px;
    margin-bottom: 0;
  }

  .about-divider {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, var(--accent-start), var(--accent-end));
    margin: 28px 0;
    border-radius: 1px;
  }

  .about-paragraph {
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.8;
    margin-bottom: 18px;
    opacity: 0;
    font-weight: 300;
  }

  .resume-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 12px 24px;
    border: 1px solid rgba(124, 106, 239, 0.25);
    border-radius: 8px;
    color: var(--accent-start);
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.5px;
    transition: all 0.4s var(--ease-cinematic);
    opacity: 0;
  }

  .resume-button:hover {
    border-color: var(--accent-start);
    box-shadow: 0 0 24px rgba(124, 106, 239, 0.15);
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .about-section {
      padding: var(--section-padding-mobile);
    }

    .about-layout {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .about-visual-col {
      order: 2;
      border-right: none;
      border-radius: 16px;
      border: 1px solid rgba(124, 106, 239, 0.08);
    }

    .about-visual {
      min-height: 200px;
    }

    .about-text-col {
      order: 1;
      padding: 0;
    }

    .about-stats {
      gap: 20px;
      padding: 20px 16px;
    }

    .about-stat-value {
      font-size: 28px;
    }

    .about-stat-divider {
      height: 32px;
    }
  }
</style>
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Clean build. The About section now has the split panel layout.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro
git commit -m "feat: redesign About section with split panel and stats"
```

---

### Task 3: Add stats animation to animations.ts

**Files:**
- Modify: `src/scripts/animations.ts`

- [ ] **Step 1: Update initAboutAnimations to include stats**

In `src/scripts/animations.ts`, replace the `initAboutAnimations` function (lines 138–174) with:

```typescript
export function initAboutAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.about-paragraph, .resume-button, .about-stat', { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    '.about-paragraph',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-layout',
        start: 'top bottom-=100',
      },
    }
  );

  gsap.fromTo(
    '.resume-button',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.resume-button',
        start: 'top bottom-=50',
      },
    }
  );

  gsap.fromTo(
    '.about-stat',
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top bottom-=50',
      },
    }
  );
}
```

- [ ] **Step 2: Update reduced-motion selectors in global.css**

In `src/styles/global.css`, inside the `@media (prefers-reduced-motion: reduce)` block, add `.about-stat` to the visibility list. Change:

```css
  .about-paragraph,
  .resume-button,
  .contact-title,
```

to:

```css
  .about-paragraph,
  .resume-button,
  .about-stat,
  .contact-title,
```

- [ ] **Step 3: Update noscript styles in Layout.astro**

In `src/layouts/Layout.astro`, inside the `<noscript><style>` block, add `.about-stat` to the selector list. Change:

```css
        .resume-button, .contact-title, .contact-subtitle, .contact-link,
```

to:

```css
        .resume-button, .about-stat, .contact-title, .contact-subtitle, .contact-link,
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Clean build. Stats will animate in with staggered fade-up on scroll.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/animations.ts src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: add scroll-triggered stats animation for About section"
```

---

### Task 4: Redesign Contact section — atmospheric with tile links

**Files:**
- Modify: `src/components/Contact.astro`

- [ ] **Step 1: Replace the Contact.astro HTML structure**

Replace the entire content of `src/components/Contact.astro` (HTML portion, lines 1–32) with:

```astro
<section class="contact-section" id="contact">
  <div class="contact-gradient-line"></div>
  <div class="contact-atmosphere">
    <div class="contact-orb contact-orb-1"></div>
    <div class="contact-orb contact-orb-2"></div>
    <div class="contact-orb contact-orb-3"></div>
    <div class="contact-radial"></div>
  </div>
  <div class="contact-content">
    <span class="section-label">Get in Touch</span>
    <h2 class="contact-title">Say<br /><span class="contact-title-accent">hello</span></h2>
    <p class="contact-subtitle">Always open to interesting conversations and collaborations.</p>
    <div class="contact-tiles">
      <a href="mailto:hello@anupam.dev" class="contact-tile">
        <div class="contact-tile-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13L2 4" />
          </svg>
        </div>
        <span class="contact-tile-label">Email</span>
      </a>
      <a href="https://github.com/anupam" target="_blank" rel="noopener" class="contact-tile">
        <div class="contact-tile-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <span class="contact-tile-label">GitHub</span>
      </a>
      <a href="https://linkedin.com/in/anupam" target="_blank" rel="noopener" class="contact-tile">
        <div class="contact-tile-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <span class="contact-tile-label">LinkedIn</span>
      </a>
    </div>
  </div>
  <p class="contact-footer">Designed with intention. Built with care.</p>
</section>
```

- [ ] **Step 2: Replace the Contact.astro styles**

Replace the entire `<style>` block of `src/components/Contact.astro` with:

```css
<style>
  .contact-section {
    padding: 160px 48px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .contact-gradient-line {
    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124, 106, 239, 0.3), rgba(232, 121, 168, 0.2), transparent);
  }

  .contact-atmosphere {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .contact-radial {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 70%, rgba(124, 106, 239, 0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 30% 20%, rgba(232, 121, 168, 0.06) 0%, transparent 40%);
  }

  .contact-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: orbFloat 20s ease-in-out infinite;
  }

  .contact-orb-1 {
    width: 400px;
    height: 400px;
    background: rgba(124, 106, 239, 0.06);
    top: -15%;
    left: 8%;
    animation-delay: -3s;
  }

  .contact-orb-2 {
    width: 280px;
    height: 280px;
    background: rgba(232, 121, 168, 0.04);
    bottom: -10%;
    right: 12%;
    animation-delay: -10s;
  }

  .contact-orb-3 {
    width: 200px;
    height: 200px;
    background: rgba(167, 139, 250, 0.04);
    top: 30%;
    right: 28%;
    animation-delay: -17s;
  }

  .contact-content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto;
  }

  .section-label {
    display: block;
    font-family: var(--font-body);
    color: var(--accent-start);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 20px;
    font-weight: 400;
  }

  .contact-title {
    font-family: var(--font-display);
    font-size: clamp(48px, 8vw, 72px);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 20px;
    letter-spacing: -1px;
    opacity: 0;
  }

  .contact-title-accent {
    background: linear-gradient(135deg, var(--accent-start), var(--accent-mid), var(--accent-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-style: italic;
  }

  .contact-subtitle {
    color: var(--text-dim);
    font-size: 15px;
    margin-bottom: 52px;
    opacity: 0;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  .contact-tiles {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .contact-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 120px;
    padding: 20px 16px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.02);
    color: var(--text-muted);
    transition: all 0.4s var(--ease-cinematic);
    opacity: 0;
    position: relative;
    overflow: hidden;
  }

  .contact-tile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124, 106, 239, 0.08), rgba(232, 121, 168, 0.05));
    opacity: 0;
    transition: opacity 0.4s;
    border-radius: inherit;
  }

  .contact-tile:hover::before {
    opacity: 1;
  }

  .contact-tile:hover {
    color: var(--text-primary);
    border-color: var(--border-glow);
    box-shadow: 0 0 24px rgba(124, 106, 239, 0.12);
    transform: translateY(-3px);
  }

  .contact-tile-icon {
    position: relative;
    z-index: 1;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(124, 106, 239, 0.1);
    border: 1px solid rgba(124, 106, 239, 0.15);
    border-radius: 50%;
    color: var(--accent-mid);
  }

  .contact-tile-label {
    position: relative;
    z-index: 1;
    font-size: 14px;
    font-weight: 500;
  }

  .contact-footer {
    position: relative;
    z-index: 1;
    font-family: var(--font-body);
    color: var(--text-dim);
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 1px;
    margin-top: 80px;
    opacity: 0;
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 100px 24px 48px;
    }

    .contact-orb {
      display: none;
    }

    .contact-radial {
      background:
        radial-gradient(ellipse at 50% 70%, rgba(124, 106, 239, 0.1) 0%, transparent 55%),
        radial-gradient(ellipse at 30% 20%, rgba(232, 121, 168, 0.03) 0%, transparent 40%);
    }

    .contact-tiles {
      gap: 12px;
    }

    .contact-tile {
      flex: 1;
      min-width: 0;
      padding: 16px 12px;
    }

    .contact-footer {
      margin-top: 60px;
    }
  }
</style>
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Clean build. Contact section now has atmospheric background and tile links.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.astro
git commit -m "feat: redesign Contact section with atmospheric background and tile links"
```

---

### Task 5: Update animations and fallbacks for new Contact markup

**Files:**
- Modify: `src/scripts/animations.ts`
- Modify: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Update initContactAnimations in animations.ts**

In `src/scripts/animations.ts`, replace the `initContactAnimations` function (lines 176–198) with:

```typescript
export function initContactAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.contact-title, .contact-subtitle, .contact-tile, .contact-footer', { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top bottom-=100',
    },
  });

  tl.fromTo('.contact-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .fromTo('.contact-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .fromTo(
      '.contact-tile',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
      '-=0.2'
    )
    .fromTo('.contact-footer', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1');
}
```

- [ ] **Step 2: Update reduced-motion selectors in global.css**

In `src/styles/global.css`, inside the `@media (prefers-reduced-motion: reduce)` block, replace:

```css
  .contact-link,
  .footer p {
```

with:

```css
  .contact-tile,
  .contact-footer {
```

- [ ] **Step 3: Update noscript styles in Layout.astro**

In `src/layouts/Layout.astro`, inside the `<noscript><style>` block, replace:

```css
        .resume-button, .about-stat, .contact-title, .contact-subtitle, .contact-link,
        .footer p, .project-card-bottom {
```

with:

```css
        .resume-button, .about-stat, .contact-title, .contact-subtitle, .contact-tile,
        .contact-footer, .project-card-bottom {
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: Clean build, no errors. All animations and fallbacks are aligned with new markup.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/animations.ts src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: update animations and fallbacks for redesigned Contact section"
```
