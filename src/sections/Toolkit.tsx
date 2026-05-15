import { useRef, useCallback } from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';
import ScrambleText from '@/components/ScrambleText';
import MagneticButton from '@/components/MagneticButton';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const clusters = [
  { name: 'Programming', skills: ['Python', 'JavaScript', 'HTML/CSS', 'Flask', 'Haskell', 'Java/Kotlin', 'SQL', 'Swift', 'Mathematica'], color: '#2196F3' },
  { name: 'AI & ML', skills: ['Machine Learning', 'Forecasting', 'Feature Engineering', 'Adaptive Learning', 'Model Comparison'], color: '#00BCD4' },
  { name: 'Mathematics', skills: ['Algorithms', 'Linear Programming', 'Calculus', 'Linear Algebra', 'Graph Theory', 'Number Theory', 'Combinatorics'], color: '#7C3AED' },
];

function TiltCard({ children, className = '', intensity = 10 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.01, 1.01, 1.01)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Toolkit() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'fade-up', childSelector: '.reveal-item', stagger: 0.12, start: 'top 80%' });

  return (
    <section ref={sectionRef} className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none"><ParticleCanvas particleCount={40} connectionDistance={120} colors={['#2196F3', '#00BCD4', '#7C3AED']} /></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#7C3AED' }}>// TECHNICAL_TOOLKIT</span>
          <ScrambleText text="Technical toolkit" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <div className="relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 0 }} viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.2 }} /><stop offset="100%" style={{ stopColor: '#2196F3', stopOpacity: 0.06 }} /></linearGradient>
              <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.2 }} /><stop offset="100%" style={{ stopColor: '#00BCD4', stopOpacity: 0.06 }} /></linearGradient>
              <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style={{ stopColor: '#D4AF37', stopOpacity: 0.2 }} /><stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.06 }} /></linearGradient>
            </defs>
            <line x1="600" y1="80" x2="200" y2="300" stroke="url(#g1)" strokeWidth="1" strokeDasharray="6 6"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="2.5s" repeatCount="indefinite" /></line>
            <line x1="600" y1="80" x2="600" y2="300" stroke="url(#g2)" strokeWidth="1" strokeDasharray="6 6"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="2.5s" repeatCount="indefinite" /></line>
            <line x1="600" y1="80" x2="1000" y2="300" stroke="url(#g3)" strokeWidth="1" strokeDasharray="6 6"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="2.5s" repeatCount="indefinite" /></line>
          </svg>
          <div className="reveal-item text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5" style={{ border: '1px solid rgba(212, 175, 55, 0.2)', background: 'rgba(212, 175, 55, 0.03)', borderRadius: '8px', boxShadow: '0 0 35px rgba(212, 175, 55, 0.04)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4AF37', boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }} />
              <span className="font-display text-xl md:text-2xl lg:text-3xl" style={{ color: '#D4AF37' }}>AI + Math + Product</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {clusters.map((cluster) => (
              <TiltCard key={cluster.name} intensity={7} className="reveal-item">
                <div className="glass-card p-6 md:p-8" style={{ borderRadius: '12px', borderTop: `2px solid ${cluster.color}` }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`); e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`); }}>
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-2 h-2 rounded-full" style={{ background: cluster.color, boxShadow: `0 0 10px ${cluster.color}50` }} />
                    <h3 className="font-heading text-lg md:text-xl" style={{ color: cluster.color }}>{cluster.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cluster.skills.map((skill) => (
                      <MagneticButton key={skill} strength={0.15} className="font-mono px-3 py-1.5" style={{ fontSize: '10px', background: 'var(--tag-bg)', border: '1px solid var(--tag-border)', color: 'var(--text-muted)', borderRadius: '20px' }}>
                        {skill}
                      </MagneticButton>
                    ))}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
