import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Mail, MapPin, Info, X, CheckCircle2 } from 'lucide-react';
import { footerLinks, navItems, profile } from '../../data/portfolio';

const TechStackModal = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeline = gsap.timeline();
    timeline
      .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power2.out" })
      .fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 32, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" },
        "-=0.08"
      );

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    const timeline = gsap.timeline({ onComplete: onClose });
    timeline
      .to(panelRef.current, { autoAlpha: 0, y: 24, scale: 0.97, duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "-=0.08");
  };

  if (!isOpen) return null;

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[12000] flex items-center justify-center bg-slate-950/52 px-3 py-4 opacity-0 backdrop-blur-xl sm:p-6" onClick={handleClose}>
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white text-slate-950 opacity-0 shadow-[0_35px_90px_rgba(15,23,42,0.32)]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.24)] transition-transform hover:scale-105"
        >
          <X size={19} />
        </button>
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-3xl font-black">About This Site</h3>
          <p className="mt-3 text-sm text-slate-500">This portfolio is designed and built with modern web technologies, focusing on performance, smooth animations, and clean architecture.</p>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.3rem] bg-blue-50 p-5">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">Frontend</h4>
              <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> React 19 (Vite)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Tailwind CSS v4</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> GSAP Animations</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> Lucide Icons</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500"/> i18next (Multi-lang)</li>
              </ul>
            </div>
            <div className="rounded-[1.3rem] bg-lime-100 p-5">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Backend & Tools</h4>
              <ul className="mt-4 space-y-3 text-sm font-semibold text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-500"/> Supabase (Database)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-500"/> Vercel (Hosting)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-500"/> ESLint + Prettier</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const Footer = () => {
  const { t } = useTranslation('footer');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-500 px-3 pb-3 text-slate-950 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1460px] overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.16)] sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">{t('eyebrow')}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-normal sm:text-6xl">
              {t('title')}
            </h2>
          </div>

          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 font-black text-slate-950 transition-colors hover:text-blue-600"
              aria-label={`${t('emailLabel')}: ${profile.email}`}
            >
              <Mail size={18} />
              {profile.email}
            </a>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-500" aria-label={`${t('locationLabel')}: ${profile.location}`}>
              <MapPin size={16} />
              {profile.location}
            </p>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {footerLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-600"
                  >
                    <Icon size={16} />
                    {link.label}
                    <ArrowUpRight size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-slate-500">
              © {currentYear} {profile.shortName}. {t('rights')}
            </p>
            <button 
              onClick={() => setIsInfoOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              aria-label="Tech Stack Info"
            >
              <Info size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-600 transition-colors hover:bg-lime-300 hover:text-slate-950"
              >
                {t(`nav.${item.id}`)}
              </a>
            ))}
          </div>
        </div>

        <TechStackModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      </div>
    </footer>
  );
};
