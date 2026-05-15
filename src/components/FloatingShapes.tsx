import { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  type: 'hex' | 'triangle' | 'circle' | 'square';
  color: string;
  opacity: number;
}

export default function FloatingShapes({ className = '', count = 12 }: { className?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const shapes: Shape[] = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    for (let i = 0; i < count; i++) {
      shapes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 20 + 8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        type: (['hex', 'triangle', 'circle', 'square'] as const)[Math.floor(Math.random() * 4)],
        color: ['#2196F3', '#00BCD4', '#7C3AED', '#D4AF37'][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.1 + 0.04,
      });
    }

    const drawShape = (s: Shape) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.strokeStyle = s.color;
      ctx.globalAlpha = s.opacity;
      ctx.lineWidth = 1;

      ctx.beginPath();
      if (s.type === 'circle') {
        ctx.arc(0, 0, s.size, 0, Math.PI * 2);
      } else if (s.type === 'square') {
        ctx.rect(-s.size, -s.size, s.size * 2, s.size * 2);
      } else if (s.type === 'triangle') {
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3 - Math.PI / 2;
          const px = Math.cos(angle) * s.size;
          const py = Math.sin(angle) * s.size;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (s.type === 'hex') {
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI * 2) / 6;
          const px = Math.cos(angle) * s.size;
          const py = Math.sin(angle) * s.size;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.rotSpeed;

        if (s.x < -50) s.x = cw + 50;
        if (s.x > cw + 50) s.x = -50;
        if (s.y < -50) s.y = ch + 50;
        if (s.y > ch + 50) s.y = -50;

        drawShape(s);
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
