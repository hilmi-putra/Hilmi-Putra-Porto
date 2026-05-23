import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ArrowRight, Building2, CalendarDays, CheckCircle2, Info, Sparkles, X } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { fetchItems } from "../../services/api";

const JourneyDetailDialog = ({ item, labels, onClose }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closingRef = useRef(false);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    const timeline = gsap.timeline({ onComplete: onClose });
    timeline
      .to(panelRef.current, { autoAlpha: 0, y: 24, scale: 0.97, filter: "blur(8px)", duration: 0.2, ease: "power2.in" })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "-=0.08");
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeline = gsap.timeline();
    timeline
      .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22, ease: "power2.out" })
      .fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 32, scale: 0.96, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.42, ease: "power3.out" },
        "-=0.08",
      );

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      timeline.kill();
    };
  }, [handleClose]);

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[12000] flex items-end justify-center bg-slate-950/52 px-3 py-4 opacity-0 backdrop-blur-xl sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 z-0 h-full w-full cursor-default" aria-label={labels.close} onClick={handleClose} />

      <article
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-dialog-title"
        className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/70 bg-white text-slate-950 opacity-0 shadow-[0_35px_90px_rgba(15,23,42,0.32)]"
      >
        <div className="pointer-events-none absolute -right-20 top-6 h-64 w-32 rotate-[32deg] rounded-[4rem] bg-lime-300" />
        <div className="pointer-events-none absolute -left-16 bottom-12 h-52 w-28 -rotate-[24deg] rounded-[4rem] bg-blue-100" />

        <div className="relative z-10 max-h-[92vh] overflow-y-auto p-5 sm:p-7 lg:p-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                <Sparkles size={15} />
                {labels.overview}
              </span>
              <div>
                <p className="flex items-center gap-2 text-sm font-extrabold text-blue-600">
                  <CalendarDays size={16} />
                  {item.time}
                </p>
                <h2 id="journey-dialog-title" className="mt-3 max-w-3xl font-display text-4xl font-black leading-[0.95] sm:text-5xl">
                  {item.title}
                </h2>
                <p className="mt-4 flex items-center gap-2 text-base font-black text-slate-500">
                  <Building2 size={18} />
                  {item.org}
                </p>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={handleClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.24)] transition-transform duration-300 hover:scale-105"
              aria-label={labels.close}
            >
              <X size={19} />
            </button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-[1.6rem] bg-blue-500 p-6 text-white shadow-[0_18px_45px_rgba(59,130,246,0.24)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600">
                <Info size={22} />
              </div>
              <h3 className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-lime-100">{labels.overview}</h3>
              <p className="mt-3 text-sm leading-7 text-white/82">{item.summary}</p>
            </div>

            <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h3 className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{labels.details}</h3>
              <div className="mt-5 grid gap-3">
                {item.details.map((detail) => (
                  <div key={detail} className="flex gap-3 rounded-2xl bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-300 text-slate-950">
                      <CheckCircle2 size={15} />
                    </span>
                    <p className="text-sm font-semibold leading-6 text-slate-600">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{labels.stack}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>,
    document.body,
  );
};

const JourneyActionButton = ({ active, children, onClick }) => {
  const buttonRef = useRef(null);

  const handleMove = (event) => {
    const element = buttonRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * 0.12,
      y: y * 0.16,
      duration: 0.32,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.38)",
    });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`group/button relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-black shadow-[0_16px_34px_rgba(15,23,42,0.16)] transition-colors duration-300 ${
        active ? "bg-white text-blue-600 hover:text-slate-950" : "bg-slate-950 text-white hover:text-white"
      }`}
    >
      <span className={`absolute inset-0 -translate-x-full rounded-full transition-transform duration-500 group-hover/button:translate-x-0 ${active ? "bg-lime-300" : "bg-blue-500"}`} />
      <span className="relative z-10">{children}</span>
      <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover/button:translate-x-1" />
    </button>
  );
};

export const Journey = () => {
  const { t } = useTranslation("journey");
  const [selectedItem, setSelectedItem] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJourneys = async () => {
      setIsLoading(true);
      const { data } = await fetchItems('journey');
      if (data) {
        // Format Supabase data ke struktur UI yg existing
        const formattedData = data.map(item => ({
          ...item,
          time: `${item.date_start} - ${item.date_end}`,
          title: item.title,
          org: item.institution || 'Organization',
          summary: item.description,
          details: Array.isArray(item.key_details) ? item.key_details : [],
          tags: Array.isArray(item.stack_and_focus) ? item.stack_and_focus : []
        }));
        setJourneys(formattedData);
      }
      setIsLoading(false);
    };
    loadJourneys();
  }, []);
  const labels = {
    close: t("modalClose"),
    overview: t("modalOverview"),
    details: t("modalDetails"),
    stack: t("modalStack"),
  };

  return (
    <section id="journey" className="relative overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
        <SectionHeader eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <div className="reveal-up rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{t("patternEyebrow")}</p>
              <p className="mt-1 text-xl font-black text-slate-950">{t("patternText")}</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
              <ArrowRight size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-4">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              className={`journey-card relative flex min-h-[430px] flex-col overflow-hidden rounded-[1.8rem] border p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ${
                index === 1 ? "border-blue-400 bg-blue-500" : "border-slate-200 bg-white"
              }`}
            >
              <div className={`absolute left-6 top-6 h-3 w-3 rounded-full ${index === 1 ? 'bg-white/30' : 'bg-slate-200'} animate-pulse`} />
              <div className="flex h-full flex-col pt-12 animate-pulse">
                <div className={`h-3 w-24 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                <div className={`mt-5 h-8 w-3/4 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                <div className={`mt-4 h-4 w-1/2 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                <div className={`mt-6 h-4 w-full rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                <div className={`mt-2 h-4 w-4/5 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                <div className={`mt-2 h-4 w-full rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className={`h-6 w-16 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                  <div className={`h-6 w-20 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                  <div className={`h-6 w-14 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                </div>
                
                <div className="mt-auto pt-8">
                  <div className={`h-11 w-32 rounded-full ${index === 1 ? 'bg-white/20' : 'bg-slate-200'}`} />
                </div>
              </div>
            </article>
          ))
        ) : journeys.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-xl rounded-[2rem] border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-slate-500 font-bold text-lg">Your journey hasn't started yet.</p>
            <p className="text-slate-400 font-medium mt-2">Check back later for updates.</p>
          </div>
        ) : (
          journeys.map((item, index) => (
            <article
              key={item.id || item.title}
              className={`journey-card group relative flex min-h-[430px] flex-col overflow-hidden rounded-[1.8rem] border p-6 opacity-100 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 ${
                index === 1 ? "border-blue-400 bg-blue-500 text-white" : "border-slate-200 bg-white text-slate-950"
              }`}
            >
              <div className={`absolute left-6 top-6 h-3 w-3 rounded-full ${index === 1 ? "bg-white/40 ring-white/20" : "bg-lime-300 ring-lime-200/40"} ring-8`} />
              <div className="flex h-full flex-col pt-12">
                <p className={`text-xs font-black uppercase tracking-[0.2em] ${index === 1 ? "text-white/70" : "text-blue-500"}`}>{item.time}</p>
                <h3 className="mt-5 font-display text-3xl font-black leading-none">{item.title}</h3>
                <p className={`mt-3 text-sm font-bold ${index === 1 ? "text-blue-200" : "text-slate-500"}`}>{item.org}</p>
                <p className={`mt-5 text-sm leading-7 ${index === 1 ? "text-white/78" : "text-slate-600"} line-clamp-4`}>{item.summary}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className={`rounded-full px-3 py-1 text-[11px] font-black ${index === 1 ? "bg-white/16 text-white" : "bg-blue-50 text-blue-600"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-8">
                  <JourneyActionButton active={index === 1} onClick={() => setSelectedItem(item)}>
                    {t("detailButton")}
                  </JourneyActionButton>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {selectedItem && <JourneyDetailDialog item={selectedItem} labels={labels} onClose={() => setSelectedItem(null)} />}
    </section>
  );
};
