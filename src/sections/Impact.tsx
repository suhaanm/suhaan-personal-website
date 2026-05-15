import { useRef, useCallback } from 'react';
import ScrambleText from '@/components/ScrambleText';
import WaveCanvas from '@/components/WaveCanvas';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const impacts = [
  { title: 'Mentored 60 students', description: 'Through a math club for AMC and WMTC preparation, building problem-solving skills in the next generation of mathletes.', color: '#2196F3', icon: '◈' },
  { title: 'STEM volunteering', description: 'Worked with Akanksha Foundation / Mumbai Public School to teach STEM subjects to underserved students.', color: '#00BCD4', icon: '◇' },
  { title: 'Global Encounters Kenya', description: 'Taught AI prompt engineering, AI image upscaling, and digital skills to students in Kenya.', color: '#7C3AED', icon: '◈' },
  { title: 'Scouts leadership', description: 'Long-term involvement as a Rover and Patrol Leader, building teamwork and outdoor skills.', color: '#556B4B', icon: '◇' },
];

function TiltRow({ children, className = '', intensity = 2 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Impact() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'fade-left', childSelector: '.impact-item', stagger: 0.12, distance: 40, start: 'top 80%' });

  return (
    <section ref={sectionRef} className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw' }}>
      <div className="absolute inset-0" style={{ opacity: 0.2 }}><WaveCanvas /></div>
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#556B4B' }}>// IMPACT</span>
          <ScrambleText text="Impact beyond code" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <div>
          {impacts.map((impact, index) => (
            <div key={impact.title} className="impact-item" style={{ borderBottom: index < impacts.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <TiltRow intensity={2}>
                <div className="py-6 md:py-8 flex gap-4 md:gap-6 group">
                  <div className="flex-shrink-0 pt-1">
                    <span className="font-mono text-lg md:text-xl transition-all duration-500 group-hover:scale-125 inline-block" style={{ color: impact.color }}>{impact.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: impact.color, boxShadow: `0 0 8px ${impact.color}50` }} />
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl" style={{ color: 'var(--text-heading)' }}>{impact.title}</h3>
                    </div>
                    <p className="text-sm md:text-base ml-5" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{impact.description}</p>
                  </div>
                  <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                    <span style={{ color: impact.color }}>→</span>
                  </div>
                </div>
              </TiltRow>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
