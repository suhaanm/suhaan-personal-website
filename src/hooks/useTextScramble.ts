import { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\\/[]{}--=+*^?#________';

export function useTextScramble(finalText: string, options?: { speed?: number; delay?: number }) {
  const [display, setDisplay] = useState('');
  const [triggered, setTriggered] = useState(false);
  const elRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!triggered) return;
    const speed = options?.speed ?? 1;
    let frame = 0;
    let q: { from: string; to: string; start: number; end: number; char?: string }[] = [];

    for (let i = 0; i < finalText.length; i++) {
      const to = finalText[i];
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      q.push({ from: '\u00A0', to, start, end });
    }

    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0; i < q.length; i++) {
        const { from, to, start, end } = q[i];
        let char = q[i].char;
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            q[i].char = char;
          }
          output += `<span style="color:#2196F3;opacity:0.7">${char}</span>`;
        } else {
          output += from;
        }
      }
      setDisplay(output);
      if (complete === q.length) return;
      frame += speed;
      requestAnimationFrame(update);
    };

    const delay = options?.delay ?? 0;
    const timer = setTimeout(() => update(), delay);
    return () => clearTimeout(timer);
  }, [triggered, finalText, options?.speed, options?.delay]);

  return { display, ref: elRef, trigger: () => setTriggered(true) };
}
