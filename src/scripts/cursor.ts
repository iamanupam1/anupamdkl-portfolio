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
