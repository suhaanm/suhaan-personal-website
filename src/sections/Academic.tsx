import { useRef, useCallback } from 'react';
import ScrambleText from '@/components/ScrambleText';
import { useScrollAnimation, useParallax } from '@/hooks/useScrollAnimation';

function CodeLine({ num, indent = 0, children }: { num: number; indent?: number; children: React.ReactNode }) {
  return (
    <div className="code-line flex items-start" style={{ paddingLeft: `${indent * 24}px` }}>
      <span className="font-mono select-none mr-3 md:mr-4 text-right" style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '18px' }}>{num}</span>
      <span className="font-mono" style={{ fontSize: '12px', lineHeight: 1.8 }}>{children}</span>
    </div>
  );
}

function TiltCard({ children, className = '', intensity = 8 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.01, 1.01, 1.01)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Academic() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'fade-up', childSelector: '.reveal-item', stagger: 0.15, start: 'top 80%' });
  const codeRef = useParallax(0.1);

  return (
    <section ref={sectionRef} className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#00BCD4' }}>// ACADEMIC_FOUNDATIONS</span>
          <ScrambleText text="Academic foundations" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div ref={codeRef} className="reveal-item">
            <div className="relative overflow-hidden" style={{ background: 'var(--code-bg)', border: '1px solid var(--code-border)', borderRadius: '10px' }}>
              <div className="relative flex items-center gap-2 px-4 md:px-5" style={{ height: '34px', borderBottom: '1px solid var(--code-border)' }}>
                <div className="flex gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F56' }} />
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#27C93F' }} />
                </div>
                <span className="font-mono ml-3" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.05em' }}>education.json</span>
              </div>
              <div className="p-4 md:p-5">
                <CodeLine num={1}><span className="code-keyword">class</span> <span className="code-type">Education</span>:</CodeLine>
                <CodeLine num={2} indent={1}><span className="code-comment"># Imperial College London</span></CodeLine>
                <CodeLine num={3} indent={2}><span className="code-variable">focus_areas</span> = [<span className="code-string">&quot;Algorithms&quot;</span>, <span className="code-string">&quot;ML&quot;</span>,</CodeLine>
                <CodeLine num={4} indent={4}><span className="code-string">&quot;Linear Algebra&quot;</span>, <span className="code-string">&quot;Databases&quot;</span>,</CodeLine>
                <CodeLine num={5} indent={4}><span className="code-string">&quot;Discrete Math&quot;</span>, <span className="code-string">&quot;Logic&quot;</span>]</CodeLine>
                <CodeLine num={6} indent={1}><span className="code-comment"># Aditya Birla — 100% Merit Scholar</span></CodeLine>
                <CodeLine num={7} indent={2}><span className="code-variable">subjects</span> = [<span className="code-string">&quot;Math&quot;</span>, <span className="code-string">&quot;CS&quot;</span>, <span className="code-string">&quot;Physics&quot;</span>,</CodeLine>
                <CodeLine num={8} indent={4}><span className="code-string">&quot;Chem&quot;</span>, <span className="code-string">&quot;FMath&quot;</span>, <span className="code-string">&quot;Econ&quot;</span>]</CodeLine>
                <CodeLine num={9} indent={2}><span className="code-variable">extras</span> = [<span className="code-string">&quot;FIRST Robotics&quot;</span>, <span className="code-string">&quot;AP Scholar&quot;</span>]</CodeLine>
              </div>
            </div>
          </div>
          <div className="space-y-4 md:space-y-6">
            {[
              { school: 'Imperial College London', degree: 'MEng Computing', detail: 'Artificial Intelligence & Machine Learning', desc: 'Algorithms, computer systems, databases, calculus, linear algebra, discrete mathematics, logic, and reasoning.', accent: '#2196F3', label: 'IMPERIAL COLLEGE LONDON' },
              { school: 'Aditya Birla World Academy', degree: 'High School Diploma', detail: '100% Merit Scholarship for A Levels', desc: 'Mathematics, computer science, physics, chemistry, further mathematics, and economics. FIRST Robotics participant.', accent: '#00BCD4', label: 'ADITYA BIRLA WORLD ACADEMY' },
            ].map((edu) => (
              <TiltCard key={edu.school} intensity={7} className="reveal-item">
                <div className="glass-card p-6 md:p-8 group" style={{ borderRadius: '12px', borderLeft: `3px solid ${edu.accent}` }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`); e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`); }}>
                  <div className="flex items-center gap-3 mb-2 md:mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: edu.accent, boxShadow: `0 0 10px ${edu.accent}40` }} />
                    <span className="font-mono-accent" style={{ color: edu.accent, fontSize: '9px' }}>{edu.label}</span>
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl mb-1" style={{ color: 'var(--text-heading)' }}>{edu.degree}</h3>
                  <p className="font-mono mb-2 md:mb-3" style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{edu.detail}</p>
                  <p className="text-sm md:text-base" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{edu.desc}</p>
                </div>
              </TiltCard>
            ))}
            <div className="reveal-item flex flex-wrap gap-2 pt-2">
              {['AP Scholar with Distinction', 'AP International Diploma', 'FIRST Robotics'].map((badge) => (
                <span key={badge} className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(212, 175, 55, 0.85)', background: 'rgba(212, 175, 55, 0.05)', padding: '4px 10px', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '4px' }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
