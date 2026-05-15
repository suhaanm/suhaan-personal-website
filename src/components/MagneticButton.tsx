import { useRef, useCallback, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
  onClick?: () => void;
  href?: string;
  download?: string | boolean;
  target?: string;
  rel?: string;
}

export default function MagneticButton({
  children,
  className = '',
  style,
  strength = 0.3,
  onClick,
  href,
  download,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<any>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0, 0)';
  }, []);

  const commonProps = {
    ref,
    className,
    style: { ...style, transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' },
    onMouseMove,
    onMouseLeave,
    onClick,
  };

  if (href) {
    return (
      <a {...commonProps} href={href} download={download} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps}>
      {children}
    </button>
  );
}
