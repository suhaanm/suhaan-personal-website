import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}--=+*^?#________';

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h2' | 'h3' | 'span' | 'p';
  speed?: number;
}

export default function ScrambleText({ text, className = '', style, as: Tag = 'span', speed = 1 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text.replace(/./g, '\u00A0'));
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          setInView(true);
          hasRun.current = true;
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let frame = 0;
    const q: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    for (let i = 0; i < text.length; i++) {
      const to = text[i];
      const start = Math.floor(Math.random() * 15);
      const end = start + Math.floor(Math.random() * 15);
      q.push({ from: '\u00A0', to, start, end });
    }

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0; i < q.length; i++) {
        const { to, start, end } = q[i];
        let char = q[i].char;
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            q[i].char = char;
          }
          output += char;
        } else {
          output += '\u00A0';
        }
      }
      setDisplay(output);
      if (complete === q.length) return;
      frame += speed;
      requestAnimationFrame(update);
    };
    update();
  }, [inView, text, speed]);

  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {display}
    </Tag>
  );
}
