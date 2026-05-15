import { useEffect, useRef, useState } from 'react';
import { ParticleSphere } from '@/components/ParticleSphere';
import TerminalTyping from '@/components/TerminalTyping';
import { getLenis } from '@/hooks/useLenis';
import gsap from 'gsap';

export default function Hero() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<ParticleSphere | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    sphereRef.current = new ParticleSphere(canvasContainerRef.current);

    const onScroll = () => {
      if (!canvasContainerRef.current || !heroRef.current) return;
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const opacity = Math.max(0.02, 1 - (scrollY / vh) * 0.85);
      canvasContainerRef.current.style.opacity = String(opacity);
      const content = heroRef.current.querySelector('.hero-content') as HTMLElement;
      if (content) content.style.transform = `translateY(${scrollY * 0.18}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    if (textRef.current) {
      const items = textRef.current.querySelectorAll('.hero-fade');
      gsap.set(items, { opacity: 0, y: 30 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.6,
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      sphereRef.current?.dispose();
    };
  }, []);

  const scrollTo = (target: string) => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -64 });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden flex flex-col"
      style={{ height: '100vh', background: 'linear-gradient(180deg, #F0F2F5 0%, #E8EDF2 40%, #F0F2F5 100%)' }}
    >
      {/* Particle Sphere — upper portion only */}
      <div
        ref={canvasContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '62%',
          zIndex: 1,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          backgroundImage:
            'linear-gradient(rgba(33, 150, 243, 0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(33, 150, 243, 0.012) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Vignette — fades edges of the sphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 25%, transparent 20%, rgba(240, 242, 245, 0.7) 55%, rgba(240, 242, 245, 0.92) 100%)',
        }}
      />

      {/* Text content — bottom portion */}
      <div
        ref={textRef}
        className="hero-content relative z-10 flex flex-col items-center justify-end px-5 md:px-10"
        style={{ height: '100%', paddingBottom: '10vh' }}
      >
        <div className="text-center">
          {/* Tag */}
          <div className="hero-fade mb-4 md:mb-5 flex items-center justify-center gap-3">
            <span
              className="font-mono px-3 py-1.5 flex items-center gap-2"
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                background: 'rgba(0, 188, 212, 0.06)',
                border: '1px solid rgba(0, 188, 212, 0.18)',
                color: '#00838F',
                borderRadius: '20px',
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: '#00BCD4', boxShadow: '0 0 6px rgba(0, 188, 212, 0.4)' }}
              />
              AI × MATHEMATICS × EDTECH
            </span>
          </div>

          {/* Name Heading */}
          <h2 className="hero-fade font-mono text-xs tracking-[0.3em] uppercase mb-4 opacity-40" style={{ color: '#111133' }}>
            Suhaan Mobhani
          </h2>

          {/* Main headline */}
          <h1
            className="hero-fade font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 md:mb-5 max-w-4xl mx-auto"
            style={{ color: '#111133', lineHeight: 1.1 }}
          >
            <TerminalTyping
              text="Building intelligent systems for learning, reasoning, and discovery."
              speed={30}
              delay={600}
              onComplete={() => setTypingDone(true)}
            />
          </h1>

          {/* Subtitle */}
          <p
            className="hero-fade text-sm sm:text-base md:text-lg lg:text-xl mb-7 md:mb-9 max-w-2xl mx-auto font-light"
            style={{
              color: 'rgba(26, 26, 46, 0.5)',
              lineHeight: 1.65,
              minHeight: '1.65em',
            }}
          >
            {typingDone && (
              <TerminalTyping
                text="MEng Computing (AI & ML) at Imperial College London. Founder of Tutix.ai."
                speed={22}
                delay={60}
              />
            )}
          </p>

          {/* CTA buttons */}
          <div className="hero-fade flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <button
              className="group relative px-6 md:px-8 py-3 font-mono text-xs tracking-widest uppercase overflow-hidden transition-all duration-500"
              style={{
                background: 'rgba(33, 150, 243, 0.08)',
                border: '1px solid rgba(33, 150, 243, 0.25)',
                color: '#2196F3',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(33, 150, 243, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.45)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(33, 150, 243, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(33, 150, 243, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => scrollTo('#work')}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#2196F3' }} />
                Explore Work
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </button>

            <button
              className="font-mono text-xs tracking-widest uppercase px-6 md:px-8 py-3 transition-all duration-300"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                color: 'rgba(26, 26, 46, 0.4)',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 188, 212, 0.3)';
                e.currentTarget.style.color = '#00838F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.color = 'rgba(26, 26, 46, 0.4)';
              }}
              onClick={() => scrollTo('#contact')}
            >
              Contact →
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 10 }}
      >
        <span
          className="font-mono"
          style={{ fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(26, 26, 46, 0.18)' }}
        >
          SCROLL
        </span>
        <div className="relative w-px h-8 md:h-10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <div
            className="absolute top-0 left-0 w-full h-[55%]"
            style={{
              background: 'linear-gradient(to bottom, #00BCD4, transparent)',
              animation: 'data-flow 2.2s ease infinite',
            }}
          />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '200px',
          background: 'linear-gradient(to bottom, transparent, var(--hero-fade))',
          zIndex: 7,
        }}
      />
    </section>
  );
}
