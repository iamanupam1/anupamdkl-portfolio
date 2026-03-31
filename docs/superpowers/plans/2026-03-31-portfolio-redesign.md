# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio site with a bold + atmospheric aesthetic, replacing GSAP with Motion for animations, restructuring the page layout, and adding a custom cursor.

**Architecture:** Single-page Astro site. Replace GSAP (~47KB) with Motion (~16KB) for all animations. Restructure from card-grid layout to full-width alternating project showcase. Merge About + Blog into one interleaved section. Add dot + trailing ring custom cursor with spring physics.

**Tech Stack:** Astro 4, Motion (vanilla JS), TypeScript, CSS custom properties, Inter font

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Swap gsap → motion dependency |
| `src/styles/global.css` | Modify | Add cursor styles, update reduced-motion selectors |
| `src/layouts/Layout.astro` | Modify | Add cursor DOM elements, update noscript fallbacks |
| `src/pages/index.astro` | Modify | Update script imports, remove overlay/constellation |
| `src/components/Nav.astro` | Modify | Same markup, animations move to script |
| `src/components/Hero.astro` | Modify | CSS-only particles replace JS particles, clean up |
| `src/components/Projects.astro` | Rewrite | Full-width alternating layout |
| `src/components/ProjectCard.astro` | Rewrite | Alternating row with image + details |
| `src/components/About.astro` | Modify | Conversational text, stats remain |
| `src/components/Blog.astro` | Rewrite | Becomes sub-section within About+Blog flow |
| `src/components/BlogCard.astro` | Modify | Remove initial opacity:0 (Motion handles it) |
| `src/components/Contact.astro` | Rewrite | Social links row with icons |
| `src/scripts/animations.ts` | Rewrite | All Motion-based animations |
| `src/scripts/cursor.ts` | Create | Custom cursor logic |
| `src/scripts/particles.ts` | Remove | Replaced by CSS-only particles in Hero |
| `src/scripts/overlay.ts` | Remove | No more overlay |
| `src/scripts/constellation.ts` | Remove | Removed feature |
| `src/components/ProjectOverlay.astro` | Remove | No more overlay |
| `src/components/Constellation.astro` | Remove | Removed feature |

---

### Task 1: Swap GSAP for Motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Uninstall GSAP**

```bash
npm uninstall gsap
```

- [ ] **Step 2: Install Motion**

```bash
npm install motion
```

- [ ] **Step 3: Verify package.json**

Run: `cat package.json`

Expected: `"motion"` in dependencies, `"gsap"` absent.

```json
{
  "dependencies": {
    "astro": "^4.0.0",
    "motion": "^12.0.0"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: swap gsap for motion animation library"
```

---

### Task 2: Remove Deleted Files

**Files:**
- Remove: `src/scripts/overlay.ts`
- Remove: `src/scripts/constellation.ts`
- Remove: `src/scripts/particles.ts`
- Remove: `src/components/ProjectOverlay.astro`
- Remove: `src/components/Constellation.astro`

- [ ] **Step 1: Delete files**

```bash
rm src/scripts/overlay.ts src/scripts/constellation.ts src/scripts/particles.ts src/components/ProjectOverlay.astro src/components/Constellation.astro
```

- [ ] **Step 2: Commit**

```bash
git add -u
git commit -m "chore: remove overlay, constellation, and particles modules"
```

---

### Task 3: Update Global CSS — Cursor Styles + Reduced Motion

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add cursor styles and update reduced-motion selectors**

Add the following at the end of `global.css`, before the closing `*/` comment or at EOF. Also update the reduced-motion selector list to include new class names.

Replace the entire `global.css` with:

```css
/* Reset */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Colors — mockup palette */
  --bg: #0a0a0f;
  --bg-elevated: rgba(255, 255, 255, 0.03);
  --text-primary: #f1f5f9;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --accent: #6366f1;
  --accent-light: #818cf8;
  --accent-purple: #a78bfa;
  --accent-violet: #c084fc;
  --accent-pink: #f472b6;
  --accent-start: #6366f1;
  --accent-mid: #818cf8;
  --accent-end: #c084fc;
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-accent: rgba(99, 102, 241, 0.3);
  --border-glow: rgba(124, 106, 239, 0.4);

  /* Typography */
  --font-body: 'Inter', sans-serif;
  --font-display: 'Inter', sans-serif;

  /* Easing */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-cinematic: cubic-bezier(0.22, 1, 0.36, 1);

  /* Layout */
  --max-width: 1200px;
  --section-padding: 120px 48px;
  --section-padding-mobile: 80px 24px;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text-primary);
  overflow-x: hidden;
}

/* Custom cursor — hidden on touch devices */
@media (pointer: fine) {
  body {
    cursor: none;
  }

  a, button, [role="button"] {
    cursor: none;
  }
}

.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background: var(--text-primary);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--accent-light);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  will-change: transform;
  transition: width 0.3s var(--ease-cinematic),
              height 0.3s var(--ease-cinematic),
              border-color 0.3s var(--ease-cinematic),
              margin 0.3s var(--ease-cinematic);
}

.cursor-ring.hovering {
  width: 52px;
  height: 52px;
  border-color: var(--accent);
  margin-left: -8px;
  margin-top: -8px;
}

/* Hide cursor elements on touch devices */
@media (pointer: coarse) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}

a {
  color: inherit;
  text-decoration: none;
}

/* Skip to content link */
.skip-link {
  position: fixed;
  top: -100%;
  left: 16px;
  z-index: 9999;
  padding: 12px 24px;
  background: var(--accent);
  color: #fff;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

/* Focus-visible */
:focus-visible {
  outline: 2px solid var(--accent-light);
  outline-offset: 2px;
  border-radius: inherit;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .hero-label,
  .hero-word,
  .hero-subtitle,
  .hero-divider,
  .scroll-indicator,
  .project-row,
  .blog-card,
  .about-text p,
  .stat,
  .contact-link {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: rgba(99,102,241,0.25);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(99,102,241,0.45);
}

/* Selection color */
::selection {
  background: rgba(99,102,241,0.3);
  color: var(--text-primary);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add cursor styles, update reduced-motion selectors"
```

---

### Task 4: Update Layout — Cursor DOM + Noscript

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Rewrite Layout.astro**

Replace the entire file with:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Portfolio of Anupam — Full-Stack Software Engineer" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content="Portfolio of Anupam — Full-Stack Software Engineer" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content="Portfolio of Anupam — Full-Stack Software Engineer" />
    <meta name="twitter:image" content="/og-image.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
    <title>{title}</title>
    <noscript>
      <style>
        .hero-gradient, .hero-label, .hero-word, .hero-subtitle, .hero-divider,
        .scroll-indicator, .project-row, .blog-card, .about-text p,
        .stat, .contact-link {
          opacity: 1 !important;
          transform: none !important;
        }
        .cursor-dot, .cursor-ring {
          display: none !important;
        }
      </style>
    </noscript>
  </head>
  <body>
    <a href="#main-content" class="skip-link">Skip to content</a>
    <div class="cursor-dot" id="cursor-dot"></div>
    <div class="cursor-ring" id="cursor-ring"></div>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: add cursor DOM elements, update noscript fallbacks"
```

---

### Task 5: Rewrite Hero Component — CSS-Only Particles

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Rewrite Hero.astro with CSS-only atmospheric effects**

Replace the entire file with:

```astro
<section class="hero" id="hero">
  <div class="hero-gradient"></div>
  <div class="hero-noise"></div>
  <div class="hero-particles">
    <div class="particle" style="width:3px;height:3px;left:15%;top:20%;animation-duration:8s;animation-delay:0s;background:#818cf8;"></div>
    <div class="particle" style="width:2px;height:2px;left:80%;top:60%;animation-duration:10s;animation-delay:1s;background:#c084fc;"></div>
    <div class="particle" style="width:4px;height:4px;left:25%;top:75%;animation-duration:7s;animation-delay:2s;background:#f472b6;"></div>
    <div class="particle" style="width:2px;height:2px;left:70%;top:30%;animation-duration:9s;animation-delay:0.5s;background:#818cf8;"></div>
    <div class="particle" style="width:3px;height:3px;left:90%;top:45%;animation-duration:6s;animation-delay:1.5s;background:#a78bfa;"></div>
    <div class="particle" style="width:2px;height:2px;left:40%;top:85%;animation-duration:11s;animation-delay:3s;background:#818cf8;"></div>
    <div class="particle" style="width:3px;height:3px;left:55%;top:15%;animation-duration:8.5s;animation-delay:0.8s;background:#c084fc;"></div>
  </div>

  <div class="hero-content">
    <div class="hero-label">Full-Stack Engineer</div>
    <h1 class="hero-title">
      <span class="hero-word">Building digital</span><br />
      <span class="hero-word hero-accent">experiences</span>
    </h1>
    <div class="hero-divider"></div>
    <p class="hero-subtitle">Crafting code that feels alive</p>
  </div>

  <div class="scroll-indicator" id="scroll-indicator">
    <div></div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .hero-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 60%, rgba(168,85,247,0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(59,130,246,0.08) 0%, transparent 40%);
    animation: gradientShift 8s ease-in-out infinite alternate;
  }

  .hero-noise {
    position: absolute;
    inset: 0;
    opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px;
    pointer-events: none;
  }

  .hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    border-radius: 50%;
    box-shadow: 0 0 6px currentColor;
    animation: particleFloat linear infinite;
    opacity: 0;
  }

  @keyframes particleFloat {
    0% { transform: translateY(0); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateY(-100px); opacity: 0; }
  }

  @keyframes gradientShift {
    0% { opacity: 0.8; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.05); }
  }

  .hero-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 10;
    padding: 0 24px;
  }

  .hero-label {
    color: #94a3b8;
    font-size: 12px;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 16px;
    opacity: 0;
  }

  .hero-title {
    font-size: clamp(40px, 8vw, 80px);
    font-weight: 200;
    line-height: 1.1;
    margin-bottom: 24px;
  }

  .hero-word {
    display: inline-block;
    opacity: 0;
  }

  .hero-accent {
    font-weight: 700;
    background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
  }

  .hero-divider {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #6366f1, transparent);
    margin-bottom: 24px;
    transform: scaleX(0);
  }

  .hero-subtitle {
    color: #64748b;
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 0.5px;
    opacity: 0;
  }

  .scroll-indicator {
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    animation: bounce 2s ease infinite;
    opacity: 0;
  }

  .scroll-indicator div {
    width: 24px;
    height: 40px;
    border: 2px solid rgba(148,163,184,0.3);
    border-radius: 12px;
    position: relative;
  }

  .scroll-indicator div::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 8px;
    background: #818cf8;
    border-radius: 2px;
    animation: scrollDot 2s ease infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(8px); }
  }

  @keyframes scrollDot {
    0% { opacity: 1; top: 6px; }
    100% { opacity: 0; top: 20px; }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: clamp(32px, 10vw, 56px);
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: rewrite Hero with CSS-only particles and noise texture"
```

---

### Task 6: Rewrite Projects — Full-Width Alternating Layout

**Files:**
- Rewrite: `src/components/Projects.astro`
- Rewrite: `src/components/ProjectCard.astro`

- [ ] **Step 1: Rewrite ProjectCard.astro for alternating row layout**

Replace the entire file with:

```astro
---
interface Props {
  id: string;
  tag: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  gradient: string;
  liveUrl?: string;
  githubUrl?: string;
  index: number;
}

const { id, tag, title, summary, description, techStack, gradient, liveUrl, githubUrl, index } = Astro.props;
const isEven = index % 2 === 1;
---

<article class:list={['project-row', { 'project-row--reversed': isEven }]} data-project-id={id}>
  <div class="project-image" style={`background: ${gradient}`}>
    <div class="project-image-noise"></div>
    <span class="project-image-label">PROJECT PREVIEW</span>
  </div>
  <div class="project-details">
    <span class="project-tag">{tag}</span>
    <h3 class="project-title">{title}</h3>
    <p class="project-summary">{description}</p>
    <div class="project-tech">
      {techStack.map((tech) => (
        <span class="tech-pill">{tech}</span>
      ))}
    </div>
    <div class="project-links">
      {liveUrl && (
        <a href={liveUrl} class="project-link" target="_blank" rel="noopener">
          Live Demo
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 3h8v8m0-8L5 11" />
          </svg>
        </a>
      )}
      {githubUrl && (
        <a href={githubUrl} class="project-link" target="_blank" rel="noopener">
          GitHub
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 3h8v8m0-8L5 11" />
          </svg>
        </a>
      )}
    </div>
  </div>
</article>

<style>
  .project-row {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 48px;
    align-items: center;
    opacity: 0;
  }

  .project-row--reversed {
    grid-template-columns: 2fr 3fr;
  }

  .project-row--reversed .project-image {
    order: 2;
  }

  .project-row--reversed .project-details {
    order: 1;
  }

  .project-image {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 16 / 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.4s var(--ease-cinematic);
  }

  .project-row:hover .project-image {
    transform: scale(1.02);
  }

  .project-image-noise {
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  .project-image-label {
    color: rgba(255, 255, 255, 0.2);
    font-size: 12px;
    letter-spacing: 2px;
    position: relative;
    z-index: 1;
  }

  .project-details {
    padding: 16px 0;
  }

  .project-tag {
    display: inline-block;
    color: var(--accent-light);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 14px;
    font-weight: 400;
  }

  .project-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 16px;
    letter-spacing: -0.3px;
  }

  .project-summary {
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 24px;
    font-weight: 300;
  }

  .project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  .tech-pill {
    background: rgba(99, 102, 241, 0.08);
    border: 1px solid rgba(99, 102, 241, 0.15);
    color: var(--accent-mid);
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    letter-spacing: 0.3px;
  }

  .project-links {
    display: flex;
    gap: 16px;
  }

  .project-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-muted);
    font-size: 13px;
    padding: 8px 0;
    transition: color 0.3s;
  }

  .project-link:hover {
    color: var(--accent-light);
  }

  @media (max-width: 768px) {
    .project-row,
    .project-row--reversed {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .project-row--reversed .project-image {
      order: 0;
    }

    .project-row--reversed .project-details {
      order: 0;
    }

    .project-title {
      font-size: 22px;
    }
  }
</style>
```

- [ ] **Step 2: Rewrite Projects.astro**

Replace the entire file with:

```astro
---
import ProjectCard from './ProjectCard.astro';
import { projects } from '../data/projects';
---

<section class="projects-section" id="work">
  <div class="projects-header">
    <span class="section-label">Selected Work</span>
    <h2 class="section-title">Things I've built</h2>
  </div>
  <div class="projects-list">
    {projects.map((project, index) => (
      <ProjectCard
        id={project.id}
        tag={project.tag}
        title={project.title}
        summary={project.summary}
        description={project.description}
        techStack={project.techStack}
        gradient={project.gradient}
        liveUrl={project.liveUrl}
        githubUrl={project.githubUrl}
        index={index}
      />
    ))}
  </div>
</section>

<style>
  .projects-section {
    padding: var(--section-padding);
    max-width: var(--max-width);
    margin: 0 auto;
  }

  .projects-header {
    margin-bottom: 72px;
  }

  .section-label {
    display: block;
    color: var(--accent);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 400;
  }

  .section-title {
    font-size: 40px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .projects-list {
    display: flex;
    flex-direction: column;
    gap: 96px;
  }

  @media (max-width: 768px) {
    .projects-section {
      padding: var(--section-padding-mobile);
    }

    .projects-list {
      gap: 64px;
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

Run: `npx astro build 2>&1 | tail -5`

Expected: Build succeeds (may have warnings about unused imports in index.astro, that's OK — we fix that in Task 9).

- [ ] **Step 4: Commit**

```bash
git add src/components/Projects.astro src/components/ProjectCard.astro
git commit -m "feat: rewrite projects as full-width alternating layout"
```

---

### Task 7: Rewrite About — Conversational Text

**Files:**
- Modify: `src/components/About.astro`

- [ ] **Step 1: Rewrite About.astro**

Replace the entire file with:

```astro
<div class="about-block">
  <span class="section-label">About</span>
  <h2 class="section-title">A bit about me</h2>
  <div class="about-grid">
    <div class="about-text">
      <p>I'm a full-stack engineer who believes great software is equal parts engineering and artistry. I care deeply about the details — from pixel-perfect interfaces to well-architected backends.</p>
      <p>When I'm not coding, you'll find me exploring new technologies, contributing to open source, or experimenting with creative coding.</p>
    </div>
    <div class="about-stats">
      <div class="stat">
        <div class="stat-number" data-target="5">0</div>
        <div class="stat-suffix">+</div>
        <div class="stat-label">Years Experience</div>
      </div>
      <div class="stat">
        <div class="stat-number" data-target="30">0</div>
        <div class="stat-suffix">+</div>
        <div class="stat-label">Projects Shipped</div>
      </div>
      <div class="stat">
        <div class="stat-number" data-target="10">0</div>
        <div class="stat-suffix">+</div>
        <div class="stat-label">Technologies</div>
      </div>
      <div class="stat">
        <div class="stat-number">&infin;</div>
        <div class="stat-label">Curiosity</div>
      </div>
    </div>
  </div>
</div>

<style>
  .about-block {
    margin-bottom: 96px;
  }

  .section-label {
    display: block;
    color: var(--accent);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 16px;
    font-weight: 400;
  }

  .section-title {
    font-size: 40px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 48px;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }

  .about-text {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.8;
  }

  .about-text p {
    margin-bottom: 16px;
    opacity: 0;
  }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .stat {
    padding: 24px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    opacity: 0;
  }

  .stat-number {
    font-size: 32px;
    font-weight: 200;
    color: var(--accent-light);
    display: inline;
  }

  .stat-suffix {
    font-size: 32px;
    font-weight: 200;
    color: var(--accent-light);
    display: inline;
  }

  .stat-label {
    color: var(--text-dim);
    font-size: 12px;
    letter-spacing: 1px;
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/About.astro
git commit -m "feat: rewrite About with conversational text and count-up stats"
```

---

### Task 8: Rewrite Blog Section + BlogCard + Contact + Interleaved Section Wrapper

**Files:**
- Rewrite: `src/components/Blog.astro`
- Modify: `src/components/BlogCard.astro`
- Rewrite: `src/components/Contact.astro`

- [ ] **Step 1: Rewrite Blog.astro as sub-section (no outer section tag)**

Replace the entire file with:

```astro
---
import { getCollection } from 'astro:content';
import BlogCard from './BlogCard.astro';

const posts = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---

<div class="blog-block">
  <span class="section-label">Thoughts & explorations</span>
  <div class="blog-grid">
    {posts.map((post) => (
      <BlogCard
        slug={post.slug}
        title={post.data.title}
        summary={post.data.summary}
        date={post.data.date}
        tags={post.data.tags}
        gradient={post.data.gradient}
      />
    ))}
  </div>
  <div class="blog-footer">
    <a href="/blog" class="blog-view-all">
      View all posts
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 8h10m0 0L9 4m4 4L9 12" />
      </svg>
    </a>
  </div>
</div>

<style>
  .blog-block {
    padding-top: 0;
  }

  .section-label {
    display: block;
    color: var(--accent);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 32px;
    font-weight: 400;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .blog-footer {
    margin-top: 40px;
    text-align: center;
  }

  .blog-view-all {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: 1px solid var(--border-accent);
    border-radius: 8px;
    color: var(--accent-light);
    font-size: 14px;
    transition: all 0.3s var(--ease-cinematic);
  }

  .blog-view-all:hover {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(129, 140, 248, 0.2);
    color: var(--text-primary);
  }

  @media (max-width: 1024px) {
    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .blog-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Update BlogCard.astro — remove initial opacity:0**

In `src/components/BlogCard.astro`, change the `.blog-card` style from `opacity: 0;` to `opacity: 0;` (keep it — Motion will handle the reveal). No changes needed to BlogCard — it's already correct. The `opacity: 0` is intentional for Motion's `inView()` to animate from.

- [ ] **Step 3: Rewrite Contact.astro as social links**

Replace the entire file with:

```astro
<footer class="contact-section" id="contact">
  <div class="contact-links">
    <a href="mailto:hello@anupam.dev" class="contact-link" target="_blank" rel="noopener">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
      Email
    </a>
    <a href="https://github.com/anupam" class="contact-link" target="_blank" rel="noopener">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      GitHub
    </a>
    <a href="https://linkedin.com/in/anupam" class="contact-link" target="_blank" rel="noopener">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      LinkedIn
    </a>
    <a href="https://twitter.com/anupam" class="contact-link" target="_blank" rel="noopener">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      X
    </a>
  </div>
  <p class="contact-footer-text">Designed with intention. Built with care.</p>
</footer>

<style>
  .contact-section {
    padding: 80px 48px 48px;
    text-align: center;
  }

  .contact-links {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-bottom: 48px;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 14px;
    transition: color 0.3s;
    opacity: 0;
  }

  .contact-link:hover {
    color: var(--accent-light);
  }

  .contact-footer-text {
    color: var(--text-dim);
    font-size: 13px;
    border-top: 1px solid var(--border-subtle);
    padding-top: 32px;
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 60px 24px 32px;
    }

    .contact-links {
      flex-wrap: wrap;
      gap: 24px;
    }
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Blog.astro src/components/BlogCard.astro src/components/Contact.astro
git commit -m "feat: rewrite Blog, BlogCard, Contact for interleaved layout"
```

---

### Task 9: Update index.astro — New Structure + Interleaved Section

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro**

Replace the entire file with:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Projects from '../components/Projects.astro';
import About from '../components/About.astro';
import Blog from '../components/Blog.astro';
import Contact from '../components/Contact.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main id="main-content">
    <Hero />
    <Projects />
    <section class="about-blog-section" id="about">
      <About />
      <Blog />
    </section>
    <Contact />
  </main>
</Layout>

<style>
  .about-blog-section {
    padding: var(--section-padding);
    max-width: var(--max-width);
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    .about-blog-section {
      padding: var(--section-padding-mobile);
    }
  }
</style>

<script>
  import { initHeroAnimations, initNavScroll, initProjectsAnimations, initBlogAnimations, initAboutAnimations, initContactAnimations } from '../scripts/animations';
  import { initCursor } from '../scripts/cursor';

  initNavScroll();
  initHeroAnimations();
  initProjectsAnimations();
  initAboutAnimations();
  initBlogAnimations();
  initContactAnimations();
  initCursor();
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: update index.astro with new section structure"
```

---

### Task 10: Create Custom Cursor Script

**Files:**
- Create: `src/scripts/cursor.ts`

- [ ] **Step 1: Create cursor.ts**

```typescript
import { animate } from 'motion';

export function initCursor(): void {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows immediately
    dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;

    // Ring follows with spring
    animate(ring, {
      transform: `translate(${mouseX - 18}px, ${mouseY - 18}px)`,
    }, {
      type: 'spring',
      bounce: 0.15,
      duration: 0.5,
    });
  });

  // Hover state on interactive elements
  const interactiveSelector = 'a, button, [role="button"], .project-row';
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(interactiveSelector)) {
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(interactiveSelector)) {
      ring.classList.remove('hovering');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/cursor.ts
git commit -m "feat: add custom cursor with dot + trailing ring"
```

---

### Task 11: Rewrite Animations Script with Motion

**Files:**
- Rewrite: `src/scripts/animations.ts`

- [ ] **Step 1: Rewrite animations.ts with Motion API**

Replace the entire file with:

```typescript
import { animate, scroll, inView, stagger } from 'motion';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function showAll(selector: string): void {
  document.querySelectorAll(selector).forEach((el) => {
    (el as HTMLElement).style.opacity = '1';
    (el as HTMLElement).style.transform = 'none';
  });
}

export function initHeroAnimations(): void {
  if (prefersReducedMotion()) {
    showAll('.hero-gradient, .hero-label, .hero-word, .hero-subtitle, .scroll-indicator');
    const divider = document.querySelector('.hero-divider') as HTMLElement;
    if (divider) divider.style.transform = 'scaleX(1)';
    return;
  }

  // Staggered entrance
  animate('.hero-gradient', { opacity: [0, 1] }, { duration: 0.5 });

  animate('.hero-label',
    { opacity: [0, 1], y: [20, 0] },
    { duration: 0.6, delay: 0.3, type: 'spring', bounce: 0.2 }
  );

  animate('.hero-word',
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.6, delay: stagger(0.12, { startDelay: 0.5 }), type: 'spring', bounce: 0.2 }
  );

  animate('.hero-divider',
    { transform: ['scaleX(0)', 'scaleX(1)'] },
    { duration: 0.6, delay: 0.9 }
  );

  animate('.hero-subtitle',
    { opacity: [0, 1], y: [15, 0] },
    { duration: 0.6, delay: 1.1, type: 'spring', bounce: 0.2 }
  );

  animate('.nav-logo, .nav-link',
    { opacity: [0, 1], x: [10, 0] },
    { duration: 0.4, delay: stagger(0.08, { startDelay: 1.0 }) }
  );

  animate('.scroll-indicator',
    { opacity: [0, 1] },
    { duration: 0.4, delay: 1.4 }
  );

  // Gradient shimmer on accent word
  animate('.hero-accent',
    { backgroundPosition: ['0% 0%', '200% 200%'] },
    { duration: 4, repeat: Infinity, ease: 'linear' }
  );

  // Scroll-linked parallax: hero content fades/moves up as you scroll
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    scroll(
      animate(heroContent, { opacity: [1, 0], y: [0, -150] }, { ease: 'linear' }),
      { target: document.querySelector('.hero') as Element, offset: ['start start', 'end start'] }
    );
  }
}

export function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Add scrolled class when hero leaves viewport
  inView('.hero', () => {
    nav.classList.remove('scrolled');
    return () => {
      nav.classList.add('scrolled');
    };
  }, { amount: 0 });
}

export function initProjectsAnimations(): void {
  if (prefersReducedMotion()) {
    showAll('.project-row');
    return;
  }

  document.querySelectorAll('.project-row').forEach((row) => {
    const isReversed = row.classList.contains('project-row--reversed');

    inView(row, () => {
      const image = row.querySelector('.project-image') as HTMLElement;
      const details = row.querySelector('.project-details') as HTMLElement;

      // Row becomes visible
      animate(row, { opacity: [0, 1] }, { duration: 0.3 });

      // Image slides in from its side
      const imageX = isReversed ? 60 : -60;
      if (image) {
        animate(image,
          { opacity: [0, 1], x: [imageX, 0] },
          { duration: 0.7, type: 'spring', bounce: 0.15 }
        );
      }

      // Details slide in from opposite side
      const detailsX = isReversed ? -40 : 40;
      if (details) {
        animate(details,
          { opacity: [0, 1], x: [detailsX, 0] },
          { duration: 0.7, delay: 0.1, type: 'spring', bounce: 0.15 }
        );
      }
    }, { amount: 0.2 });
  });
}

export function initAboutAnimations(): void {
  if (prefersReducedMotion()) {
    showAll('.about-text p, .stat');
    return;
  }

  // About paragraphs
  inView('.about-grid', () => {
    animate('.about-text p',
      { opacity: [0, 1], y: [25, 0] },
      { duration: 0.6, delay: stagger(0.15), type: 'spring', bounce: 0.2 }
    );
  }, { amount: 0.2 });

  // Stats with count-up
  inView('.about-stats', () => {
    // Fade in stat cards
    animate('.stat',
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.5, delay: stagger(0.1), type: 'spring', bounce: 0.2 }
    );

    // Count-up numbers
    document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-target') || '0', 10);
      animate(0, target, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => {
          el.textContent = Math.round(latest).toString();
        },
      });
    });
  }, { amount: 0.3 });
}

export function initBlogAnimations(): void {
  if (prefersReducedMotion()) {
    showAll('.blog-card');
    return;
  }

  inView('.blog-grid', () => {
    animate('.blog-card',
      { opacity: [0, 1], y: [30, 0] },
      { duration: 0.6, delay: stagger(0.12), type: 'spring', bounce: 0.2 }
    );
  }, { amount: 0.1 });
}

export function initContactAnimations(): void {
  if (prefersReducedMotion()) {
    showAll('.contact-link');
    return;
  }

  inView('.contact-links', () => {
    animate('.contact-link',
      { opacity: [0, 1], y: [15, 0] },
      { duration: 0.4, delay: stagger(0.08), type: 'spring', bounce: 0.2 }
    );
  }, { amount: 0.5 });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/animations.ts
git commit -m "feat: rewrite all animations with Motion library"
```

---

### Task 12: Build Verification + Fix Any Issues

**Files:**
- All modified files

- [ ] **Step 1: Run the build**

```bash
npx astro build 2>&1
```

Expected: Build completes successfully with no errors.

- [ ] **Step 2: Fix any build errors**

If there are import errors or missing references, fix them. Common issues to check:
- `src/pages/blog/index.astro` still imports `BlogCard` — should work unchanged
- `src/pages/blog/[...slug].astro` uses `BlogPost` layout — should work unchanged
- `src/layouts/BlogPost.astro` references CSS variables — all defined in global.css

- [ ] **Step 3: Start dev server and verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321` and verify:
- Nav renders and blurs on scroll
- Hero has gradient blurs, noise, CSS particles, and entrance animation
- Projects show in full-width alternating layout
- About + Blog section renders as one interleaved section
- Contact shows social links row
- Custom cursor works (dot + ring, ring expands on hover)
- Mobile responsive (resize browser to verify)

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues from redesign"
```

---

### Task 13: Update Blog Listing Page

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Update blog listing to use new CSS variables consistently**

The blog listing page (`src/pages/blog/index.astro`) has its own nav and styles that are separate from the main site. It should continue to work as-is since it uses its own hardcoded colors. No changes needed unless the build fails.

Verify by navigating to `http://localhost:4321/blog` in the dev server.

- [ ] **Step 2: Commit if changes were made**

```bash
git add src/pages/blog/index.astro
git commit -m "fix: update blog listing page for consistency"
```

---

### Task 14: Final QA + Cleanup

- [ ] **Step 1: Full build verification**

```bash
npx astro build 2>&1
```

Expected: `Complete!` with no errors.

- [ ] **Step 2: Visual QA checklist**

Start `npm run dev` and check:
- [ ] Hero entrance animation plays smoothly
- [ ] Scroll down — projects animate in from left/right
- [ ] Projects alternate correctly (image left, image right, image left)
- [ ] About paragraphs and stats animate on scroll
- [ ] Blog cards animate in with stagger
- [ ] Contact links animate in
- [ ] Custom cursor dot follows mouse precisely
- [ ] Custom cursor ring trails with spring lag
- [ ] Ring expands on hover over links/buttons
- [ ] Nav blurs when scrolling past hero
- [ ] Mobile layout: single column, no cursor

- [ ] **Step 3: Check reduced motion**

In browser DevTools, toggle `prefers-reduced-motion: reduce` (Chrome: Rendering panel → Emulate CSS media feature). Verify all elements are visible with no animation.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio redesign — Motion animations, alternating projects, custom cursor"
```
