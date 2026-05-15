import { useEffect, useRef } from 'react';

export default function SpotlightFollow() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('ontouchstart' in window) return;
    const spotlight = spotlightRef.current;
    if (!spotlight) return;

    let x = 0, y = 0, targetX = 0, targetY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      spotlight.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    animate();

    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <div
      ref={spotlightRef}
      className="fixed top-0 left-0 pointer-events-none z-[55] hidden md:block"
      style={{
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(33, 150, 243, 0.035) 0%, transparent 60%)',
        mixBlendMode: 'normal',
      }}
    />
  );
}
