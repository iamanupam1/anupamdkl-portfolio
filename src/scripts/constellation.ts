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
