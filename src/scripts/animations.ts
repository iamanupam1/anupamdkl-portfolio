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

// --- Dot Grid ---

interface Dot {
  x: number;
  y: number;
  distFromCenter: number;
}

let dotCanvas: HTMLCanvasElement | null = null;
let dotCtx: CanvasRenderingContext2D | null = null;
let dots: Dot[] = [];
let heroMouseX = -1000;
let heroMouseY = -1000;
let dotStartTime = 0;
let dotAnimFrame = 0;
let cachedHeroEl: HTMLElement | null = null;
let cachedHeroWidth = 0;
let cachedHeroHeight = 0;
let cachedDpr = 1;

const DOT_SPACING = 65;
const DOT_INFLUENCE = 200;
const DOT_INFLUENCE_SQ = DOT_INFLUENCE * DOT_INFLUENCE;

function resizeDotCanvas(): void {
  if (!dotCanvas || !dotCtx || !cachedHeroEl) return;

  cachedDpr = window.devicePixelRatio || 1;
  const rect = cachedHeroEl.getBoundingClientRect();
  cachedHeroWidth = rect.width;
  cachedHeroHeight = rect.height;

  dotCanvas.width = cachedHeroWidth * cachedDpr;
  dotCanvas.height = cachedHeroHeight * cachedDpr;
  dotCanvas.style.width = cachedHeroWidth + 'px';
  dotCanvas.style.height = cachedHeroHeight + 'px';
  dotCtx.setTransform(cachedDpr, 0, 0, cachedDpr, 0, 0);

  dots = [];
  const cols = Math.ceil(cachedHeroWidth / DOT_SPACING);
  const rows = Math.ceil(cachedHeroHeight / DOT_SPACING);
  const cx = cachedHeroWidth / 2;
  const cy = cachedHeroHeight / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * DOT_SPACING + DOT_SPACING / 2;
      const y = r * DOT_SPACING + DOT_SPACING / 2;
      dots.push({ x, y, distFromCenter: Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) });
    }
  }
}

function drawDots(): void {
  if (!dotCtx) {
    return;
  }

  // Skip rendering when scrolled past hero
  if (window.scrollY > cachedHeroHeight) {
    dotAnimFrame = requestAnimationFrame(drawDots);
    return;
  }

  dotCtx.clearRect(0, 0, cachedHeroWidth, cachedHeroHeight);
  const elapsed = (performance.now() - dotStartTime) / 1000;

  // Single beginPath for inactive dots
  dotCtx.beginPath();
  const restOpacity = 0.03;
  let hasRestDots = false;

  // Collect active lines to draw after
  const activeLines: { x: number; y: number; angle: number; len: number; opacity: number }[] = [];

  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    const rippleDelay = dot.distFromCenter / 600;
    const rippleProgress = Math.min(Math.max((elapsed - rippleDelay) / 0.4, 0), 1);
    if (rippleProgress <= 0) continue;

    const dx = heroMouseX - dot.x;
    const dy = heroMouseY - dot.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < DOT_INFLUENCE_SQ) {
      const dist = Math.sqrt(distSq);
      const influence = 1 - dist / DOT_INFLUENCE;
      const eased = influence * influence;

      if (eased > 0.05) {
        activeLines.push({
          x: dot.x,
          y: dot.y,
          angle: Math.atan2(dy, dx),
          len: 10 * eased,
          opacity: (0.03 + eased * 0.3) * rippleProgress,
        });
        continue;
      }
    }

    // Rest dot — batch into single path
    dotCtx.moveTo(dot.x + 1.2, dot.y);
    dotCtx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
    hasRestDots = true;
  }

  // Draw all rest dots in one call
  if (hasRestDots) {
    dotCtx.fillStyle = `rgba(200, 245, 66, ${restOpacity})`;
    dotCtx.fill();
  }

  // Draw active lines individually (few of them, near cursor only)
  if (activeLines.length > 0) {
    dotCtx.lineCap = 'round';
    dotCtx.lineWidth = 1.2;
    for (const line of activeLines) {
      const cos = Math.cos(line.angle);
      const sin = Math.sin(line.angle);
      const halfLen = line.len / 2;
      dotCtx.beginPath();
      dotCtx.moveTo(line.x - cos * halfLen, line.y - sin * halfLen);
      dotCtx.lineTo(line.x + cos * halfLen, line.y + sin * halfLen);
      dotCtx.strokeStyle = `rgba(200, 245, 66, ${line.opacity})`;
      dotCtx.stroke();
    }
  }

  dotAnimFrame = requestAnimationFrame(drawDots);
}

function initDotGrid(): void {
  dotCanvas = document.getElementById('hero-dot-canvas') as HTMLCanvasElement;
  if (!dotCanvas) return;
  dotCtx = dotCanvas.getContext('2d');
  if (!dotCtx) return;

  cachedHeroEl = document.getElementById('hero');
  dotStartTime = performance.now();
  resizeDotCanvas();
  window.addEventListener('resize', resizeDotCanvas);
  dotAnimFrame = requestAnimationFrame(drawDots);
}

// --- Hero Animations ---

export function initHeroAnimations(): void {
  if (prefersReducedMotion()) {
    showAll('.hero-gradient, .hero-label, .hero-word, .hero-subtitle');
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

  // Mouse-reactive gradient orbs + light cone + dot grid tracking
  const hero = document.querySelector('.hero') as HTMLElement;
  const orb1 = document.getElementById('gradient-orb-1');
  const orb2 = document.getElementById('gradient-orb-2');
  const orb3 = document.getElementById('gradient-orb-3');

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const localX = e.clientX - hero.offsetLeft;
      const localY = e.clientY - hero.offsetTop + window.scrollY;
      const normX = localX / (hero.offsetWidth || 1) - 0.5;
      const normY = localY / (hero.offsetHeight || 1) - 0.5;

      // Orb parallax
      if (orb1) orb1.style.transform = `translate(${normX * 150}px, ${normY * 120}px)`;
      if (orb2) orb2.style.transform = `translate(${normX * -100}px, ${normY * -80}px)`;
      if (orb3) orb3.style.transform = `translate(${normX * 80}px, ${normY * 60}px)`;

      // Light cone (CSS custom properties)
      hero.style.setProperty('--mx', localX + 'px');
      hero.style.setProperty('--my', (e.clientY - hero.getBoundingClientRect().top) + 'px');

      // Dot grid cursor position
      heroMouseX = localX;
      heroMouseY = e.clientY - hero.getBoundingClientRect().top;
    });

    hero.addEventListener('mouseleave', () => {
      if (orb1) orb1.style.transform = 'translate(0, 0)';
      if (orb2) orb2.style.transform = 'translate(0, 0)';
      if (orb3) orb3.style.transform = 'translate(0, 0)';
      heroMouseX = -1000;
      heroMouseY = -1000;
    });
  }

  // Scroll deconstruction — rAF-throttled
  const label = document.getElementById('hero-label');
  const line1 = document.getElementById('hero-line1');
  const accent = document.getElementById('hero-accent');
  const divider = document.querySelector('#hero-content .hero-divider') as HTMLElement;
  const subtitle = document.getElementById('hero-subtitle');
  const reveal = document.getElementById('hero-reveal');

  if (hero && label && line1 && accent && divider && subtitle) {
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
      if (scrollTicking) return;
      scrollTicking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        const progress = Math.min(scrollY / (vh * 0.6), 1);

        if (progress <= 0) {
          label.style.transform = 'translateY(0)';
          label.style.opacity = '1';
          line1.style.transform = 'translateX(0)';
          line1.style.opacity = '1';
          accent.style.transform = 'translateX(0) scale(1)';
          accent.style.opacity = '1';
          divider.style.transform = 'scaleX(1)';
          divider.style.opacity = '1';
          subtitle.style.transform = 'translateY(0)';
          subtitle.style.opacity = '1';
          if (reveal) reveal.style.opacity = '1';
        } else {
          const ease = 1 - Math.pow(1 - progress, 3);
          const fadeStr = String(1 - ease);

          label.style.transform = `translateY(${-200 * ease}px)`;
          label.style.opacity = fadeStr;

          line1.style.transform = `translateX(${-120 * ease}px)`;
          line1.style.opacity = fadeStr;

          accent.style.transform = `translateX(${100 * ease}px) scale(${1 + 0.15 * ease})`;
          accent.style.opacity = fadeStr;

          divider.style.transform = `scaleX(${1 + 4 * ease})`;
          divider.style.opacity = fadeStr;

          subtitle.style.transform = `translateY(${80 * ease}px)`;
          subtitle.style.opacity = fadeStr;

          if (reveal) reveal.style.opacity = fadeStr;
        }

        scrollTicking = false;
      });
    });
  }

  // Init dot grid
  initDotGrid();
}

export function initNavScroll(): void {
  const nav = document.getElementById('nav');
  if (!nav) return;

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

      animate(row, { opacity: [0, 1] }, { duration: 0.3 });

      const imageX = isReversed ? 60 : -60;
      if (image) {
        animate(image,
          { opacity: [0, 1], x: [imageX, 0] },
          { duration: 0.7, type: 'spring', bounce: 0.15 }
        );
      }

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
    showAll('.about-text p');
    return;
  }

  inView('.about-grid', () => {
    animate('.about-text p',
      { opacity: [0, 1], y: [25, 0] },
      { duration: 0.6, delay: stagger(0.15), type: 'spring', bounce: 0.2 }
    );
  }, { amount: 0.2 });
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
