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
    tech.replaceChildren();
    for (const t of project.techStack) {
      const span = document.createElement('span');
      span.className = 'tech-tag';
      span.textContent = t;
      tech.appendChild(span);
    }
  }

  if (links) {
    links.replaceChildren();
    const makeLink = (url: string, label: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.className = 'overlay-link';
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = `${label} ↗`;
      links.appendChild(a);
    };
    if (project.liveUrl) makeLink(project.liveUrl, 'Live Demo');
    if (project.githubUrl) makeLink(project.githubUrl, 'GitHub');
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
