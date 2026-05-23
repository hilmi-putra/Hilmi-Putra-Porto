import { useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

const variants = {
  primary:
    'bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)] hover:bg-blue-600',
  light:
    'bg-white text-slate-950 shadow-[0_18px_40px_rgba(15,23,42,0.12)] hover:bg-lime-200',
  lime:
    'bg-lime-300 text-slate-950 shadow-[0_18px_40px_rgba(132,204,22,0.24)] hover:bg-lime-200',
  outline:
    'bg-white/60 text-slate-950 border border-slate-200 hover:border-blue-400 hover:text-blue-600',
};

export const MagneticButton = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  icon = true,
  type = 'button',
  ...props
}) => {
  const buttonRef = useRef(null);

  const handleMove = (event) => {
    const element = buttonRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * 0.18,
      y: y * 0.22,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.35)',
    });
  };

  const sharedProps = {
    ref: buttonRef,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    className: `magnetic-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/40 ${variants[variant]} ${className}`,
    ...props,
  };

  if (href) {
    const external = href.startsWith('http');

    return (
      <a
        {...sharedProps}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        <span>{children}</span>
        {icon && <ArrowUpRight size={17} strokeWidth={2.4} />}
      </a>
    );
  }

  return (
    <button {...sharedProps} type={type}>
      <span>{children}</span>
      {icon && <ArrowUpRight size={17} strokeWidth={2.4} />}
    </button>
  );
};
