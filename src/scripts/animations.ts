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
