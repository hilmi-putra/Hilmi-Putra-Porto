import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Menu, X, Download } from "lucide-react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { navItems, profile } from "../../data/portfolio";

export const Header = () => {
  const { t } = useTranslation("navbar");
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState("memories");
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);

      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean);
      const current = sections.reduce((active, section) => {
        if (section.getBoundingClientRect().top <= 170) {
          return section;
        }

        return active;
      }, null);

      if (current) {
        setActiveId(current.id);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMenuMounted || !mobileMenuRef.current) return;

    gsap.fromTo(
      mobileMenuRef.current,
      { autoAlpha: 0, y: -12, scale: 0.98, filter: "blur(8px)" },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.32,
        ease: "power3.out",
      },
    );
  }, [isMenuMounted]);

  const openMobileMenu = () => {
    setIsMenuMounted(true);
    setIsOpen(true);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);

    if (!mobileMenuRef.current) {
      setIsMenuMounted(false);
      return;
    }

    gsap.to(mobileMenuRef.current, {
      autoAlpha: 0,
      y: -10,
      scale: 0.98,
      filter: "blur(8px)",
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => setIsMenuMounted(false),
    });
  };

  const goToSection = (id) => {
    closeMobileMenu();

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  const goHome = () => {
    closeMobileMenu();
    navigate("/");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-3 z-[9999] px-3 opacity-100 sm:top-5 sm:px-5">
      <div
        className={`mx-auto max-w-[1360px] rounded-full border px-3 py-2 transition-all duration-500 ${
          isScrolled || isOpen
            ? "border-slate-200 bg-white/88 shadow-[0_18px_45px_rgba(15,23,42,0.14)] backdrop-blur-xl"
            : "border-white/45 bg-white/62 shadow-[0_14px_35px_rgba(15,23,42,0.08)] backdrop-blur-md"
        }`}
        style={{ position: "relative", zIndex: 10000 }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goHome}
            className="flex min-w-0 items-center gap-3 rounded-full pr-2 text-left transition-transform duration-300 hover:scale-[1.02]"
            aria-label={t("backToTop")}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-500 p-2 shadow-[0_12px_30px_rgba(59,130,246,0.26)]">
              <img src="/icon.svg" alt="" className="h-full w-full object-contain" aria-hidden="true" />
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block text-sm font-black text-slate-950">{profile.shortName}</span>
              <span className="block text-[11px] font-bold text-slate-500">{t("brandRole")}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label={t("mainNavigation")}>
            {navItems.map((item) => {
              const active = location.pathname === "/" && activeId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold transition-all duration-300 ${
                    active ? "bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]" : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {t(`items.${item.id}`)}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a href="/cv.pdf" download="CV_Hilmi_Abdurrafi.pdf" className="hidden rounded-full bg-blue-50 px-5 py-3 text-sm font-black text-blue-600 transition-colors duration-300 hover:bg-blue-100 md:inline-flex items-center gap-2">
              <Download size={16} />
              <span>CV</span>
            </a>
            <a href={`mailto:${profile.email}`} className="hidden rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-slate-950 transition-colors duration-300 hover:bg-lime-200 md:inline-flex">
              {t("talk")}
            </a>
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => (isOpen ? closeMobileMenu() : openMobileMenu())}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white lg:hidden"
              aria-label={t("toggleNavigation")}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuMounted && (
        <div
          ref={mobileMenuRef}
          className="mx-auto mt-3 max-w-[1360px] rounded-[1.8rem] border border-slate-200 bg-white/92 p-3 opacity-0 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:hidden"
        >
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSection(item.id)}
                className={`rounded-2xl px-4 py-4 text-left text-base font-black transition-colors ${
                  activeId === item.id ? "bg-blue-500 text-white" : "text-slate-800 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {t(`items.${item.id}`)}
              </button>
            ))}
            <a href="/cv.pdf" download="CV_Hilmi_Abdurrafi.pdf" className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-4 text-base font-black text-blue-600" onClick={closeMobileMenu}>
              <Download size={18} />
              <span>Download CV</span>
            </a>
            <a href={`mailto:${profile.email}`} className="rounded-2xl bg-lime-300 px-4 py-4 text-base font-black text-slate-950" onClick={closeMobileMenu}>
              {t("talk")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
