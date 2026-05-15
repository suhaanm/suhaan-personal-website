import { useEffect, useRef } from 'react';

interface StreamLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  chars: string;
}

export default function DataStream({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const chars = '01アイウエオカキクケコサシスセソタチツテト';
    const streams: StreamLine[] = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Create vertical falling streams
    for (let i = 0; i < 15; i++) {
      streams.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.15 + 0.03,
        chars: Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''),
      });
    }

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      for (const stream of streams) {
        stream.y += stream.speed;
        if (stream.y > height) {
          stream.y = -stream.length * 14;
          stream.x = Math.random() * width;
        }

        for (let j = 0; j < stream.length; j++) {
          const charY = stream.y + j * 14;
          if (charY < -14 || charY > height + 14) continue;

          const alpha = stream.opacity * (1 - j / stream.length);
          ctx.font = '11px "IBM Plex Mono", monospace';
          ctx.fillStyle = j === 0
            ? `rgba(0, 188, 212, ${alpha * 2})`
            : `rgba(33, 150, 243, ${alpha})`;
          ctx.fillText(stream.chars[j] || '0', stream.x, charY);
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
}
