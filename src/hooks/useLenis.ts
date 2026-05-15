import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let globalLenis: Lenis | null = null;

export function getLenis() {
  return globalLenis;
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Expose on window for sections
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      globalLenis = null;
    };
  }, []);

  return lenisRef;
}
