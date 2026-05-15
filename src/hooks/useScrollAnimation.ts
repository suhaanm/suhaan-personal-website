import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'fade-up' | 'fade-left' | 'fade-right' | 'scale-in' | 'blur-in' | 'line-draw';

interface ScrollAnimationOptions {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  ease?: string;
  distance?: number;
  childSelector?: string;
}

export function useScrollAnimation<T extends HTMLElement>(options: ScrollAnimationOptions = {}) {
  const ref = useRef<T>(null);
  const {
    type = 'fade-up',
    duration = 0.9,
    delay = 0,
    stagger = 0.12,
    start = 'top 82%',
    ease = 'power3.out',
    distance = 50,
    childSelector = '.reveal-item',
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const targets = childSelector
      ? ref.current.querySelectorAll(childSelector)
      : [ref.current];

    if (targets.length === 0) return;

    let toVars: gsap.TweenVars = { duration, delay, ease, stagger };

    switch (type) {
      case 'fade-up':
        gsap.set(targets, { opacity: 0, y: distance });
        toVars = { ...toVars, opacity: 1, y: 0 };
        break;
      case 'fade-left':
        gsap.set(targets, { opacity: 0, x: -distance });
        toVars = { ...toVars, opacity: 1, x: 0 };
        break;
      case 'fade-right':
        gsap.set(targets, { opacity: 0, x: distance });
        toVars = { ...toVars, opacity: 1, x: 0 };
        break;
      case 'scale-in':
        gsap.set(targets, { opacity: 0, scale: 0.92 });
        toVars = { ...toVars, opacity: 1, scale: 1 };
        break;
      case 'blur-in':
        gsap.set(targets, { opacity: 0, filter: 'blur(10px)' });
        toVars = { ...toVars, opacity: 1, filter: 'blur(0px)' };
        break;
      case 'line-draw':
        gsap.set(targets, { scaleX: 0, transformOrigin: 'left center' });
        toVars = { ...toVars, scaleX: 1 };
        break;
      default:
        gsap.set(targets, { opacity: 0, y: distance });
        toVars = { ...toVars, opacity: 1, y: 0 };
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start,
        toggleActions: 'play none none none',
      },
    });

    tl.to(targets, toVars);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === ref.current) st.kill();
      });
    };
  }, [type, duration, delay, stagger, start, ease, distance, childSelector]);

  return ref;
}

/* Parallax scroll helper */
export function useParallax(speed: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (rect.top - vh) / (rect.height + vh);
        el.style.transform = `translateY(${progress * speed * 100}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return ref;
}
