import { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px]"
      style={{ background: 'rgba(0,0,0,0.04)' }}
    >
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #2196F3, #00BCD4)',
          boxShadow: '0 0 10px rgba(33, 150, 243, 0.4)',
        }}
      />
    </div>
  );
}
