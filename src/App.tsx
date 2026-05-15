import { useEffect, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import SpotlightFollow from '@/components/SpotlightFollow';
import NoiseOverlay from '@/components/NoiseOverlay';
import Preloader from '@/components/Preloader';
import Hero from '@/sections/Hero';
import IntroStatement from '@/sections/IntroStatement';
import FeaturedWork from '@/sections/FeaturedWork';
import Research from '@/sections/Research';
import Experience from '@/sections/Experience';
import Academic from '@/sections/Academic';
import Achievements from '@/sections/Achievements';
import Toolkit from '@/sections/Toolkit';
import Impact from '@/sections/Impact';
import Creative from '@/sections/Creative';
import Contact from '@/sections/Contact';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  useEffect(() => {
    const timer = setTimeout(() => {
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach((link) => {
        if (link.querySelector('.nav-underline')) return;
        const underline = document.createElement('span');
        underline.style.cssText = 'position:absolute;bottom:0;left:0;width:100%;height:1px;background:currentColor;transform:scaleX(0);transform-origin:center;transition:transform 0.3s ease;';
        (link as HTMLElement).style.position = 'relative';
        link.appendChild(underline);
        link.addEventListener('mouseenter', () => { underline.style.transform = 'scaleX(1)'; });
        link.addEventListener('mouseleave', () => { underline.style.transform = 'scaleX(0)'; });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative" style={{ background: 'var(--bg)' }}>
      <Preloader onComplete={() => setLoaded(true)} />
      {loaded && (
        <>
          <CustomCursor />
          <ScrollProgressBar />
          <SpotlightFollow />
          <NoiseOverlay />
          <Navigation />
          <Hero />
          <div style={{ position: 'relative', zIndex: 10, background: 'var(--bg)' }}>
            <IntroStatement />
            <div className="section-divider" />
            <FeaturedWork />
            <div className="section-divider" />
            <Research />
            <div className="section-divider" />
            <Experience />
            <div className="section-divider" />
            <Academic />
            <div className="section-divider" />
            <Achievements />
            <div className="section-divider" />
            <Toolkit />
            <div className="section-divider" />
            <Impact />
            <div className="section-divider" />
            <Creative />
            <div className="section-divider" />
            <Contact />
          </div>
        </>
      )}
    </div>
  );
}
