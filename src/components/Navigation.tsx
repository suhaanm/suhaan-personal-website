import { useEffect, useState } from 'react';
import { getLenis } from '@/hooks/useLenis';
import MobileMenu from './MobileMenu';

const navLinks = [
  { label: 'Work', target: '#work' },
  { label: 'Research', target: '#research' },
  { label: 'Experience', target: '#experience' },
  { label: 'Contact', target: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { offset: -64 });
  };

  // Light-mode-only colors
  const logoColor = '#1A1A2E';
  const dividerColor = 'rgba(0,0,0,0.1)';
  const navLinkColor = 'rgba(26, 26, 46, 0.5)';
  const hamburgerColor = mobileOpen ? '#00BCD4' : '#1A1A2E';
  const scrolledBg = 'rgba(240, 242, 245, 0.92)';
  const scrolledBorder = '1px solid rgba(0,0,0,0.05)';

  return (
    <>
      <nav
        className="fixed top-[2px] left-0 right-0 z-50 h-16 flex items-center justify-between px-5 md:px-10 transition-all duration-500"
        style={{
          background: scrolled ? scrolledBg : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(150%)' : 'none',
          borderBottom: scrolled ? scrolledBorder : '1px solid transparent',
        }}
      >
        {/* Left: Logo */}
        <a
          href="#"
          className="flex items-center gap-3 group"
          onClick={(e) => { e.preventDefault(); const lenis = getLenis(); if (lenis) lenis.scrollTo(0); }}
        >
          <span className="font-mono text-sm tracking-widest uppercase" style={{ color: logoColor }}>
            SM
          </span>
          <span
            className="hidden md:inline-block w-px h-4"
            style={{ background: dividerColor }}
          />
          <span className="hidden md:inline-flex items-center gap-2 font-mono-accent" style={{ color: '#00BCD4', fontSize: '9px' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#00BCD4', boxShadow: '0 0 8px rgba(0, 188, 212, 0.5)' }} />
            ONLINE
          </span>
        </a>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.target}
              className="nav-link relative px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors duration-300 group"
              style={{ color: navLinkColor }}
              onClick={(e) => handleNavClick(e, link.target)}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#00BCD4'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = navLinkColor; }}
            >
              <span className="absolute bottom-1 left-4 right-4 h-px transition-transform duration-300 origin-center scale-x-0 group-hover:scale-x-100" style={{ background: '#00BCD4' }} />
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Resume CTA - desktop */}
          <a
            href="#contact"
            className="hidden md:inline-block font-mono text-xs tracking-widest uppercase px-5 py-2 transition-all duration-300"
            style={{ border: '1px solid rgba(33, 150, 243, 0.35)', color: '#2196F3' }}
            onClick={(e) => handleNavClick(e, '#contact')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(33, 150, 243, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.6)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(33, 150, 243, 0.35)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Resume
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 relative z-[80]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-px transition-all duration-300" style={{ background: hamburgerColor, transform: mobileOpen ? 'rotate(45deg) translateY(4px)' : 'none' }} />
            <span className="block w-5 h-px transition-all duration-300" style={{ background: hamburgerColor, opacity: mobileOpen ? 0 : 1 }} />
            <span className="block w-5 h-px transition-all duration-300" style={{ background: hamburgerColor, transform: mobileOpen ? 'rotate(-45deg) translateY(-4px)' : 'none' }} />
          </button>
        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
