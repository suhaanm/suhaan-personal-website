import { useRef, useCallback } from 'react';
import DataStream from '@/components/DataStream';
import ScrambleText from '@/components/ScrambleText';
import MagneticButton from '@/components/MagneticButton';
import { useScrollAnimation, useParallax } from '@/hooks/useScrollAnimation';

const projects = [
  { title: 'Tutix.ai', subtitle: 'A Cognitive Learning OS', role: 'Founder', description: 'An adaptive learning platform with a live AI tutor. Makes high-quality tutoring accessible, personalised, and affordable.', tags: ['AI Tutor', 'EdTech', 'Adaptive Learning', 'Founder'], accent: '#2196F3', featured: true },
  { title: 'IMTC', subtitle: 'International Math Tournament', role: 'Co-founder', description: 'An international-level mathematics competition platform for global mathletes.', tags: ['Mathematics', 'Competitions', 'Community'], accent: '#D4AF37' },
  { title: 'TheCALT', subtitle: 'Learning & Contest Infrastructure', role: 'Builder / Developer', description: 'Courseware and contest platform with live moderated classrooms, graded assessments, and performance metrics.', tags: ['Web Dev', 'Education', 'Analytics'], accent: '#00BCD4' },
  { title: 'AMC Learning Program', subtitle: 'Structured Contest Prep', role: 'Web Dev Lead', description: 'Led development for an online math learning initiative.', tags: ['Leadership', 'Math Ed'], accent: '#7C3AED' },
  { title: 'Showdown', subtitle: 'Box Office Comparison', role: 'Product Intern', description: "A data-rich comparison feature for Bollywood Hungama's box office database.", tags: ['Data Product', 'Media Tech'], accent: '#F07178' },
];

function TiltCard({ children, className = '', style, intensity = 8 }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.01, 1.01, 1.01)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ ...style, transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function FeaturedWork() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'fade-up', childSelector: '.work-card', stagger: 0.12, start: 'top 82%' });
  const headerRef = useParallax(0.06);

  return (
    <section ref={sectionRef} id="work" className="relative" style={{ background: 'var(--bg)', padding: '120px 0' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}><DataStream /></div>
      <div className="absolute inset-0 tech-grid pointer-events-none" />

      <div className="relative z-10">
        <div ref={headerRef} className="px-5 md:px-16 mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#00BCD4' }}>// FEATURED_WORK</span>
          <ScrambleText text="What I'm building" as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" style={{ maxWidth: '200px' }} />
        </div>

        <div className="gallery-scroll px-5 md:px-16 pb-4">
          <TiltCard intensity={4} className="work-card" style={{ width: 'min(85vw, 600px)' }}>
            <div className="glass-card glow-border scanline-hover shimmer p-6 md:p-10 group relative overflow-hidden h-full" style={{ borderRadius: '14px', minHeight: '380px' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`); e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`); }}>
              <div className="absolute top-0 left-0 w-20 h-px" style={{ background: 'linear-gradient(90deg, #2196F3, transparent)' }} />
              <div className="absolute top-0 left-0 w-px h-20" style={{ background: 'linear-gradient(180deg, #2196F3, transparent)' }} />
              <div className="absolute bottom-0 right-0 w-20 h-px" style={{ background: 'linear-gradient(90deg, transparent, #00BCD4)' }} />
              <div className="absolute bottom-0 right-0 w-px h-20" style={{ background: 'linear-gradient(0deg, #00BCD4, transparent)' }} />
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="font-mono px-2.5 py-1 flex items-center gap-1.5" style={{ fontSize: '9px', letterSpacing: '0.12em', background: 'rgba(33, 150, 243, 0.08)', border: '1px solid rgba(33, 150, 243, 0.2)', color: '#2196F3', borderRadius: '3px' }}>
                    <span className="w-1 h-1 rounded-full" style={{ background: '#2196F3', boxShadow: '0 0 5px rgba(33,150,243,0.5)' }} />FLAGSHIP
                  </span>
                  {projects[0].tags.map((tag) => <span key={tag} className="font-mono hidden sm:inline" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.08em' }}>{tag}</span>)}
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl mb-2" style={{ color: 'var(--text-heading)' }}>{projects[0].title}</h3>
                <p className="font-mono-accent mb-4" style={{ color: '#556B4B', fontSize: '9px' }}>{projects[0].subtitle}</p>
                <p className="text-sm sm:text-base max-w-lg mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}>{projects[0].description}</p>
                <MagneticButton strength={0.2} className="inline-flex items-center gap-2 font-mono text-sm" style={{ color: '#2196F3', background: 'transparent', border: 'none' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2196F3' }} />tutix.ai →
                </MagneticButton>
              </div>
            </div>
          </TiltCard>

          {projects.slice(1).map((project) => (
            <TiltCard key={project.title} intensity={10} className="work-card" style={{ width: 'min(72vw, 380px)' }}>
              <div className="glass-card scanline-hover p-6 md:p-8 h-full group relative overflow-hidden" style={{ borderRadius: '12px', borderLeft: `3px solid ${project.accent}`, minHeight: '320px', transition: 'box-shadow 0.4s ease' }} onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`); e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`); }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 35px ${project.accent}12, 0 16px 50px var(--shadow-color)`; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-3 right-3 w-3 h-px" style={{ background: project.accent }} /><div className="absolute top-3 right-3 w-px h-3" style={{ background: project.accent }} />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => <span key={tag} className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.1em', color: project.accent, background: `${project.accent}10`, padding: '3px 8px', borderRadius: '4px' }}>{tag}</span>)}
                </div>
                <h3 className="font-heading text-lg sm:text-xl md:text-2xl mb-1" style={{ color: 'var(--text-heading)' }}>{project.title}</h3>
                <p className="font-mono mb-3" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.08em' }}>{project.role}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.55 }}>{project.description}</p>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="flex md:hidden items-center justify-center gap-2 mt-4 px-5">
          <span className="font-mono" style={{ fontSize: '8px', color: 'var(--text-faint)', letterSpacing: '0.2em' }}>← SWIPE →</span>
        </div>
      </div>
    </section>
  );
}
