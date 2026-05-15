import { useRef, useCallback } from 'react';
import ScrambleText from '@/components/ScrambleText';
import TerminalTyping from '@/components/TerminalTyping';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const experiences = [
  { company: 'Alchemy Capital Management', role: 'Fund Quant Intern', period: '2024', description: 'Worked with the Fund Quant team on regime classification, portfolio optimization, feature engineering, and mathematical problem framing. Applied optimization approaches including linear programming.', skills: ['Portfolio Optimization', 'Regime Classification', 'Linear Programming', 'Feature Engineering'], accent: '#D4AF37' },
  { company: 'Hungama Digital Media Entertainment', role: 'Technology & Product Intern', period: '2023', description: "Built a user-facing box office comparison feature for Bollywood Hungama — comparing movies, celebrities, and studios across entertainment data.", skills: ['Product Development', 'Data Visualization', 'UX Design', 'Web Development'], accent: '#2196F3' },
];

function TiltCard({ children, className = '', intensity = 5 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.005, 1.005, 1.005)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Experience() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'fade-left', childSelector: '.exp-item', stagger: 0.2, distance: 60, start: 'top 80%' });

  return (
    <section ref={sectionRef} id="experience" className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#F07178' }}>// EXPERIENCE</span>
          <ScrambleText text="Experience highlights" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <div className="space-y-6 md:space-y-8">
          {experiences.map((exp) => (
            <TiltCard key={exp.company} intensity={4} className="exp-item">
              <div className="glass-card scanline-hover p-6 md:p-8 lg:p-10 group relative overflow-hidden" style={{ borderRadius: '12px', borderLeft: `3px solid ${exp.accent}`, transition: 'box-shadow 0.4s ease' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`); e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`); }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 40px ${exp.accent}08`; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="flex flex-wrap items-start justify-between gap-3 md:gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: exp.accent, boxShadow: `0 0 10px ${exp.accent}60` }} />
                      <span className="font-mono-accent" style={{ color: exp.accent, fontSize: '9px' }}>{exp.period}</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl" style={{ color: 'var(--text-heading)' }}>{exp.company}</h3>
                  </div>
                  <span className="font-mono px-3 py-1" style={{ fontSize: '9px', letterSpacing: '0.1em', background: `${exp.accent}10`, color: exp.accent, border: `1px solid ${exp.accent}20`, borderRadius: '4px' }}>{exp.role}</span>
                </div>
                <p className="text-base md:text-lg mb-5 md:mb-6 max-w-3xl" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  <TerminalTyping text={exp.description} speed={12} delay={0} />
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => <span key={skill} className="font-mono" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.08em', background: 'var(--tag-bg)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--tag-border)' }}>{skill}</span>)}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
