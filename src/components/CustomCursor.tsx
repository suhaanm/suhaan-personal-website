import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(false);
  const hideTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      // Show cursor on first movement
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '0.4';
      }

      // Hide when mouse stops moving (for cleanliness)
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => {
        if (ringRef.current && !isHoveringRef.current) {
          ringRef.current.style.opacity = '0.15';
        }
      }, 2000);
    };

    const onEnterInteractive = () => { isHoveringRef.current = true; };
    const onLeaveInteractive = () => { isHoveringRef.current = false; };

    const attachListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, [data-cursor-hover], .glass-card');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    document.addEventListener('mousemove', onMove);

    // Periodically re-attach listeners for dynamic content
    const interval = setInterval(attachListeners, 2000);
    attachListeners();

    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.14;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.14;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${targetRef.current.x - 3}px, ${targetRef.current.y - 3}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;

        if (isHoveringRef.current) {
          ringRef.current.style.width = '44px';
          ringRef.current.style.height = '44px';
          ringRef.current.style.opacity = '0.7';
          ringRef.current.style.borderColor = 'rgba(0, 188, 212, 0.7)';
          ringRef.current.style.transform = `translate(${posRef.current.x - 22}px, ${posRef.current.y - 22}px)`;
        } else {
          ringRef.current.style.width = '36px';
          ringRef.current.style.height = '36px';
          ringRef.current.style.opacity = '0.4';
          ringRef.current.style.borderColor = 'rgba(33, 150, 243, 0.35)';
        }
      }

      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimerRef.current);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Core dot — fast, precise */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          width: '6px',
          height: '6px',
          background: '#00BCD4',
          borderRadius: '50%',
          mixBlendMode: 'normal',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Outer ring — laggy, decorative */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          width: '36px',
          height: '36px',
          border: '1.5px solid rgba(33, 150, 243, 0.35)',
          borderRadius: '50%',
          mixBlendMode: 'normal',
          opacity: 0,
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  );
}
