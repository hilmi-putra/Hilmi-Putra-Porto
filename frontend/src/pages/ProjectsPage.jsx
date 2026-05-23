import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Figma,
  Github,
  Image as ImageIcon,
  Maximize2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  Workflow, 
  Layers3, 
  MonitorSmartphone, 
  Rocket, 
  Database, 
  Smartphone, 
  Palette, 
  ServerCog
} from "lucide-react";
import { fetchItems } from "../services/api";

gsap.registerPlugin(ScrollTrigger);

const DYNAMIC_ICONS = [Workflow, Layers3, MonitorSmartphone, Rocket, Database, Smartphone, Palette, ServerCog];

const useMagneticButton = () => {
  const buttonRef = useRef(null);
  const arrowRef = useRef(null);
  const glowRef = useRef(null);

  const handleMove = (event) => {
    const element = buttonRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(element, { x: x * 0.14, y: y * 0.18, scale: 1.025, duration: 0.34, ease: "power3.out" });
    gsap.to(arrowRef.current, { x: 5, duration: 0.28, ease: "power2.out" });
    gsap.to(glowRef.current, { autoAlpha: 1, scale: 1.08, duration: 0.34, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(buttonRef.current, { x: 0, y: 0, scale: 1, duration: 0.55, ease: "elastic.out(1, 0.35)" });
    gsap.to(arrowRef.current, { x: 0, duration: 0.28, ease: "power2.out" });
    gsap.to(glowRef.current, { autoAlpha: 0, scale: 1, duration: 0.28, ease: "power2.out" });
  };

  return { buttonRef, arrowRef, glowRef, handleMove, handleLeave };
};

const CaseStudyButton = ({ children, onClick }) => {
  const { buttonRef, arrowRef, glowRef, handleMove, handleLeave } = useMagneticButton();

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-blue-600 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-colors duration-300 hover:border-blue-200 hover:text-white"
    >
      <span ref={glowRef} className="absolute inset-0 bg-blue-500 opacity-0" />
      <span className="relative z-10">{children}</span>
      <ArrowRight ref={arrowRef} className="relative z-10" size={16} />
    </button>
  );
};

const ProjectCard = ({ project, labels, onOpen }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const iconRef = useRef(null);
  const tagsRef = useRef(null);
  const glowRef = useRef(null);
  const Icon = project.meta.icon;

  const handleEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.01,
      boxShadow: "0 28px 70px rgba(15,23,42,0.18)",
      duration: 0.4,
      ease: "power3.out",
    });
    gsap.to(imageRef.current, { scale: 1.055, y: -3, duration: 0.58, ease: "power3.out" });
    gsap.to(iconRef.current, { y: -5, rotate: -6, scale: 1.08, duration: 0.36, ease: "power3.out" });
    gsap.to(glowRef.current, { autoAlpha: 1, x: 12, duration: 0.38, ease: "power2.out" });
    gsap.to(tagsRef.current?.children || [], { y: -2, stagger: 0.025, duration: 0.28, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 16px 40px rgba(15,23,42,0.09)",
      duration: 0.45,
      ease: "power3.out",
    });
    gsap.to(imageRef.current, { scale: 1, y: 0, duration: 0.52, ease: "power3.out" });
    gsap.to(iconRef.current, { y: 0, rotate: 0, scale: 1, duration: 0.36, ease: "power3.out" });
    gsap.to(glowRef.current, { autoAlpha: 0, x: 0, duration: 0.3, ease: "power2.out" });
    gsap.to(tagsRef.current?.children || [], { y: 0, stagger: 0.02, duration: 0.26, ease: "power2.out" });
  };

  return (
    <article
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="project-archive-card group relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.55rem] border border-slate-200/80 bg-white p-3 opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.09)] will-change-transform"
    >
      <div ref={glowRef} className="pointer-events-none absolute -right-16 -top-14 h-44 w-44 rounded-full bg-blue-300/35 opacity-0 blur-3xl" />

      <button
        type="button"
        onClick={() => onOpen(project)}
        className="relative z-10 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-slate-50"
        aria-label={`${labels.openCaseStudy} ${project.title}`}
      >
        <span className="absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.28)]">
          {project.isFeatured ? <Star size={14} fill="currentColor" /> : <Sparkles size={14} />}
        </span>
        <span className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.12)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-105">
          <Maximize2 size={14} />
        </span>
        <img
          ref={imageRef}
          src={project.meta.images[0]}
          alt={`${project.title} preview`}
          loading="lazy"
          className={`aspect-[16/9] w-full object-cover transition-transform duration-700 ${
            project.meta.images[0].endsWith(".png") ? "object-contain p-4" : ""
          }`}
        />
        <span
          ref={iconRef}
          className="absolute -bottom-5 left-4 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-lime-300 text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
        >
          <Icon size={18} />
        </span>
      </button>

      <div className="relative z-10 flex flex-1 flex-col px-2 pb-1 pt-8">
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-blue-500">{project.category}</p>
        <h2 className="mt-2 text-xl font-black leading-tight text-slate-950 [overflow-wrap:anywhere]">{project.title}</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500 line-clamp-3">{project.shortDescription}</p>
      </div>

      <div ref={tagsRef} className="relative z-10 mt-1 flex flex-wrap gap-2 px-2">
        {project.stack.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-600 transition-colors duration-300 group-hover:bg-lime-200 group-hover:text-slate-950"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-auto px-2 pb-1 pt-4">
        <CaseStudyButton onClick={() => onOpen(project)}>
          {labels.openCaseStudy}
        </CaseStudyButton>
      </div>
    </article>
  );
};

const ProjectCaseStudyModal = ({ project, labels, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const lightboxStateRef = useRef(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
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
      .to(panelRef.current, { autoAlpha: 0, y: 28, scale: 0.97, filter: "blur(10px)", duration: 0.24, ease: "power2.in" })
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
        { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "power3.out" },
        "-=0.08",
      );

    closeRef.current?.focus();

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

  const activeSrc = project.meta.images[activeImage];

  return createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[12000] flex items-end justify-center bg-slate-950/62 px-3 py-4 opacity-0 backdrop-blur-xl sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 z-0 h-full w-full cursor-default" aria-label={labels.modalClose} onClick={handleClose} />

      <article
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        className="relative z-10 max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white text-slate-950 opacity-0 shadow-[0_35px_100px_rgba(15,23,42,0.36)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950 text-white shadow-[0_18px_42px_rgba(15,23,42,0.26)] transition-transform duration-300 hover:scale-105"
          aria-label={labels.modalClose}
        >
          <X size={19} />
        </button>

        <div className="max-h-[92vh] overflow-y-auto p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-16">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="group/preview relative overflow-hidden rounded-[1.8rem] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
                <img src={activeSrc} alt={`${project.title} ${labels.modalGallery}`} className="h-[260px] w-full object-cover transition-transform duration-700 hover:scale-[1.035] sm:h-[420px]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/68 via-transparent to-transparent" />
                <span className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-xl">
                  <ImageIcon size={15} />
                  {labels.modalGallery}
                </span>
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/14 text-white backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-slate-950 opacity-0 group-hover/preview:opacity-100 shadow-xl"
                  aria-label="View Full Image"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                {project.meta.images.map((image, index) => (
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
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">{project.category}</p>
              <h2 id="project-dialog-title" className="mt-4 font-display text-4xl font-black leading-[0.92] sm:text-5xl">
                {project.title}
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">{project.longDescription}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.3rem] bg-blue-50 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-500">{labels.modalTimeline}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{project.timeline}</p>
                </div>
                <div className="rounded-[1.3rem] bg-lime-100 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{labels.modalRole}</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{project.role}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{labels.modalFeatures}</p>
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

              {project.challenges && project.challenges.length > 0 && (
                <div className="mt-6 rounded-[1.6rem] bg-slate-950 p-5 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">{labels.modalChallenges}</p>
                  <div className="mt-4 grid gap-3">
                    {project.challenges.map((challenge) => (
                      <div key={challenge} className="flex gap-3 text-sm font-semibold leading-6 text-white/78">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lime-300" />
                        <span>{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">{labels.modalStack}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tag) => (
                    <span key={tag} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={project.meta.liveUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-slate-950">
                  {labels.viewLive}
                  <ExternalLink size={16} />
                </a>
                <a href={project.meta.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition-all duration-300 hover:bg-blue-500">
                  {labels.githubRepository}
                  <Github size={16} />
                </a>
                <a href={project.meta.figmaUrl} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-black text-slate-950 transition-all duration-300 hover:bg-lime-200">
                  {labels.figmaFile}
                  <Figma size={16} />
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

const ProjectArchiveSkeleton = () => (
  <article className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.55rem] border border-slate-200/80 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.09)] animate-pulse">
    <div className="relative z-10 aspect-[16/9] w-full rounded-[1.25rem] bg-slate-200" />
    <div className="relative z-10 flex flex-1 flex-col px-2 pb-1 pt-8">
      <div className="h-3 w-16 rounded-full bg-slate-200" />
      <div className="mt-4 h-6 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-4 h-4 w-full rounded-full bg-slate-200" />
      <div className="mt-2 h-4 w-2/3 rounded-full bg-slate-200" />
    </div>
    <div className="relative z-10 mt-auto px-2 pb-1 pt-4">
      <div className="h-10 w-full rounded-2xl bg-slate-200" />
    </div>
  </article>
);

export const ProjectsPage = () => {
  const { t } = useTranslation("projects");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortMode, setSortMode] = useState("featured");
  const [selectedProject, setSelectedProject] = useState(null);
  const [dbProjects, setDbProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState(["All", "Featured"]);
  const pageRef = useRef(null);
  const gridRef = useRef(null);

  const sortOptions = t("sortOptions", { returnObjects: true });

  const labels = {
    openCaseStudy: t("openCaseStudy"),
    modalClose: t("modalClose"),
    modalGallery: t("modalGallery"),
    modalStack: t("modalStack"),
    modalFeatures: t("modalFeatures"),
    modalChallenges: t("modalChallenges"),
    modalRole: t("modalRole"),
    modalTimeline: t("modalTimeline"),
    viewLive: t("viewLive"),
    githubRepository: t("githubRepository"),
    figmaFile: t("figmaFile"),
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      const { data } = await fetchItems("future_projects");
      if (data) {
        // Build dynamic categories automatically
        const categoriesSet = new Set();
        data.forEach(item => {
          if (item.leads_title) categoriesSet.add(item.leads_title);
        });
        setDynamicCategories(["All", "Featured", ...Array.from(categoriesSet)]);

        // Map Supabase data to Project Archive UI schema
        const mapped = data.map((item, index) => ({
          id: item.id,
          title: item.main_title,
          category: item.leads_title || "Project",
          phase: item.status || "In Progress",
          shortDescription: item.description,
          longDescription: item.description,
          timeline: item.timeline || "TBD",
          role: item.project_role || "Unknown",
          stack: Array.isArray(item.stack_and_technologies) ? item.stack_and_technologies : [],
          features: Array.isArray(item.key_features) ? item.key_features : [],
          challenges: [], // Fallback for challenges (if added to DB later)
          isFeatured: item.is_featured,
          priority: item.sort_order || 0,
          meta: {
            icon: DYNAMIC_ICONS[index % DYNAMIC_ICONS.length],
            images: Array.isArray(item.multiple_images) && item.multiple_images.length > 0 ? item.multiple_images : ["/placeholder.png"],
            liveUrl: item.live_demo_link || "#",
            githubUrl: item.github_repository_link || "#",
            figmaUrl: item.case_study_link || "#",
          }
        }));
        setDbProjects(mapped);
      }
      setIsLoading(false);
    };
    loadProjects();
  }, []);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = dbProjects.filter((project) => {
      const matchesCategory = 
        activeCategory === "All" || 
        (activeCategory === "Featured" && project.isFeatured) || 
        project.category === activeCategory;
        
      const searchable = [project.title, project.category, project.phase, project.shortDescription, project.timeline, project.role, ...project.stack]
        .join(" ")
        .toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sortMode === "az") {
        return a.title.localeCompare(b.title);
      }

      if (sortMode === "newest") {
        return b.priority - a.priority;
      }

      return a.priority - b.priority;
    });
  }, [activeCategory, dbProjects, query, sortMode]);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(".project-page-hero > *", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08, ease: "power3.out" });
      gsap.fromTo(".project-filter-shell", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power3.out", delay: 0.12 });
    }, pageRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const cards = gsap.utils.toArray(".project-archive-card", gridRef.current);
    if (cards.length > 0) {
      gsap.fromTo(cards, { autoAlpha: 0, y: 34, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.64, stagger: 0.055, ease: "power3.out" });
    }
    
    // Refresh ScrollTrigger to recalculate DOM heights
    setTimeout(() => ScrollTrigger.refresh(), 100);
  }, [visibleProjects, isLoading]);

  return (
    <div ref={pageRef} className="relative min-h-screen overflow-hidden bg-blue-500 px-4 pb-16 pt-28 text-slate-950 sm:px-6 lg:px-8 lg:pt-32">
      <div className="pointer-events-none absolute -right-16 top-36 h-80 w-36 rotate-[30deg] rounded-[5rem] bg-lime-300" />
      <div className="pointer-events-none absolute left-8 top-40 h-24 w-72 -rotate-6 rounded-[4rem] bg-white/14" />
      <div className="pointer-events-none absolute right-[12%] top-24 h-28 w-28 rounded-full bg-lime-200/42 blur-2xl" />
      <div className="pointer-events-none absolute bottom-24 left-[8%] h-36 w-36 rounded-full bg-white/12 blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="project-page-hero grid gap-8 pb-10 text-white lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <a href="/#future" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-black text-white shadow-[0_16px_44px_rgba(15,23,42,0.12)] backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-slate-950">
              <ArrowLeft size={16} />
              Future preview
            </a>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-lime-200">{t("eyebrow")}</p>
            <h1 className="mt-4 max-w-5xl font-display text-5xl font-black leading-[0.9] tracking-normal text-white sm:text-6xl lg:text-8xl">
              {t("title")}
            </h1>
          </div>

          <div className="rounded-[2rem] border border-white/18 bg-white/12 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur-md sm:p-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
              <Sparkles size={24} />
            </div>
            <p className="mt-5 text-base leading-8 text-white/78">{t("description")}</p>
          </div>
        </section>

        <section className="project-filter-shell mb-6 rounded-[2rem] border border-white/70 bg-white p-4 shadow-[0_22px_64px_rgba(15,23,42,0.16)] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <span className="sr-only">{t("searchPlaceholder")}</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-14 w-full rounded-full border border-slate-200 bg-slate-50 pl-12 pr-5 text-sm font-bold text-slate-950 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:shadow-[0_14px_34px_rgba(59,130,246,0.14)]"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">{t("sortLabel")}</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="h-14 w-full appearance-none rounded-full border border-slate-200 bg-slate-50 pl-12 pr-10 text-sm font-black text-slate-950 outline-none transition-all duration-300 focus:border-blue-400 focus:bg-white lg:w-56"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-black uppercase tracking-[0.18em] text-slate-400">{t("filterLabel")}</span>
            {dynamicCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-black transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]"
                    : "bg-blue-50 text-blue-600 hover:bg-lime-300 hover:text-slate-950"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-bold text-slate-500">{t("results", { count: visibleProjects.length })}</p>
        </section>

        {isLoading ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array(8).fill(0).map((_, i) => (
              <ProjectArchiveSkeleton key={`skeleton-${i}`} />
            ))}
          </section>
        ) : visibleProjects.length > 0 ? (
          <section ref={gridRef} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} labels={labels} onOpen={setSelectedProject} />
            ))}
          </section>
        ) : (
          <section className="rounded-[2rem] bg-white p-10 text-center shadow-[0_22px_64px_rgba(15,23,42,0.16)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-300 text-slate-950">
              <Search size={26} />
            </div>
            <h2 className="mt-5 font-display text-4xl font-black text-slate-950">{t("emptyTitle")}</h2>
            <p className="mt-3 text-sm font-semibold text-slate-500">{t("emptyText")}</p>
          </section>
        )}
      </div>

      {selectedProject && <ProjectCaseStudyModal project={selectedProject} labels={labels} onClose={() => setSelectedProject(null)} />}
    </div>
  );
};

export default ProjectsPage;
