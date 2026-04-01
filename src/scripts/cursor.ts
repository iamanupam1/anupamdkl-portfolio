let initialized = false;

export function initCursor(): void {
  if (initialized) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  initialized = true;
  dot.style.display = 'none';

  let mouseX = -100;
  let mouseY = -100;
  let isVisible = false;
  let isHovering = false;

  const interactiveSelector = 'a, button, [role="button"], .project-row';
  const textInputSelector = 'input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="password"], textarea, [contenteditable="true"]';

  function show(): void {
    if (isVisible) return;
    isVisible = true;
    ring.style.opacity = '1';
  }

  function hide(): void {
    if (!isVisible) return;
    isVisible = false;
    ring.style.opacity = '0';
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) show();

    const offset = isHovering ? 24 : 12;
    ring.style.transform = `translate(${mouseX - offset}px, ${mouseY - offset}px)`;
  });

  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;

    if (target.closest(textInputSelector)) {
      ring.style.opacity = '0';
      document.documentElement.style.cursor = 'text';
      return;
    }

    if (target.closest(interactiveSelector)) {
      isHovering = true;
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement;

    if (target.closest(textInputSelector)) {
      if (isVisible) ring.style.opacity = '1';
      document.documentElement.style.cursor = '';
      return;
    }

    if (target.closest(interactiveSelector)) {
      const related = e.relatedTarget as HTMLElement | null;
      if (!related || !related.closest(interactiveSelector)) {
        isHovering = false;
        ring.classList.remove('hovering');
      }
    }
  });

  document.addEventListener('mousedown', () => {
    if (!isVisible) return;
    ring.classList.add('clicking');
  });

  document.addEventListener('mouseup', () => {
    ring.classList.remove('clicking');
  });

  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const offset = isHovering ? 24 : 12;
    ring.style.transform = `translate(${mouseX - offset}px, ${mouseY - offset}px)`;
    show();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });

  window.matchMedia('(pointer: coarse)').addEventListener('change', (e) => {
    if (e.matches) {
      hide();
      ring.style.display = 'none';
    } else {
      ring.style.display = '';
    }
  });
}
