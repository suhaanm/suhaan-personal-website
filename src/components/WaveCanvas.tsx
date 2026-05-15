import { useEffect, useRef } from 'react';

export default function WaveCanvas({ className = '' }: { className?: string }) {
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

    const waves = [
      { amp: 40, freq: 0.008, speed: 0.008, offset: 0, color: '33, 150, 243' },
      { amp: 30, freq: 0.012, speed: -0.012, offset: 1.5, color: '0, 188, 212' },
      { amp: 20, freq: 0.018, speed: 0.018, offset: 3, color: '124, 58, 237' },
      { amp: 15, freq: 0.025, speed: -0.006, offset: 4.5, color: '212, 175, 55' },
    ];

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      const time = Date.now() * 0.001;

      for (const wave of waves) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = h / 2 + Math.sin(x * wave.freq + time * wave.speed * 60 + wave.offset) * wave.amp
            + Math.sin(x * wave.freq * 2.3 + time * wave.speed * 40) * wave.amp * 0.3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${wave.color}, 0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Second line offset
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = h / 2 + Math.sin(x * wave.freq + time * wave.speed * 60 + wave.offset + 0.5) * wave.amp * 0.7
            + Math.sin(x * wave.freq * 2.3 + time * wave.speed * 40 + 1) * wave.amp * 0.2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${wave.color}, 0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
