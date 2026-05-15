import { useRef, useCallback } from 'react';
import ScrambleText from '@/components/ScrambleText';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

function TiltCard({ children, className = '', intensity = 6 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.01, 1.01, 1.01)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Creative() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'blur-in', childSelector: '.reveal-item', stagger: 0.15, start: 'top 80%' });

  return (
    <section ref={sectionRef} className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-10 md:mb-12">
          <span className="font-mono-accent block mb-4" style={{ color: '#D4AF37' }}>// CREATIVE_LAYER</span>
          <ScrambleText text="The creative layer" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <TiltCard intensity={5} className="reveal-item">
          <div className="glass-card scanline-hover p-8 md:p-10 lg:p-14 group relative overflow-hidden" style={{ borderRadius: '14px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, rgba(124, 58, 237, 0.015) 50%, var(--card-bg) 100%)', border: '1px solid rgba(212, 175, 55, 0.06)' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.18)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(212, 175, 55, 0.04)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div className="absolute top-4 left-4 w-6 md:w-8 h-6 md:h-8" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', borderLeft: '1px solid rgba(212, 175, 55, 0.2)' }} />
            <div className="absolute bottom-4 right-4 w-6 md:w-8 h-6 md:h-8" style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.2)', borderRight: '1px solid rgba(212, 175, 55, 0.2)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="font-mono px-2.5 md:px-3 py-1 flex items-center gap-1.5 md:gap-2" style={{ fontSize: '8px', letterSpacing: '0.12em', background: 'rgba(212, 175, 55, 0.06)', border: '1px solid rgba(212, 175, 55, 0.12)', color: '#D4AF37', borderRadius: '4px' }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: '#D4AF37' }} />MEDIA &amp; STORYTELLING
                </span>
              </div>
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Alongside technical work, hosted <em className="font-display" style={{ color: '#D4AF37', fontSize: '1.1em' }}>'Back to School,'</em> a celebrity web show on Bollywood Hungama's YouTube channel — reflecting an interest in storytelling, communication, and public-facing creative work.
              </p>
              <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4 opacity-25 group-hover:opacity-45 transition-opacity duration-500">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(212, 175, 55, 0.25)' }}>
                  <span style={{ color: '#D4AF37', fontSize: '9px' }}>▶</span>
                </div>
                <div className="flex-1 h-0.5 md:h-1 rounded-full overflow-hidden" style={{ background: 'var(--tag-bg)' }}>
                  <div className="h-full w-1/3 rounded-full" style={{ background: 'linear-gradient(90deg, #D4AF37, rgba(212, 175, 55, 0.3))' }} />
                </div>
                <span className="font-mono" style={{ fontSize: '8px', color: 'rgba(212, 175, 55, 0.35)' }}>04:32</span>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
