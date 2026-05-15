import { useEffect } from 'react';

const links = [
  { label: 'Work', target: '#work' },
  { label: 'Research', target: '#research' },
  { label: 'Experience', target: '#experience' },
  { label: 'Contact', target: '#contact' },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleClick = (target: string) => {
    onClose();
    setTimeout(() => {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: Record<string, unknown>) => void } }).__lenis;
      if (lenis) lenis.scrollTo(target, { offset: -64 });
      else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const menuTextColor = 'rgba(26, 26, 46, 0.7)';
  const menuBorderColor = 'rgba(0, 0, 0, 0.06)';

  return (
    <div
      className="fixed inset-0 z-[70] md:hidden"
      style={{
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden',
        transition: 'visibility 0.4s ease',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(240, 242, 245, 0.98)',
          backdropFilter: 'blur(20px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Menu content */}
      <div
        style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
          padding: '24px',
        }}
      >
        {links.map((link, i) => (
          <button
            key={link.label}
            onClick={() => handleClick(link.target)}
            className="font-heading text-3xl w-full text-center py-4 transition-all duration-300"
            style={{
              color: menuTextColor,
              borderBottom: i < links.length - 1 ? `1px solid ${menuBorderColor}` : 'none',
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(16px)',
              transition: `opacity 0.4s ease ${0.15 + i * 0.06}s, transform 0.4s ease ${0.15 + i * 0.06}s, color 0.3s ease`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#00BCD4'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = menuTextColor; }}
          >
            {link.label}
          </button>
        ))}

        <div className="mt-8 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00BCD4', boxShadow: '0 0 6px rgba(0,188,212,0.5)' }} />
          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(0,188,212,0.4)', letterSpacing: '0.15em' }}>
            SYSTEMS ONLINE
          </span>
        </div>
      </div>
    </div>
  );
}
