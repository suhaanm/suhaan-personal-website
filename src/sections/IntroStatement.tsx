import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TerminalTyping from '@/components/TerminalTyping';
import MagneticButton from '@/components/MagneticButton';
import FloatingShapes from '@/components/FloatingShapes';
import { useParallax } from '@/hooks/useScrollAnimation';

gsap.registerPlugin(ScrollTrigger);

function CodeLine({ num, indent = 0, children }: { num: number; indent?: number; children: React.ReactNode }) {
  return (
    <div className="code-line flex items-start" style={{ paddingLeft: `${indent * 24}px` }}>
      <span className="font-mono select-none mr-3 md:mr-4 text-right" style={{ fontSize: '10px', color: 'var(--text-faint)', minWidth: '18px' }}>{num}</span>
      <span className="font-mono" style={{ fontSize: '12px', lineHeight: 1.8 }}>{children}</span>
    </div>
  );
}

export default function IntroStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const codeRef = useParallax(0.12);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll('.reveal-item');
    const lines = sectionRef.current.querySelectorAll('.code-line');
    gsap.set(items, { opacity: 0, y: 50 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' } });
    tl.to(items, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out' });
    tl.to(lines, { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }, '-=0.5');
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0"><FloatingShapes count={6} /></div>
      <div className="absolute inset-0 tech-grid pointer-events-none" style={{ opacity: 0.3 }} />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <div className="reveal-item mb-4 md:mb-6 flex items-center gap-3">
              <span className="font-mono-accent" style={{ color: '#7C3AED' }}>// ABOUT</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.2), transparent)' }} />
            </div>
            <p className="reveal-item font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed mb-5 md:mb-6" style={{ color: 'var(--text)' }}>
              <em className="font-display" style={{ color: '#00BCD4' }}>
                <TerminalTyping text="I'm interested in building systems that make complex ideas easier to understand," speed={30} />
              </em>
              <span style={{ color: 'var(--text-muted)' }}> reason with, and apply. My work sits at the intersection of artificial intelligence, mathematical reasoning, and human learning.</span>
            </p>
            <div className="reveal-item flex flex-wrap gap-2 md:gap-3 mt-6 md:mt-8">
              {['AI/ML at Imperial', 'Founder & Builder', 'Mathematics & Optimization', 'Learning Systems'].map((chip) => (
                <MagneticButton key={chip} strength={0.15} className="font-mono px-3 md:px-4 py-1.5 md:py-2" style={{ fontSize: '9px', letterSpacing: '0.1em', background: 'rgba(33, 150, 243, 0.05)', border: '1px solid rgba(33, 150, 243, 0.12)', color: 'rgba(33, 150, 243, 0.65)', borderRadius: '2px' }}>
                  {chip}
                </MagneticButton>
              ))}
            </div>
          </div>
          <div ref={codeRef} className="reveal-item">
            <div className="relative overflow-hidden" style={{ background: 'var(--code-bg)', border: '1px solid var(--code-border)', borderRadius: '10px' }}>
              <div className="relative flex items-center gap-2 px-4 md:px-5" style={{ height: '34px', borderBottom: '1px solid var(--code-border)' }}>
                <div className="flex gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#FF5F56' }} />
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
                  <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#27C93F' }} />
                </div>
                <span className="font-mono ml-3" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.05em' }}>suhaan.py</span>
              </div>
              <div className="p-4 md:p-5">
                <CodeLine num={1}><span className="code-keyword">class</span> <span className="code-type">Builder</span>:</CodeLine>
                <CodeLine num={2} indent={1}><span className="code-keyword">def</span> <span className="code-function">__init__</span>(<span className="code-variable">self</span>):</CodeLine>
                <CodeLine num={3} indent={2}><span className="code-variable">self</span>.identity = <span className="code-string">&quot;AI/ML Student &amp; Founder&quot;</span></CodeLine>
                <CodeLine num={4} indent={2}><span className="code-variable">self</span>.institution = <span className="code-string">&quot;Imperial College London&quot;</span></CodeLine>
                <CodeLine num={5} indent={2}><span className="code-variable">self</span>.interests = [<span className="code-string">&quot;AI&quot;</span>, <span className="code-string">&quot;Math&quot;</span>, <span className="code-string">&quot;EdTech&quot;</span>]</CodeLine>
                <CodeLine num={6} indent={1}><span className="code-comment"># Systems that make complex ideas easier</span></CodeLine>
                <CodeLine num={7} indent={1}><span className="code-keyword">def</span> <span className="code-function">build</span>(<span className="code-variable">self</span>, <span className="code-variable">problem</span>):</CodeLine>
                <CodeLine num={8} indent={2}><span className="code-keyword">return</span> <span className="code-type">Solution</span>(problem).<span className="code-function">apply_ml</span>().<span className="code-function">ship</span>()</CodeLine>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
