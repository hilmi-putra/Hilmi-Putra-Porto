import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, ExternalLink, Github, Image as ImageIcon, X, Maximize, Workflow, Layers3, MonitorSmartphone, Rocket } from "lucide-react";
import { fetchItems } from "../../services/api";

const DYNAMIC_ICONS = [Workflow, Layers3, MonitorSmartphone, Rocket];
const DYNAMIC_VARIANTS = ["featured", "medium", "medium", "vision"];

gsap.registerPlugin(ScrollTrigger);

const useShowcaseHover = () => {
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const imageRef = useRef(null);
  const glowRef = useRef(null);
  const tagsRef = useRef(null);

  const onEnter = () => {
    gsap.to(cardRef.current, {
      y: -10,
      scale: 1.012,
      boxShadow: "0 34px 84px rgba(15,23,42,0.24)",
      duration: 0.42,
      ease: "power3.out",
    });
    gsap.to(iconRef.current, { y: -4, rotate: 6, scale: 1.05, duration: 0.38, ease: "power3.out" });
    gsap.to(imageRef.current, { scale: 1.045, y: -4, duration: 0.55, ease: "power3.out" });
    gsap.to(glowRef.current, { autoAlpha: 1, x: 18, duration: 0.5, ease: "power3.out" });
    gsap.to(tagsRef.current?.children || [], { y: -2, stagger: 0.025, duration: 0.28, ease: "power2.out" });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
      duration: 0.45,
      ease: "power3.out",
    });
    gsap.to(iconRef.current, { y: 0, rotate: 0, scale: 1, duration: 0.38, ease: "power3.out" });
    gsap.to(imageRef.current, { scale: 1, y: 0, duration: 0.55, ease: "power3.out" });
    gsap.to(glowRef.current, { autoAlpha: 0, x: 0, duration: 0.38, ease: "power2.out" });
    gsap.to(tagsRef.current?.children || [], { y: 0, stagger: 0.02, duration: 0.26, ease: "power2.out" });
  };

  return { cardRef, iconRef, imageRef, glowRef, tagsRef, onEnter, onLeave };
};

const FutureProjectCard = ({ project, meta, index, variant, onOpen, detailLabel }) => {
  const Icon = meta.icon;
  const { cardRef, iconRef, imageRef, glowRef, tagsRef, onEnter, onLeave } = useShowcaseHover();
  const featured = variant === "featured";

  return (
    <article
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`future-showcase-card group relative flex min-h-[560px] flex-col overflow-hidden rounded-[2rem] p-6 opacity-0 shadow-[0_20px_50px_rgba(15,23,42,0.12)] will-change-transform sm:p-7 lg:col-span-6 lg:min-h-[640px] ${
        featured ? "bg-slate-950 text-white" : "bg-white text-slate-950"
      }`}
    >
      <div
        ref={glowRef}
        className={`pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-0 blur-3xl ${
          featured ? "bg-lime-300/28" : "bg-blue-300/34"
        }`}
      />

      <div className="relative z-10 flex items-start justify-between gap-5">
        <div className="max-w-2xl">
          <p className={`text-xs font-black uppercase tracking-[0.24em] ${featured ? "text-lime-200" : "text-blue-500"}`}>
            {project.type}
          </p>
          <h3 className="mt-4 font-display text-4xl font-black leading-[0.9] [overflow-wrap:anywhere] sm:text-5xl lg:text-[3.25rem]">
            {project.title}
          </h3>
        </div>
        <span
          ref={iconRef}
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
            featured ? "bg-lime-300 text-slate-950" : "bg-blue-500 text-white"
          }`}
        >
          <Icon size={24} />
        </span>
      </div>

      <p className={`relative z-10 mt-6 max-w-2xl text-sm leading-7 ${featured ? "text-white/74" : "text-slate-600"}`}>
        {project.text}
      </p>

      <div
        className={`relative z-10 mt-7 overflow-hidden rounded-[1.4rem] ${
          featured ? "border border-white/10 bg-white/7" : "border border-slate-200 bg-slate-50"
        } aspect-[16/8]`}
      >
        <img
          ref={imageRef}
          src={meta.images[0]}
          alt={`${project.title} preview`}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            meta.images[0].endsWith(".png") ? "object-contain p-4" : ""
          }`}
        />
        <div className={`absolute inset-0 ${featured ? "bg-gradient-to-t from-slate-950/70 to-transparent" : "bg-gradient-to-t from-white/30 to-transparent"}`} />
      </div>

      <div ref={tagsRef} className="relative z-10 mt-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-2 text-xs font-black transition-colors duration-300 ${
              featured ? "bg-white/12 text-white group-hover:bg-lime-300 group-hover:text-slate-950" : "bg-blue-50 text-blue-600 group-hover:bg-lime-200 group-hover:text-slate-950"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onOpen(index)}
        className={`relative z-10 mt-auto inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-all duration-300 ${
          featured
            ? "bg-white text-slate-950 shadow-[0_16px_34px_rgba(255,255,255,0.12)] hover:bg-lime-300"
            : "bg-slate-950 text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] hover:bg-blue-500"
        }`}
      >
        {detailLabel}
        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </article>
  );
};

const FutureProjectModal = ({ project, meta, labels, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxStateRef = useRef(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const closingRef = useRef(false);

  useEffect(() => {
    lightboxStateRef.current = isLightboxOpen;
  }, [isLightboxOpen]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    const timeline = gsap.timeline({ onComplete: onClose });
    timeline
      .to(panelRef.current, { autoAlpha: 0, y: 26, scale: 0.97, filter: "blur(10px)", duration: 0.24, ease: "power2.in" })
      .to(overlayRef.current, { autoAlpha: 0, duration: 0.18, ease: "power2.in" }, "-=0.08");
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeline = gsap.timeline();
    timeline
      .fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24, ease: "power2.out" })
      .fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 36, scale: 0.96, filter: "blur(12px)" },
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.48, ease: "power3.out" },
        "-=0.08",
      );

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (lightboxStateRef.current) {
          setIsLightboxOpen(false);
        } else {
          handleClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      timeline.kill();
    };
  }, [handleClose]);

  const activeSrc = meta.images[activeImage];

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[12000] flex items-end justify-center bg-slate-950/58 px-3 py-4 opacity-0 backdrop-blur-xl sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 z-0 h-full w-full cursor-default" aria-label={labels.close} onClick={handleClose} />

      <article
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="future-dialog-title"
        className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white text-slate-950 opacity-0 shadow-[0_35px_100px_rgba(15,23,42,0.36)]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_18px_42px_rgba(15,23,42,0.26)] transition-transform duration-300 hover:scale-105"
          aria-label={labels.close}
        >
          <X size={19} />
        </button>

        <div className="max-h-[92vh] overflow-y-auto p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-16">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="group/preview relative overflow-hidden rounded-[1.8rem] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
                <img src={activeSrc} alt={`${project.title} ${labels.preview}`} className="h-[260px] w-full object-cover transition-transform duration-700 hover:scale-[1.035] sm:h-[420px]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/68 via-transparent to-transparent" />
                <span className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                  <ImageIcon size={15} />
                  {labels.preview}
                </span>
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-950 opacity-0 group-hover/preview:opacity-100 shadow-xl"
                  aria-label="View Full Image"
                >
                  <Maximize size={16} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {meta.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-2xl border p-1 transition-all duration-300 ${
                      activeImage === index ? "border-blue-500 bg-blue-50 shadow-[0_12px_28px_rgba(59,130,246,0.18)]" : "border-slate-200 bg-white hover:border-lime-300"
                    }`}
                  >
                    <img src={image} alt={`${project.title} thumbnail ${index + 1}`} className="h-20 w-full rounded-xl object-cover transition-transform duration-500 hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">{project.type}</p>
              <h2 id="future-dialog-title" className="mt-4 font-display text-4xl font-black leading-[0.92] sm:text-5xl">
                {project.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">{project.longDescription}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.3rem] bg-blue-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">{labels.timeline}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{project.timeline}</p>
                </div>
                <div className="rounded-[1.3rem] bg-lime-100 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{labels.role}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{project.role}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{labels.features}</p>
                <div className="mt-4 grid gap-3">
                  {project.features.map((feature) => (
                    <div key={feature} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-300 text-slate-950">
                        <CheckCircle2 size={15} />
                      </span>
                      <p className="text-sm font-semibold leading-6 text-slate-600">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{labels.stack}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={meta.liveUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-slate-950">
                  {labels.viewLive}
                  <ExternalLink size={16} />
                </a>
                <a href={meta.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-blue-500">
                  {labels.github}
                  <Github size={16} />
                </a>
                <a href={meta.caseStudyUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-slate-950 transition-all duration-300 hover:bg-lime-200">
                  {labels.caseStudy}
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[13000] flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-4 sm:p-8" 
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
            className="absolute right-6 top-6 sm:right-8 sm:top-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-slate-950"
            aria-label="Close Full Image"
          >
            <X size={24} />
          </button>
          <img 
            src={activeSrc} 
            alt="Full Preview" 
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>,
    document.body,
  );
};

const OpenMoreCTA = ({ eyebrow, title, text, buttonLabel }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const arrowRef = useRef(null);
  const glowRef = useRef(null);

  const handleMove = (event) => {
    const element = buttonRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(element, { x: x * 0.12, y: y * 0.16, scale: 1.025, duration: 0.34, ease: "power3.out" });
    gsap.to(arrowRef.current, { x: 5, duration: 0.28, ease: "power2.out" });
    gsap.to(glowRef.current, { autoAlpha: 1, scale: 1.08, duration: 0.35, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(buttonRef.current, { x: 0, y: 0, scale: 1, duration: 0.55, ease: "elastic.out(1, 0.35)" });
    gsap.to(arrowRef.current, { x: 0, duration: 0.3, ease: "power2.out" });
    gsap.to(glowRef.current, { autoAlpha: 0, scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleClick = () => {
    const main = document.querySelector("main");

    gsap.to(main, {
      autoAlpha: 0,
      y: 18,
      duration: 0.28,
      ease: "power2.inOut",
      onComplete: () => {
        navigate("/projects");
        window.requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          gsap.fromTo(main, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.48, ease: "power3.out" });
        });
      },
    });
  };

  return (
    <div className="future-open-more relative z-10 mt-8 overflow-hidden rounded-[2rem] border border-white/18 bg-white/12 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur-md sm:p-7">
      <div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-lime-300/28 blur-3xl" />
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-200">{eyebrow}</p>
          <h3 className="mt-3 font-display text-4xl font-black leading-[0.92] sm:text-5xl">{title}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">{text}</p>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleClick}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="relative inline-flex w-fit shrink-0 items-center gap-3 overflow-hidden rounded-full bg-slate-950 px-7 py-4 text-base font-black text-white shadow-[0_24px_54px_rgba(15,23,42,0.28)]"
        >
          <span ref={glowRef} className="absolute inset-0 bg-blue-500 opacity-0" />
          <span className="relative z-10">{buttonLabel}</span>
          <ArrowRight ref={arrowRef} className="relative z-10" size={19} />
        </button>
      </div>
    </div>
  );
};

const FutureProjectSkeleton = ({ variant }) => {
  const featured = variant === "featured";
  return (
    <article
      className={`future-showcase-card relative flex min-h-[560px] flex-col overflow-hidden rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-7 lg:col-span-6 lg:min-h-[640px] animate-pulse ${
        featured ? "bg-slate-950" : "bg-white"
      }`}
    >
      <div className="relative z-10 flex items-start justify-between gap-5">
        <div className="max-w-2xl w-full">
          <div className={`h-4 w-24 rounded-full ${featured ? "bg-white/10" : "bg-slate-200"}`} />
          <div className={`mt-5 h-12 w-3/4 rounded-xl ${featured ? "bg-white/10" : "bg-slate-200"}`} />
          <div className={`mt-3 h-12 w-1/2 rounded-xl ${featured ? "bg-white/10" : "bg-slate-200"}`} />
        </div>
        <div className={`h-14 w-14 shrink-0 rounded-2xl ${featured ? "bg-white/10" : "bg-slate-200"}`} />
      </div>
      <div className={`relative z-10 mt-10 h-64 w-full rounded-[1.4rem] ${featured ? "bg-white/10" : "bg-slate-200"}`} />
    </article>
  );
};

export const Future = () => {
  const { t } = useTranslation("future");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [dbProjects, setDbProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const labels = {
    close: t("modalClose"),
    preview: t("modalPreview"),
    overview: t("modalOverview"),
    features: t("modalFeatures"),
    stack: t("modalStack"),
    timeline: t("modalTimeline"),
    role: t("modalRole"),
    viewLive: t("viewLive"),
    github: t("githubRepository"),
    caseStudy: t("caseStudy"),
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const { data } = await fetchItems("future_projects");
      if (data) {
        const sortedData = data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        const mapped = sortedData.map((item, index) => ({
          id: item.id,
          project: {
            type: item.leads_title || "PROJECT",
            title: item.main_title,
            text: item.description,
            longDescription: item.description,
            timeline: item.timeline || "TBD",
            role: item.project_role || "Unknown",
            features: Array.isArray(item.key_features) ? item.key_features : [],
            tags: Array.isArray(item.stack_and_technologies) ? item.stack_and_technologies : [],
          },
          meta: {
            icon: DYNAMIC_ICONS[index % DYNAMIC_ICONS.length],
            images: Array.isArray(item.multiple_images) && item.multiple_images.length > 0 ? item.multiple_images : ["/placeholder.png"],
            liveUrl: item.live_demo_link || "#",
            githubUrl: item.github_repository_link || "#",
            caseStudyUrl: item.case_study_link || "#",
          },
          variant: item.is_featured ? "featured" : DYNAMIC_VARIANTS[index % DYNAMIC_VARIANTS.length]
        }));
        setDbProjects(mapped);
      }
      setIsLoading(false);
    };
    loadProjects();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const cards = gsap.utils.toArray(".future-showcase-card", sectionRef.current);
    const context = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 42, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
          },
        },
      );

      gsap.fromTo(
        ".future-open-more",
        { autoAlpha: 0, y: 30, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".future-open-more",
            start: "top 86%",
          },
        },
      );
    }, sectionRef);

    // Refresh scroll triggers after render dynamically mapped elements
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => context.revert();
  }, [isLoading, dbProjects]);

  return (
    <section ref={sectionRef} id="future" className="section-transition relative overflow-hidden rounded-[2rem] bg-blue-500 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute -right-12 bottom-16 h-72 w-32 rotate-[30deg] rounded-[4rem] bg-lime-300" />
      <div className="pointer-events-none absolute left-10 top-10 h-24 w-72 -rotate-6 rounded-[3rem] bg-white/12" />
      <div className="pointer-events-none absolute right-[8%] top-16 h-28 w-28 rounded-full bg-lime-200/42 blur-2xl" />

      <div className="relative z-10 mb-16 grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-8">
        <div className="pr-4 lg:pr-6">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lime-300">{t("eyebrow")}</p>
          <h2 className="mt-6 font-display text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-[6.5rem] text-balance">
            {t("title")}
          </h2>
        </div>
        <div className="flex flex-col items-start gap-8 lg:pl-12 lg:pt-4">
          <img src="/icon.svg" alt="H. Logo" className="w-full max-w-[16rem] md:max-w-[22rem] lg:max-w-[28rem] h-auto object-contain object-left" />
          <p className="max-w-md text-sm sm:text-base leading-loose text-white/95">{t("description")}</p>
        </div>
      </div>

      <div className="relative z-10 grid auto-rows-fr gap-5 lg:grid-cols-12">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <FutureProjectSkeleton key={i} variant={DYNAMIC_VARIANTS[i % DYNAMIC_VARIANTS.length]} />
          ))
        ) : dbProjects.length === 0 ? (
          <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/5 py-20 text-center shadow-xl backdrop-blur-xl">
             <p className="text-lg font-bold text-white/50">Future projects are currently empty.</p>
          </div>
        ) : (
          dbProjects.map((data, idx) => (
            <FutureProjectCard
              key={data.id}
              project={data.project}
              meta={data.meta}
              index={idx}
              variant={data.variant}
              onOpen={setSelectedIndex}
              detailLabel={t("detailButton")}
            />
          ))
        )}
      </div>

      <OpenMoreCTA eyebrow={t("openMoreEyebrow")} title={t("openMoreTitle")} text={t("openMoreText")} buttonLabel={t("openMoreButton")} />

      {selectedIndex !== null && (
        <FutureProjectModal 
          project={dbProjects[selectedIndex].project} 
          meta={dbProjects[selectedIndex].meta} 
          labels={labels} 
          onClose={() => setSelectedIndex(null)} 
        />
      )}
    </section>
  );
};
