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
