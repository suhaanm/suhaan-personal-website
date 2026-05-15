import { useEffect, useState } from 'react';

const STEPS = [
  'Initializing core systems...',
  'Loading neural network weights...',
  'Compiling research modules...',
  'Mounting particle engines...',
  'Calibrating 3D transforms...',
  'Establishing secure connection...',
  'Rendering portfolio v3.0...',
];

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 600);
        }, 400);
      } else {
        setStep(current);
      }
    }, 280);
    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: '#F0F2F5',
        transition: 'opacity 0.6s ease, visibility 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? 'hidden' : 'visible',
      }}
    >
      <div className="w-full max-w-md px-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-2xl tracking-widest" style={{ color: '#111133' }}>SM</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(33,150,243,0.4), transparent)' }} />
          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(26,26,46,0.25)', letterSpacing: '0.2em' }}>v3.0</span>
        </div>

        {/* Progress bar */}
        <div className="h-px w-full mb-6" style={{ background: 'rgba(0,0,0,0.05)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: 'linear-gradient(90deg, #2196F3, #00BCD4)',
              boxShadow: '0 0 10px rgba(33,150,243,0.3)',
            }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className="font-mono flex items-center gap-3 transition-all duration-300"
              style={{
                fontSize: '11px',
                letterSpacing: '0.05em',
                color: i <= step ? 'rgba(0, 188, 212, 0.85)' : 'rgba(26, 26, 46, 0.18)',
                opacity: i > step + 1 ? 0 : 1,
                transform: i > step + 1 ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <span style={{ color: i < step ? '#00BCD4' : i === step ? '#2196F3' : 'rgba(26,26,46,0.12)' }}>
                {i < step ? '✓' : i === step ? '⟩' : '○'}
              </span>
              {s}
            </div>
          ))}
        </div>

        {/* Bottom status */}
        <div className="mt-10 flex items-center justify-between">
          <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(26,26,46,0.18)', letterSpacing: '0.15em' }}>
            {Math.round(((step + 1) / STEPS.length) * 100)}%
          </span>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: '#00BCD4',
                boxShadow: '0 0 8px rgba(0,188,212,0.5)',
                animation: 'pulse-glow 2s ease infinite',
              }}
            />
            <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(0,188,212,0.5)', letterSpacing: '0.1em' }}>
              LOADING
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
