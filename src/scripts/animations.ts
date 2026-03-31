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
    .fromTo('.hero-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.1')
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
      { opacity: 0, x: 10 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 },
      '-=0.4'
    )
    .to('.scroll-indicator', { opacity: 1, duration: 0.4 }, '-=0.2');

  // Accent word gradient shimmer
  gsap.to('.hero-accent', {
    backgroundPosition: '200% 200%',
    duration: 4,
    repeat: -1,
    ease: 'linear',
  });

  // Scroll indicator is CSS-animated (scroll-line), no GSAP needed

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

  gsap.to('.particles', {
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
}

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

export function initBlogAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.blog-card', { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    '.blog-card',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.blog-grid',
        start: 'top bottom-=100',
      },
    }
  );
}

export function initAboutAnimations(): void {
  if (prefersReducedMotion()) {
    gsap.set('.about-text p, .stat', { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    '.about-text p',
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
    '.stat',
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

export function initContactAnimations(): void {
  // Contact section is a simple footer — no scroll-triggered animations needed
}
