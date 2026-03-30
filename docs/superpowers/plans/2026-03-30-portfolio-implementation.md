# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, animation-driven single-page portfolio for a full-stack software engineer using Astro and GSAP.

**Architecture:** Astro static site with a single `index.astro` page composed of section components. GSAP + ScrollTrigger loads as a client-side script for all animations. Project data lives in a simple TypeScript array — no CMS or content collections needed for 3-4 projects. Project detail overlay is a client-side interactive component.

**Tech Stack:** Astro 5, GSAP 3 + ScrollTrigger, TypeScript, scoped CSS

---

## File Structure

```
src/
├── layouts/
│   └── Layout.astro              # Base HTML shell, font loading, global CSS vars
├── pages/
│   └── index.astro               # Single page, composes all sections
├── components/
│   ├── Nav.astro                  # Fixed nav with scroll-aware background
│   ├── Hero.astro                 # Full-viewport hero with particles
│   ├── Projects.astro             # Project grid section
│   ├── ProjectCard.astro          # Individual project card
│   ├── ProjectOverlay.astro       # Detail overlay (hidden by default)
│   ├── About.astro                # Bio + constellation visual + resume button
│   ├── Contact.astro              # Social links + footer
│   └── Constellation.astro        # Canvas-based dot network visual
├── scripts/
│   ├── animations.ts              # GSAP timeline + ScrollTrigger setup for all sections
│   ├── particles.ts               # Particle field generator for hero
│   ├── constellation.ts           # Canvas drawing logic for About visual
│   └── overlay.ts                 # Project overlay open/close logic
├── data/
│   └── projects.ts                # Project data array
├── styles/
│   └── global.css                 # CSS custom properties, reset, base styles
public/
├── fonts/                         # Inter font files (self-hosted)
└── resume.pdf                     # Placeholder resume file
```

---

### Task 1: Astro Project Scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/layouts/Layout.astro`
- Create: `src/styles/global.css`
- Create: `src/pages/index.astro`
- Create: `public/resume.pdf` (empty placeholder)

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/biplav00/Documents/personal/anupam-portfolio
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

If prompted about overwriting, allow it (the directory only has mockups and docs).

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install gsap
```

- [ ] **Step 3: Create global CSS with design tokens**

Create `src/styles/global.css`:

```css
/* Reset */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Colors */
  --bg: #0a0a0f;
  --text-primary: #f1f5f9;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
  --accent-start: #818cf8;
  --accent-end: #c084fc;
  --border-subtle: rgba(255, 255, 255, 0.06);

  /* Typography */
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* Easing */
  --ease-cinematic: cubic-bezier(0.4, 0, 0.2, 1);

  /* Spacing */
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Create base layout**

Create `src/layouts/Layout.astro`:

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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';
</style>
```

- [ ] **Step 5: Create index page shell**

Create `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Anupam — Software Engineer">
  <main>
    <p style="color: var(--text-primary); padding: 48px;">Portfolio coming soon.</p>
  </main>
</Layout>
```

- [ ] **Step 6: Create placeholder resume**

```bash
touch /Users/biplav00/Documents/personal/anupam-portfolio/public/resume.pdf
```

- [ ] **Step 7: Verify dev server starts**

```bash
cd /Users/biplav00/Documents/personal/anupam-portfolio
npx astro dev
```

Expected: Dev server at `http://localhost:4321` shows "Portfolio coming soon." on a dark background.

- [ ] **Step 8: Commit**

```bash
git init
echo "node_modules/\ndist/\n.astro/\n.superpowers/" > .gitignore
git add -A
git commit -m "feat: scaffold Astro project with global styles and layout"
```

---

### Task 2: Navigation Component

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Nav component**

Create `src/components/Nav.astro`:

```astro
<nav class="nav" id="nav">
  <a href="#" class="nav-logo">ANUPAM</a>
  <div class="nav-links">
    <a href="#work" class="nav-link">Work</a>
    <a href="#about" class="nav-link">About</a>
    <a href="#contact" class="nav-link">Contact</a>
  </div>
  <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu">
    <span></span>
    <span></span>
    <span></span>
  </button>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 48px;
    transition: background 0.4s var(--ease-cinematic), backdrop-filter 0.4s var(--ease-cinematic);
  }

  .nav.scrolled {
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .nav-logo {
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 2px;
    color: var(--text-primary);
  }

  .nav-links {
    display: flex;
    gap: 32px;
  }

  .nav-link {
    color: var(--text-muted);
    font-size: 13px;
    letter-spacing: 0.5px;
    transition: color 0.3s;
  }

  .nav-link:hover {
    color: var(--text-primary);
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .nav-hamburger span {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    transition: all 0.3s;
  }

  @media (max-width: 768px) {
    .nav {
      padding: 20px 24px;
    }

    .nav-links {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(10, 10, 15, 0.95);
      backdrop-filter: blur(20px);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 40px;
    }

    .nav-links.open {
      display: flex;
    }

    .nav-links .nav-link {
      font-size: 24px;
    }

    .nav-hamburger {
      display: flex;
      z-index: 101;
    }
  }
</style>
```

- [ ] **Step 2: Add Nav to index page**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <p style="color: var(--text-primary); padding: 100px 48px;">Portfolio coming soon.</p>
  </main>
</Layout>
```

- [ ] **Step 3: Verify nav renders**

Check `http://localhost:4321` — nav should be visible at the top with logo left, links right. On mobile viewport, links should hide and hamburger should appear.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/pages/index.astro
git commit -m "feat: add fixed navigation with mobile hamburger"
```

---

### Task 3: Hero Section (Static Layout)

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Hero component**

Create `src/components/Hero.astro`:

```astro
<section class="hero" id="hero">
  <div class="hero-gradient"></div>
  <div class="hero-grid"></div>
  <div class="hero-particles" id="hero-particles"></div>

  <div class="hero-content">
    <div class="hero-label">Full-Stack Engineer</div>
    <h1 class="hero-title">
      <span class="hero-word">Building</span>
      <span class="hero-word">digital</span>
      <br />
      <span class="hero-word hero-accent">experiences</span>
    </h1>
    <div class="hero-divider"></div>
    <p class="hero-subtitle">Crafting code that feels alive</p>
  </div>

  <div class="scroll-indicator" id="scroll-indicator">
    <div class="scroll-mouse">
      <div class="scroll-dot"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .hero-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 30% 40%, rgba(129, 140, 248, 0.15) 0%, transparent 60%),
      radial-gradient(ellipse at 70% 60%, rgba(192, 132, 252, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 40%);
    opacity: 0;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(129, 140, 248, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(129, 140, 248, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .hero-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 0 24px;
  }

  .hero-label {
    color: var(--text-muted);
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
    font-weight: 600;
    background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-divider {
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-start), transparent);
    margin: 0 auto 24px;
    transform: scaleX(0);
  }

  .hero-subtitle {
    color: var(--text-dim);
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
    opacity: 0;
  }

  .scroll-mouse {
    width: 24px;
    height: 40px;
    border: 2px solid rgba(148, 163, 184, 0.3);
    border-radius: 12px;
    position: relative;
  }

  .scroll-dot {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 8px;
    background: var(--accent-start);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: clamp(32px, 10vw, 56px);
    }
  }
</style>
```

- [ ] **Step 2: Add Hero to index page**

Update `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <Hero />
  </main>
</Layout>
```

- [ ] **Step 3: Verify hero renders**

Check `http://localhost:4321` — full-screen dark section with gradient background, grid overlay, centered text. All text starts invisible (opacity: 0) — animations come next task.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add hero section static layout"
```

---

### Task 4: Hero Animations (GSAP + Particles)

**Files:**
- Create: `src/scripts/particles.ts`
- Create: `src/scripts/animations.ts`
- Modify: `src/pages/index.astro` (add script import)

- [ ] **Step 1: Create particle generator**

Create `src/scripts/particles.ts`:

```typescript
export function createParticles(containerId: string, count: number): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  const colors = ['#818cf8', '#a78bfa', '#c084fc', '#6366f1'];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 10 + 8;
    const delay = Math.random() * 10;

    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 ${size * 2}px ${color};
      opacity: 0;
      animation: particleFloat ${duration}s linear ${delay}s infinite;
    `;
    particle.classList.add('particle');
    container.appendChild(particle);
  }
}
```

- [ ] **Step 2: Add particle keyframes to Hero component**

Add to the bottom of the `<style>` block in `src/components/Hero.astro`, before the closing `</style>`:

```css
  @keyframes particleFloat {
    0% {
      transform: translateY(100vh) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-10vh) scale(1);
      opacity: 0;
    }
  }
```

- [ ] **Step 3: Create main animations script**

Create `src/scripts/animations.ts`:

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createParticles } from './particles';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initHeroAnimations(): void {
  if (prefersReducedMotion()) {
    // Show everything immediately without animation
    gsap.set('.hero-gradient, .hero-label, .hero-word, .hero-subtitle, .scroll-indicator, .nav-link, .nav-logo', {
      opacity: 1,
    });
    gsap.set('.hero-divider', { scaleX: 1 });
    return;
  }

  // Determine particle count based on screen width
  const particleCount = window.innerWidth < 768 ? 12 : 25;
  createParticles('hero-particles', particleCount);

  // Hero entrance timeline
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-gradient', { opacity: 1, duration: 0.5 })
    .to('.hero-label', { opacity: 1, y: 0, duration: 0.6 }, '-=0.1')
    .fromTo(
      '.hero-word',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
      '-=0.3'
    )
    .to('.hero-divider', { scaleX: 1, duration: 0.6 }, '-=0.2')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .fromTo(
      '.nav-logo, .nav-link',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
      '-=0.4'
    )
    .to('.scroll-indicator', { opacity: 1, duration: 0.4 }, '-=0.2');

  // Scroll indicator pulse
  gsap.to('.scroll-dot', {
    y: 14,
    opacity: 0,
    duration: 1.5,
    repeat: -1,
    ease: 'power2.in',
  });

  // Hero parallax on scroll
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: -150,
    opacity: 0,
  });

  gsap.to('.hero-particles', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    opacity: 0,
    y: -50,
  });
}

export function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'bottom top+=80',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  // Mobile hamburger toggle
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = nav.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}
```

- [ ] **Step 4: Wire animations into the index page**

Update `src/pages/index.astro` — add a `<script>` block at the bottom:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <Hero />
  </main>
</Layout>

<script>
  import { initHeroAnimations, initNavScroll } from '../scripts/animations';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initHeroAnimations();
  });
</script>
```

- [ ] **Step 5: Verify hero animations**

Check `http://localhost:4321`:
- Page loads dark, then gradient fades in
- Particles begin floating upward
- Text elements animate in sequence
- Scroll down — hero content parallaxes up and fades
- Nav gains blurred background when scrolled past hero

- [ ] **Step 6: Commit**

```bash
git add src/scripts/particles.ts src/scripts/animations.ts src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add hero GSAP animations and particle system"
```

---

### Task 5: Project Data + Cards Section (Static)

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create project data**

Create `src/data/projects.ts`:

```typescript
export interface Project {
  id: string;
  tag: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  gradient: string;
  liveUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'project-alpha',
    tag: 'Web App',
    title: 'Project Alpha',
    summary: 'A real-time collaboration platform for seamless team workflows.',
    description:
      'Built a real-time collaboration platform using WebSockets for instant syncing across users. Designed the frontend with React and the backend with Node.js, handling thousands of concurrent connections with graceful degradation.',
    techStack: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 'dataflow-engine',
    tag: 'API Platform',
    title: 'DataFlow Engine',
    summary: 'High-performance data pipeline with sub-millisecond latency.',
    description:
      'Engineered a data pipeline processing millions of events per second. Built custom serialization for throughput optimization and implemented backpressure mechanisms to handle traffic spikes without data loss.',
    techStack: ['Python', 'Kafka', 'Redis', 'AWS'],
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))',
    githubUrl: '#',
  },
  {
    id: 'devkit-cli',
    tag: 'Open Source',
    title: 'DevKit CLI',
    summary: 'Developer toolkit that automates common workflows.',
    description:
      'Created a CLI tool that automates repetitive developer tasks — scaffolding, linting setup, deployment configs. Designed a plugin architecture so the community can extend it. Used by thousands of developers.',
    techStack: ['Go', 'CLI', 'GitHub Actions'],
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.3), rgba(59,130,246,0.3))',
    liveUrl: '#',
    githubUrl: '#',
  },
];
```

- [ ] **Step 2: Create ProjectCard component**

Create `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  id: string;
  tag: string;
  title: string;
  summary: string;
  gradient: string;
}

const { id, tag, title, summary, gradient } = Astro.props;
---

<div class="project-card" data-project-id={id}>
  <div class="project-image" style={`background: ${gradient}`}>
    <span class="project-image-label">{title}</span>
  </div>
  <div class="project-body">
    <span class="project-tag">{tag}</span>
    <h3 class="project-title">{title}</h3>
    <p class="project-summary">{summary}</p>
  </div>
</div>

<style>
  .project-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s var(--ease-cinematic);
  }

  .project-card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(129, 140, 248, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .project-image {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .project-image-label {
    color: rgba(255, 255, 255, 0.3);
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 500;
  }

  .project-body {
    padding: 24px;
  }

  .project-tag {
    display: inline-block;
    color: var(--accent-start);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .project-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .project-summary {
    color: var(--text-dim);
    font-size: 14px;
    line-height: 1.6;
  }
</style>
```

- [ ] **Step 3: Create Projects section component**

Create `src/components/Projects.astro`:

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
  <div class="projects-grid">
    {projects.map((project) => (
      <ProjectCard
        id={project.id}
        tag={project.tag}
        title={project.title}
        summary={project.summary}
        gradient={project.gradient}
      />
    ))}
  </div>
</section>

<style>
  .projects-section {
    padding: var(--section-padding);
    position: relative;
  }

  .projects-header {
    margin-bottom: 48px;
  }

  .section-label {
    display: block;
    color: var(--accent-start);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 36px;
    font-weight: 300;
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  @media (max-width: 768px) {
    .projects-section {
      padding: var(--section-padding-mobile);
    }

    .projects-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 4: Add Projects section to index page**

Update `src/pages/index.astro` — add import and component after Hero:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Projects from '../components/Projects.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <Hero />
    <Projects />
  </main>
</Layout>

<script>
  import { initHeroAnimations, initNavScroll } from '../scripts/animations';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initHeroAnimations();
  });
</script>
```

- [ ] **Step 5: Verify projects section renders**

Check `http://localhost:4321` — scroll past hero, see the projects grid with 3 cards. Cards should have gradient preview areas, hover effects work (lift + glow).

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts src/components/ProjectCard.astro src/components/Projects.astro src/pages/index.astro
git commit -m "feat: add projects section with data-driven cards"
```

---

### Task 6: Project Detail Overlay

**Files:**
- Create: `src/components/ProjectOverlay.astro`
- Create: `src/scripts/overlay.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create overlay component**

Create `src/components/ProjectOverlay.astro`:

```astro
---
import { projects } from '../data/projects';
---

<div class="overlay-backdrop" id="overlay-backdrop"></div>
<div class="overlay" id="project-overlay" role="dialog" aria-modal="true" aria-hidden="true">
  <button class="overlay-close" id="overlay-close" aria-label="Close project details">&times;</button>
  <div class="overlay-content">
    <div class="overlay-image" id="overlay-image"></div>
    <div class="overlay-body">
      <span class="overlay-tag" id="overlay-tag"></span>
      <h2 class="overlay-title" id="overlay-title"></h2>
      <p class="overlay-description" id="overlay-description"></p>
      <div class="overlay-tech" id="overlay-tech"></div>
      <div class="overlay-links" id="overlay-links"></div>
    </div>
  </div>
</div>

<script define:vars={{ projectsJSON: JSON.stringify(projects) }}>
  window.__PROJECTS__ = JSON.parse(projectsJSON);
</script>

<style>
  .overlay-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 15, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 200;
    opacity: 0;
    pointer-events: none;
  }

  .overlay-backdrop.active {
    pointer-events: auto;
  }

  .overlay {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    z-index: 201;
    background: #12121a;
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    width: 90vw;
    max-width: 720px;
    max-height: 85vh;
    overflow-y: auto;
    opacity: 0;
    pointer-events: none;
  }

  .overlay.active {
    pointer-events: auto;
  }

  .overlay-close {
    position: sticky;
    top: 16px;
    float: right;
    margin: 16px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: var(--text-primary);
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    z-index: 1;
  }

  .overlay-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .overlay-content {
    padding: 0;
  }

  .overlay-image {
    height: 240px;
    border-radius: 20px 20px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .overlay-body {
    padding: 32px;
  }

  .overlay-tag {
    display: inline-block;
    color: var(--accent-start);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .overlay-title {
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .overlay-description {
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.8;
    margin-bottom: 24px;
  }

  .overlay-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }

  .overlay-tech :global(.tech-tag) {
    background: rgba(129, 140, 248, 0.1);
    border: 1px solid rgba(129, 140, 248, 0.2);
    color: var(--accent-start);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
  }

  .overlay-links {
    display: flex;
    gap: 16px;
  }

  .overlay-links :global(.overlay-link) {
    color: var(--text-muted);
    font-size: 13px;
    padding: 8px 20px;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    transition: all 0.3s;
  }

  .overlay-links :global(.overlay-link:hover) {
    color: var(--text-primary);
    border-color: var(--accent-start);
    box-shadow: 0 0 12px rgba(129, 140, 248, 0.2);
  }

  @media (max-width: 768px) {
    .overlay {
      width: 100vw;
      max-width: 100vw;
      max-height: 100vh;
      height: 100vh;
      border-radius: 0;
      top: 0;
      left: 0;
      transform: translateY(100%);
    }

    .overlay-image {
      border-radius: 0;
    }
  }
</style>
```

- [ ] **Step 2: Create overlay logic**

Create `src/scripts/overlay.ts`:

```typescript
import { gsap } from 'gsap';

interface Project {
  id: string;
  tag: string;
  title: string;
  description: string;
  techStack: string[];
  gradient: string;
  liveUrl?: string;
  githubUrl?: string;
}

function getProjects(): Project[] {
  return (window as any).__PROJECTS__ || [];
}

function populateOverlay(project: Project): void {
  const image = document.getElementById('overlay-image');
  const tag = document.getElementById('overlay-tag');
  const title = document.getElementById('overlay-title');
  const description = document.getElementById('overlay-description');
  const tech = document.getElementById('overlay-tech');
  const links = document.getElementById('overlay-links');

  if (image) image.style.background = project.gradient;
  if (tag) tag.textContent = project.tag;
  if (title) title.textContent = project.title;
  if (description) description.textContent = project.description;

  if (tech) {
    tech.innerHTML = project.techStack
      .map((t) => `<span class="tech-tag">${t}</span>`)
      .join('');
  }

  if (links) {
    let html = '';
    if (project.liveUrl) {
      html += `<a href="${project.liveUrl}" class="overlay-link" target="_blank" rel="noopener">Live Demo ↗</a>`;
    }
    if (project.githubUrl) {
      html += `<a href="${project.githubUrl}" class="overlay-link" target="_blank" rel="noopener">GitHub ↗</a>`;
    }
    links.innerHTML = html;
  }
}

function openOverlay(): void {
  const backdrop = document.getElementById('overlay-backdrop');
  const overlay = document.getElementById('project-overlay');
  if (!backdrop || !overlay) return;

  backdrop.classList.add('active');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    gsap.fromTo(overlay, { y: '100%', opacity: 1 }, { y: '0%', duration: 0.5, ease: 'power3.out' });
  } else {
    gsap.fromTo(
      overlay,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
    );
  }
  gsap.to(backdrop, { opacity: 1, duration: 0.3 });
}

function closeOverlay(): void {
  const backdrop = document.getElementById('overlay-backdrop');
  const overlay = document.getElementById('project-overlay');
  if (!backdrop || !overlay) return;

  const isMobile = window.innerWidth < 768;

  const onComplete = () => {
    backdrop.classList.remove('active');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (isMobile) {
    gsap.to(overlay, { y: '100%', duration: 0.4, ease: 'power3.in', onComplete });
  } else {
    gsap.to(overlay, { scale: 0.9, opacity: 0, duration: 0.3, ease: 'power3.in', onComplete });
  }
  gsap.to(backdrop, { opacity: 0, duration: 0.3 });
}

export function initOverlay(): void {
  // Card clicks
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-id');
      const project = getProjects().find((p) => p.id === projectId);
      if (project) {
        populateOverlay(project);
        openOverlay();
      }
    });
  });

  // Close button
  document.getElementById('overlay-close')?.addEventListener('click', closeOverlay);

  // Backdrop click
  document.getElementById('overlay-backdrop')?.addEventListener('click', closeOverlay);

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });

  // Mobile swipe-to-close
  let touchStartY = 0;
  const overlay = document.getElementById('project-overlay');
  if (overlay) {
    overlay.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    });
    overlay.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchEndY - touchStartY > 100) {
        closeOverlay();
      }
    });
  }
}
```

- [ ] **Step 3: Add overlay to index page and wire up**

Update `src/pages/index.astro` — add overlay import and component:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Projects from '../components/Projects.astro';
import ProjectOverlay from '../components/ProjectOverlay.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <Hero />
    <Projects />
  </main>
  <ProjectOverlay />
</Layout>

<script>
  import { initHeroAnimations, initNavScroll } from '../scripts/animations';
  import { initOverlay } from '../scripts/overlay';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initHeroAnimations();
    initOverlay();
  });
</script>
```

- [ ] **Step 4: Verify overlay works**

Check `http://localhost:4321`:
- Click a project card → overlay opens with smooth scale animation
- Overlay shows project title, description, tech tags, links
- Click X, backdrop, or press ESC → overlay closes
- On mobile viewport, overlay slides up from bottom

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectOverlay.astro src/scripts/overlay.ts src/pages/index.astro
git commit -m "feat: add project detail overlay with GSAP transitions"
```

---

### Task 7: About Section + Constellation Visual

**Files:**
- Create: `src/components/About.astro`
- Create: `src/components/Constellation.astro`
- Create: `src/scripts/constellation.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create constellation canvas logic**

Create `src/scripts/constellation.ts`:

```typescript
interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export function initConstellation(canvasId: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  let width: number;
  let height: number;
  let dots: Dot[] = [];
  const connectionDistance = 120;

  function resize(): void {
    const rect = canvas!.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas!.width = width * dpr;
    canvas!.height = height * dpr;
    ctx!.scale(dpr, dpr);
    generateDots();
  }

  function generateDots(): void {
    const count = Math.floor((width * height) / 8000);
    dots = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      dots.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius: Math.random() * 2 + 1,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(time: number): void {
    ctx!.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.15;
          ctx!.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
          ctx!.lineWidth = 0.5;
          ctx!.beginPath();
          ctx!.moveTo(dots[i].x, dots[i].y);
          ctx!.lineTo(dots[j].x, dots[j].y);
          ctx!.stroke();
        }
      }
    }

    // Draw dots
    for (const dot of dots) {
      const pulse = Math.sin(time * dot.pulseSpeed + dot.pulseOffset);
      const currentRadius = dot.radius + pulse * 0.5;
      const alpha = 0.4 + pulse * 0.2;

      // Gentle drift
      dot.x = dot.baseX + Math.sin(time * 0.001 + dot.pulseOffset) * 3;
      dot.y = dot.baseY + Math.cos(time * 0.001 + dot.pulseOffset) * 3;

      ctx!.fillStyle = `rgba(129, 140, 248, ${alpha})`;
      ctx!.beginPath();
      ctx!.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);
      ctx!.fill();

      // Glow
      ctx!.fillStyle = `rgba(129, 140, 248, ${alpha * 0.3})`;
      ctx!.beginPath();
      ctx!.arc(dot.x, dot.y, currentRadius * 3, 0, Math.PI * 2);
      ctx!.fill();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}
```

- [ ] **Step 2: Create Constellation component**

Create `src/components/Constellation.astro`:

```astro
<canvas class="constellation" id="constellation-canvas"></canvas>

<style>
  .constellation {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
```

- [ ] **Step 3: Create About component**

Create `src/components/About.astro`:

```astro
---
import Constellation from './Constellation.astro';
---

<section class="about-section" id="about">
  <div class="about-header">
    <span class="section-label">About</span>
    <h2 class="section-title">A bit about me</h2>
  </div>
  <div class="about-grid">
    <div class="about-text">
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
    <div class="about-visual">
      <Constellation />
    </div>
  </div>
</section>

<style>
  .about-section {
    padding: var(--section-padding);
    position: relative;
  }

  .about-header {
    margin-bottom: 48px;
  }

  .section-label {
    display: block;
    color: var(--accent-start);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 36px;
    font-weight: 300;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }

  .about-paragraph {
    color: var(--text-muted);
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 20px;
    opacity: 0;
  }

  .resume-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding: 12px 24px;
    border: 1px solid rgba(129, 140, 248, 0.3);
    border-radius: 8px;
    color: var(--accent-start);
    font-size: 14px;
    transition: all 0.3s var(--ease-cinematic);
    opacity: 0;
  }

  .resume-button:hover {
    border-color: var(--accent-start);
    box-shadow: 0 0 20px rgba(129, 140, 248, 0.2);
    color: var(--text-primary);
  }

  .about-visual {
    height: 400px;
    position: relative;
  }

  @media (max-width: 768px) {
    .about-section {
      padding: var(--section-padding-mobile);
    }

    .about-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .about-visual {
      height: 250px;
    }
  }
</style>
```

- [ ] **Step 4: Add About to index page and wire constellation**

Update `src/pages/index.astro` — add import and component:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Projects from '../components/Projects.astro';
import ProjectOverlay from '../components/ProjectOverlay.astro';
import About from '../components/About.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <Hero />
    <Projects />
    <About />
  </main>
  <ProjectOverlay />
</Layout>

<script>
  import { initHeroAnimations, initNavScroll } from '../scripts/animations';
  import { initOverlay } from '../scripts/overlay';
  import { initConstellation } from '../scripts/constellation';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initHeroAnimations();
    initOverlay();
    initConstellation('constellation-canvas');
  });
</script>
```

- [ ] **Step 5: Verify about section renders**

Check `http://localhost:4321` — scroll to About section. Two-column layout: bio text left (starts invisible, animations next task), constellation canvas right with pulsing dots and connecting lines. Resume button visible below text.

- [ ] **Step 6: Commit**

```bash
git add src/components/About.astro src/components/Constellation.astro src/scripts/constellation.ts src/pages/index.astro
git commit -m "feat: add about section with constellation canvas visual"
```

---

### Task 8: Contact Section + Footer

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Contact component**

Create `src/components/Contact.astro`:

```astro
<section class="contact-section" id="contact">
  <div class="contact-content">
    <span class="section-label">Get in Touch</span>
    <h2 class="contact-title">Say hello</h2>
    <p class="contact-subtitle">Always open to interesting conversations and collaborations.</p>
    <div class="contact-links">
      <a href="mailto:hello@anupam.dev" class="contact-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 4L12 13L2 4" />
        </svg>
        Email
      </a>
      <a href="https://github.com/anupam" target="_blank" rel="noopener" class="contact-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a>
      <a href="https://linkedin.com/in/anupam" target="_blank" rel="noopener" class="contact-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </a>
    </div>
  </div>
</section>

<footer class="footer">
  <p>Designed with intention. Built with care.</p>
</footer>

<style>
  .contact-section {
    padding: 120px 48px 80px;
    text-align: center;
  }

  .contact-content {
    max-width: 500px;
    margin: 0 auto;
  }

  .section-label {
    display: block;
    color: var(--accent-start);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .contact-title {
    font-size: 36px;
    font-weight: 300;
    margin-bottom: 12px;
    opacity: 0;
  }

  .contact-subtitle {
    color: var(--text-dim);
    font-size: 15px;
    margin-bottom: 40px;
    opacity: 0;
  }

  .contact-links {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .contact-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: 1px solid var(--border-subtle);
    border-radius: 28px;
    color: var(--text-muted);
    font-size: 14px;
    transition: all 0.3s var(--ease-cinematic);
    opacity: 0;
  }

  .contact-link:hover {
    color: var(--text-primary);
    border-color: var(--accent-start);
    box-shadow: 0 0 20px rgba(129, 140, 248, 0.15);
  }

  .footer {
    padding: 32px 48px;
    text-align: center;
    border-top: 1px solid var(--border-subtle);
  }

  .footer p {
    color: var(--text-dim);
    font-size: 13px;
    opacity: 0;
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 80px 24px 60px;
    }

    .contact-links {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
```

- [ ] **Step 2: Add Contact to index page**

Update `src/pages/index.astro` — add import and component:

```astro
---
import Layout from '../layouts/Layout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Projects from '../components/Projects.astro';
import ProjectOverlay from '../components/ProjectOverlay.astro';
import About from '../components/About.astro';
import Contact from '../components/Contact.astro';
---

<Layout title="Anupam — Software Engineer">
  <Nav />
  <main>
    <Hero />
    <Projects />
    <About />
    <Contact />
  </main>
  <ProjectOverlay />
</Layout>

<script>
  import { initHeroAnimations, initNavScroll } from '../scripts/animations';
  import { initOverlay } from '../scripts/overlay';
  import { initConstellation } from '../scripts/constellation';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initHeroAnimations();
    initOverlay();
    initConstellation('constellation-canvas');
  });
</script>
```

- [ ] **Step 3: Verify contact section renders**

Check `http://localhost:4321` — scroll to bottom. Centered section with title, subtitle, three social pill links with icons, and footer. Text starts invisible (animated in next task).

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.astro src/pages/index.astro
git commit -m "feat: add contact section with social links and footer"
```

---

### Task 9: Section Scroll Animations

**Files:**
- Modify: `src/scripts/animations.ts`

- [ ] **Step 1: Add scroll reveal animations for all sections**

Add these functions to the end of `src/scripts/animations.ts`:

```typescript
export function initProjectsAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.project-card', { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    '.project-card',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top bottom-=100',
      },
    }
  );
}

export function initAboutAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.about-paragraph, .resume-button', { opacity: 1, y: 0 });
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
        trigger: '.about-grid',
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
}

export function initContactAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.contact-title, .contact-subtitle, .contact-link, .footer p', { opacity: 1, y: 0 });
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
      '.contact-link',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' },
      '-=0.2'
    )
    .fromTo('.footer p', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1');
}
```

- [ ] **Step 2: Wire new animation functions into index page**

Update the `<script>` block in `src/pages/index.astro`:

```astro
<script>
  import {
    initHeroAnimations,
    initNavScroll,
    initProjectsAnimations,
    initAboutAnimations,
    initContactAnimations,
  } from '../scripts/animations';
  import { initOverlay } from '../scripts/overlay';
  import { initConstellation } from '../scripts/constellation';

  document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initHeroAnimations();
    initProjectsAnimations();
    initAboutAnimations();
    initContactAnimations();
    initOverlay();
    initConstellation('constellation-canvas');
  });
</script>
```

- [ ] **Step 3: Verify all scroll animations**

Check `http://localhost:4321`:
- Scroll past hero → project cards stagger in from below
- Scroll to About → paragraphs reveal one by one, resume button fades in last
- Scroll to Contact → title, subtitle, and links stagger in
- Footer text fades in at the end

- [ ] **Step 4: Commit**

```bash
git add src/scripts/animations.ts src/pages/index.astro
git commit -m "feat: add GSAP ScrollTrigger animations for all sections"
```

---

### Task 10: Final Polish + Build Verification

**Files:**
- Modify: `src/styles/global.css` (scrollbar styling)
- No new files

- [ ] **Step 1: Add custom scrollbar styling**

Add to the end of `src/styles/global.css`:

```css
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(129, 140, 248, 0.5);
}

/* Selection color */
::selection {
  background: rgba(129, 140, 248, 0.3);
  color: var(--text-primary);
}
```

- [ ] **Step 2: Run production build**

```bash
cd /Users/biplav00/Documents/personal/anupam-portfolio
npx astro build
```

Expected: Build succeeds with no errors. Output in `dist/` folder.

- [ ] **Step 3: Preview production build**

```bash
npx astro preview
```

Expected: Site runs at `http://localhost:4321` with all animations working. Check:
- Hero animation sequence plays on load
- Nav becomes opaque on scroll
- Project cards animate in, hover effects work, overlay opens/closes
- About text reveals, constellation animates, resume button works
- Contact links animate in, hover glow works
- Mobile: hamburger menu, single column layouts, swipe-to-close overlay
- Reduced motion: disable animations in OS settings → all content visible immediately, no animations

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add scrollbar styling and selection color polish"
```

- [ ] **Step 5: Final commit with build verification**

```bash
git add -A
git status
```

If there are any unstaged changes, stage and commit them:

```bash
git commit -m "chore: final build verification"
```
