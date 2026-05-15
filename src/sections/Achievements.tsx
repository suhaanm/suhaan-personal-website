import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from '@/components/ScrambleText';
import FloatingShapes from '@/components/FloatingShapes';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  { value: 124, label: 'Math Competition Medals', color: '#2196F3', suffix: '' },
  { value: 97, label: 'Gold Medals', color: '#00BCD4', suffix: '' },
  { value: 1, label: 'USA(J)MO Qualifier', color: '#7C3AED', suffix: '×' },
  { value: 1, label: 'Springer Published', color: '#D4AF37', suffix: '×' },
  { value: 1, label: 'CTY Grand Honors', color: '#2196F3', suffix: '×' },
  { value: 2, label: 'Education Initiatives', color: '#00BCD4', suffix: '' },
];

export default function Achievements() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'scale-in', childSelector: '.reveal-item', stagger: 0.08, start: 'top 80%' });
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    countersRef.current.forEach((counter, i) => {
      if (!counter) return;
      const target = parseInt(counter.dataset.target || '0', 10);
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(obj, { val: target, duration: 2.2, delay: i * 0.1, ease: 'power2.out',
            onUpdate: () => { counter.textContent = Math.round(obj.val).toString(); },
          });
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0"><FloatingShapes count={8} /></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: '5%', left: '10%', background: 'radial-gradient(circle, rgba(33,150,243,0.02) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ bottom: '5%', right: '10%', background: 'radial-gradient(circle, rgba(0,188,212,0.02) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16 text-center">
          <span className="font-mono-accent block mb-4" style={{ color: '#2196F3' }}>// ACHIEVEMENTS</span>
          <ScrambleText text="Signals of depth" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6 mx-auto" style={{ maxWidth: '200px' }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 lg:gap-12">
          {achievements.map((ach, index) => (
            <div key={ach.label} className="reveal-item text-center group">
              <div className="relative inline-block">
                <span ref={(el) => { countersRef.current[index] = el; }} data-target={ach.value} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl block transition-all duration-500 group-hover:scale-110" style={{ color: ach.color, textShadow: `0 0 50px ${ach.color}15` }}>
                  0{ach.suffix}
                </span>
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${ach.color}08 0%, transparent 70%)`, transform: 'scale(1.6)' }} />
              </div>
              <span className="font-mono-accent block mt-2 md:mt-3" style={{ color: 'var(--text-faint)', fontSize: '9px' }}>{ach.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
