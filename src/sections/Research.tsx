import { useRef, useCallback } from 'react';
import ScrambleText from '@/components/ScrambleText';
import WaveCanvas from '@/components/WaveCanvas';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const researchItems = [
  { title: 'Integer Linear Programming', description: 'Explored the simplex tableau method and efficient cases for adapted optimization problems.', symbol: '∑', formula: 'min cᵀx  s.t.  Ax = b,  x ≥ 0', accent: '#2196F3' },
  { title: 'Weather Forecasting with ML', description: 'Compared logistic regression and advanced ML techniques. Published in Springer, presented at ICBT Oxford 2024.', symbol: '∫', formula: 'P(rain|X) = σ(β₀ + β₁X₁ + ... + βₙXₙ)', accent: '#00BCD4' },
  { title: 'AI Self-Detection & Plagiarism', description: 'Investigated whether generative AI models can identify their own outputs.', symbol: '∂', formula: 'detect(M, text) → {self, other, human}', accent: '#7C3AED' },
  { title: 'Computational Music Analysis', description: 'Used Mathematica at Wolfram Summer Camp to analyse structural patterns in EDM song drops.', symbol: '∇', formula: 'spectrum(f) = |FFT(audio)[f]|²', accent: '#D4AF37' },
];

function TiltCard({ children, className = '', intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.01, 1.01, 1.01)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Research() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'scale-in', childSelector: '.research-card', stagger: 0.15, start: 'top 80%' });

  return (
    <section ref={sectionRef} id="research" className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0" style={{ opacity: 0.3 }}><WaveCanvas /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(33,150,243,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,188,212,0.015) 1px, transparent 1px)', backgroundSize: '40px 40px', animation: 'grid-pulse 4s ease infinite' }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#D4AF37' }}>// RESEARCH</span>
          <ScrambleText text="Research & technical exploration" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {researchItems.map((item) => (
            <TiltCard key={item.title} intensity={7} className="research-card">
              <div className="glass-card scanline-hover p-6 md:p-8 lg:p-10 group relative overflow-hidden h-full" style={{ borderRadius: '12px', transition: 'border-color 0.4s ease, box-shadow 0.4s ease' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`); e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`); }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${item.accent}25`; e.currentTarget.style.boxShadow = `0 0 25px ${item.accent}08`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="absolute top-3 left-3 w-3 h-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderTop: `1px solid ${item.accent}`, borderLeft: `1px solid ${item.accent}` }} />
                <div className="absolute bottom-3 right-3 w-3 h-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ borderBottom: `1px solid ${item.accent}`, borderRight: `1px solid ${item.accent}` }} />
                <span className="absolute top-5 right-5 font-display text-5xl md:text-6xl pointer-events-none transition-all duration-500 group-hover:opacity-20" style={{ color: item.accent, opacity: 0.06 }}>{item.symbol}</span>
                <div className="relative z-10">
                  <div className="w-2 h-2 rounded-full mb-3 md:mb-4" style={{ background: item.accent, boxShadow: `0 0 10px ${item.accent}50` }} />
                  <h3 className="font-heading text-lg sm:text-xl md:text-2xl mb-3 pr-10" style={{ color: 'var(--text-heading)' }}>{item.title}</h3>
                  <p className="text-sm mb-4 md:mb-5" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.description}</p>
                  <div className="font-mono p-2.5 md:p-3" style={{ fontSize: '11px', background: 'var(--code-bg)', border: `1px solid ${item.accent}18`, borderRadius: '6px', color: item.accent, letterSpacing: '0.02em' }}>{item.formula}</div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
