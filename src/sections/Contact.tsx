import { useRef, useState, useCallback } from 'react';
import DataStream from '@/components/DataStream';
import ScrambleText from '@/components/ScrambleText';
import MagneticButton from '@/components/MagneticButton';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

function TiltCard({ children, className = '', intensity = 4 }: { children: React.ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; ref.current.style.transform = `perspective(1200px) rotateX(${(0.5 - y) * intensity}deg) rotateY(${(x - 0.5) * intensity}deg) scale3d(1.005, 1.005, 1.005)`; }, [intensity]);
  const onMouseLeave = useCallback(() => { if (!ref.current) return; ref.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; }, []);
  return <div ref={ref} className={className} style={{ transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>{children}</div>;
}

export default function Contact() {
  const sectionRef = useScrollAnimation<HTMLElement>({ type: 'fade-up', childSelector: '.reveal-item', stagger: 0.12, start: 'top 80%' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert('Please email directly at suhaan@mobhani.com'); };

  const inputStyle: React.CSSProperties = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--text)',
    borderRadius: '6px',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '13px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <section ref={sectionRef} id="contact" className="relative" style={{ background: 'var(--bg)', padding: '120px 5vw 50px' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}><DataStream /></div>
      <div className="absolute inset-0 tech-grid pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="reveal-item mb-12 md:mb-16">
          <span className="font-mono-accent block mb-4" style={{ color: '#00BCD4' }}>// CONTACT</span>
          <ScrambleText text="Let's build something thoughtful." as="h2" className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ color: 'var(--text-heading)' }} />
          <div className="section-divider mt-6" />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
          <div className="reveal-item space-y-6 md:space-y-8">
            <div>
              <span className="font-mono-accent block mb-2 md:mb-3" style={{ color: '#7A8B6F', fontSize: '9px' }}>EMAIL</span>
              <a href="mailto:suhaan@mobhani.com" className="font-mono text-sm md:text-lg transition-all duration-300 hover:text-[#00BCD4] block" style={{ color: '#2196F3' }}>suhaan@mobhani.com</a>
            </div>
            <div>
              <span className="font-mono-accent block mb-2 md:mb-3" style={{ color: '#7A8B6F', fontSize: '9px' }}>PROFILES</span>
              <div className="space-y-2">
                {[{ label: 'LinkedIn', href: 'https://linkedin.com/in/suhaan-mobhani/' }, { label: 'GitHub', href: 'https://github.com/suhaanmobhani' }].map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="block font-mono text-sm transition-all duration-300 hover:text-[#00BCD4] hover:translate-x-1" style={{ color: 'var(--text-muted)' }}>{link.label} →</a>
                ))}
              </div>
            </div>
            <div>
              <span className="font-mono-accent block mb-2 md:mb-3" style={{ color: '#7A8B6F', fontSize: '9px' }}>PROJECTS</span>
              <div className="space-y-2">
                {['tutix.ai', 'imtcontest.org', 'thecalt.com'].map((link) => (
                  <a key={link} href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="block font-mono text-sm transition-all duration-300 hover:text-[#00BCD4] hover:translate-x-1" style={{ color: 'var(--text-muted)' }}>{link} →</a>
                ))}
              </div>
            </div>
            <MagneticButton strength={0.2} className="inline-block font-mono text-xs tracking-widest uppercase px-5 md:px-6 py-2.5 md:py-3" style={{ border: '1px solid rgba(212, 175, 55, 0.22)', color: '#D4AF37', background: 'transparent' }}>
              Download Resume ↓
            </MagneticButton>
          </div>
          <TiltCard intensity={3} className="reveal-item">
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-4 md:space-y-5" style={{ borderRadius: '12px' }}>
              <div>
                <label className="font-mono-accent block mb-2" style={{ color: '#7A8B6F', fontSize: '9px' }}>NAME</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 outline-none" style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--input-focus-border)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--input-border)'; }} placeholder="Your name" />
              </div>
              <div>
                <label className="font-mono-accent block mb-2" style={{ color: '#7A8B6F', fontSize: '9px' }}>EMAIL</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 outline-none" style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--input-focus-border)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--input-border)'; }} placeholder="your@email.com" />
              </div>
              <div>
                <label className="font-mono-accent block mb-2" style={{ color: '#7A8B6F', fontSize: '9px' }}>MESSAGE</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} className="w-full px-4 py-3 outline-none resize-none" style={inputStyle} onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--input-focus-border)'; }} onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--input-border)'; }} placeholder="What's on your mind?" />
              </div>
              <MagneticButton strength={0.25} className="w-full py-3.5 md:py-4 font-mono text-xs tracking-widest uppercase" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960F)', color: '#1A1A2E', borderRadius: '6px', border: 'none' }}>
                Send Message →
              </MagneticButton>
            </form>
          </TiltCard>
        </div>
        <div className="reveal-item mt-16 md:mt-24 pt-6 md:pt-8 flex flex-wrap items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.1em' }}>© 2025 SUHAAN MOBHANI</p>
          <p className="font-mono" style={{ fontSize: '9px', color: 'var(--text-faint)', letterSpacing: '0.05em' }}>Built around AI, mathematics, and learning.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00BCD4', boxShadow: '0 0 6px rgba(0, 188, 212, 0.4)' }} />
            <span className="font-mono" style={{ fontSize: '8px', color: 'rgba(0, 188, 212, 0.35)', letterSpacing: '0.1em' }}>NOMINAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
