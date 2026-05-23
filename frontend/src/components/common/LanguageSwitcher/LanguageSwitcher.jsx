import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Check, ChevronDown, Globe2 } from 'lucide-react';

const languageOptions = [{ code: 'en' }, { code: 'id' }];

export const LanguageSwitcher = ({ className = '' }) => {
  const { t, i18n } = useTranslation('navbar');
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);
  const activeLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  const openMenu = () => {
    setIsMounted(true);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);

    if (!menuRef.current) {
      setIsMounted(false);
      return;
    }

    gsap.to(menuRef.current, {
      autoAlpha: 0,
      y: -8,
      scale: 0.96,
      filter: 'blur(6px)',
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => setIsMounted(false),
    });
  };

  useEffect(() => {
    if (!isMounted || !menuRef.current) return;

    gsap.fromTo(
      menuRef.current,
      { autoAlpha: 0, y: -10, scale: 0.96, filter: 'blur(8px)' },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.32,
        ease: 'power3.out',
      },
    );
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted]);

  const animatePageTransition = async (language) => {
    const main = document.querySelector('main');

    if (!main) {
      await i18n.changeLanguage(language);
      return;
    }

    gsap.to(main, {
      opacity: 0.76,
      y: 5,
      duration: 0.16,
      ease: 'power2.out',
      onComplete: async () => {
        await i18n.changeLanguage(language);
        gsap.to(main, {
          opacity: 1,
          y: 0,
          duration: 0.34,
          ease: 'power3.out',
        });
      },
    });
  };

  const handleSelect = (language) => {
    closeMenu();

    if (language === activeLanguage) {
      return;
    }

    animatePageTransition(language);
  };

  const currentShort = t(`languageSwitcher.options.${activeLanguage}.short`);
  const currentLabel = t(`languageSwitcher.options.${activeLanguage}.label`);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white/78 px-3 text-sm font-black text-slate-950 shadow-[0_12px_32px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-blue-300 hover:bg-white hover:text-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300/35"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={isOpen ? t('languageSwitcher.close') : t('languageSwitcher.open')}
      >
        <Globe2 size={17} />
        <span className="hidden sm:inline">{currentLabel}</span>
        <span className="sm:hidden">{currentShort}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isMounted && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t('languageSwitcher.label')}
          className="absolute right-0 top-full z-50 mt-3 w-60 origin-top-right rounded-[1.4rem] border border-white/70 bg-white/88 p-2 text-slate-950 opacity-0 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl"
        >
          <div className="px-3 pb-2 pt-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
            {t('languageSwitcher.label')}
          </div>
          <div className="grid gap-1">
            {languageOptions.map((language) => {
              const active = language.code === activeLanguage;

              return (
                <button
                  key={language.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => handleSelect(language.code)}
                  className={`group flex items-center justify-between rounded-[1rem] px-3 py-3 text-left transition-all duration-300 ${
                    active
                      ? 'bg-blue-500 text-white shadow-[0_12px_26px_rgba(59,130,246,0.24)]'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                        active ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-lime-300 group-hover:text-slate-950'
                      }`}
                    >
                      {t(`languageSwitcher.options.${language.code}.short`)}
                    </span>
                    <span className="font-black">
                      {t(`languageSwitcher.options.${language.code}.label`)}
                    </span>
                  </span>
                  {active && <Check size={17} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
