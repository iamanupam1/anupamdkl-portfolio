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
