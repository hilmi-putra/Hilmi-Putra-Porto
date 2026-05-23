import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, BrainCircuit, CheckCircle2, Code2, ShieldCheck, Terminal, Zap } from "lucide-react";
import { growthHighlightMeta, skillGroupMeta } from "../../data/portfolio";
import { SectionHeader } from "../ui/SectionHeader";

import antigravityLogo from "../../assets/ai logo/antigravity.png";
import chatgptLogo from "../../assets/ai logo/chatgpt.png";
import claudeLogo from "../../assets/ai logo/claude.png";
import codexLogo from "../../assets/ai logo/codex.png";
import cursorLogo from "../../assets/ai logo/cursor.png";
import deepseekLogo from "../../assets/ai logo/deepseek.png";
import geminiLogo from "../../assets/ai logo/gemini.png";
import traeLogo from "../../assets/ai logo/trae.png";

gsap.registerPlugin(ScrollTrigger);

const learningAiTools = [
  { name: "ChatGPT", mark: "openai", tile: "bg-emerald-500 text-white", position: "left-[82%] top-[74%]", rotate: -14 },
  { name: "Gemini", mark: "gemini", tile: "bg-white text-blue-500", position: "left-[33%] top-[4%]", rotate: 12 },
  { name: "Claude", mark: "claude", tile: "bg-[#ff914d] text-slate-950", position: "left-[61%] top-[12%]", rotate: 13 },
  { name: "DeepSeek", mark: "deepseek", tile: "bg-white text-blue-500", position: "left-[83%] top-[16%]", rotate: 8 },
];

const agentAiTools = [
  { name: "Trae", mark: "trae", tile: "bg-slate-950 text-red-500", position: "left-[22%] top-[43%]", rotate: 2 },
  { name: "Cursor", mark: "cursor", tile: "bg-slate-950 text-white", position: "left-[47%] top-[45%]", rotate: 10 },
  { name: "Claude Code", mark: "code", tile: "bg-white text-slate-950", position: "left-[72%] top-[47%]", rotate: 9 },
  { name: "Antigravity", mark: "antigravity", tile: "bg-slate-950 text-white", position: "left-[31%] top-[74%]", rotate: -10 },
];

const aiToolRows = {
  learning: learningAiTools,
  agents: agentAiTools,
};

const principleIcons = [ShieldCheck, Code2, Zap];

const logoMap = {
  openai: { src: chatgptLogo, alt: "ChatGPT" },
  gemini: { src: geminiLogo, alt: "Gemini" },
  claude: { src: claudeLogo, alt: "Claude" },
  deepseek: { src: deepseekLogo, alt: "DeepSeek" },
  trae: { src: traeLogo, alt: "Trae" },
  cursor: { src: cursorLogo, alt: "Cursor" },
  antigravity: { src: antigravityLogo, alt: "Antigravity" },
  codex: { src: codexLogo, alt: "Codex" },
  code: { src: codexLogo, alt: "Claude Code" },
};

const LogoGlyph = ({ mark, compact = false }) => {
  const logo = logoMap[mark];

  if (logo) {
    // Increased the size classes and added scale to make the logos appear much bigger.
    return <img src={logo.src} alt={logo.alt} className={compact ? "h-6 w-6 object-contain scale-110" : "h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 object-contain scale-110"} draggable="false" />;
  }

  return (
    <span className="relative flex h-full w-full items-center justify-center">
      <span className={`absolute rounded-full border-2 border-current ${compact ? "h-4 w-4" : "h-11 w-11"}`} />
      <span className={`absolute rotate-[60deg] rounded-full border-2 border-current ${compact ? "h-4 w-4" : "h-11 w-11"}`} />
      <span className={`absolute -rotate-[60deg] rounded-full border-2 border-current ${compact ? "h-4 w-4" : "h-11 w-11"}`} />
    </span>
  );
};

const AiToolChip = ({ tool }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] ${tool.tile}`}>
      <LogoGlyph mark={tool.mark} compact />
    </span>
    {tool.name}
    {tool.name === "Claude Code" && <span className="rounded-full bg-lime-200 px-2 py-1 text-[10px] font-black text-slate-950">MCP</span>}
  </span>
);

const AiCapabilityCard = ({ title, icon: Icon, tools, bullets }) => (
  <article className="ai-capability-card rounded-[2rem] border border-slate-200 bg-white/92 p-5 text-slate-950 shadow-[0_18px_54px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]">
        <Icon size={21} />
      </span>
      <h3 className="text-lg font-black text-blue-500">{title}</h3>
    </div>

    <div className="mt-5 flex flex-wrap gap-3">
      {tools.map((tool) => (
        <AiToolChip key={tool.name} tool={tool} />
      ))}
    </div>

    <div className="mt-5 h-px bg-slate-200/80" />

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {bullets.map((item) => (
        <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-200 text-slate-950">
            <CheckCircle2 size={13} />
          </span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </article>
);

const AiWorkflow = ({ content }) => {
  const sectionRef = useRef(null);
  const allTools = [...learningAiTools, ...agentAiTools];

  useEffect(() => {
    const context = gsap.context(() => {
      const logos = gsap.utils.toArray(".ai-falling-logo");
      const streaks = gsap.utils.toArray(".ai-rain-streak");

      gsap.fromTo(
        logos,
        {
          autoAlpha: 0,
          y: -190,
          rotate: (_, target) => Number(target.dataset.rotate) - 28,
          scale: 0.82,
        },
        {
          autoAlpha: 1,
          y: 0,
          rotate: (_, target) => Number(target.dataset.rotate),
          scale: 1,
          duration: 1,
          stagger: 0.065,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
          },
        },
      );

      gsap.to(logos, {
        y: "random(-4, 4)",
        rotate: (_, target) => Number(target.dataset.rotate) + gsap.utils.random(-1.5, 1.5),
        duration: "random(3, 4)",
        repeat: -1,
        yoyo: true,
        stagger: 0.18,
        ease: "sine.inOut",
        delay: 1,
      });

      gsap.fromTo(
        ".ai-capability-card, .ai-principle-bar",
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ai-capability-grid",
            start: "top 80%",
          },
        },
      );

      gsap.to(streaks, {
        y: 46,
        autoAlpha: 0.1,
        duration: 1.6,
        repeat: -1,
        stagger: 0.11,
        ease: "none",
      });
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative mt-16">
      <div className="pointer-events-none absolute -left-24 bottom-24 hidden h-48 w-48 rounded-full bg-blue-600 lg:block" />
      <div className="pointer-events-none absolute -right-28 top-40 hidden h-72 w-36 rotate-[30deg] rounded-[5rem] bg-lime-300 lg:block" />

      <div className="relative overflow-hidden rounded-[2.4rem] border border-white/80 bg-white px-5 py-10 text-slate-950 shadow-[0_32px_90px_rgba(15,23,42,0.14)] sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_4%,rgba(59,130,246,0.12),transparent_34%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(255,255,255,0.98))]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[54%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.05),transparent)]" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-lime-300 px-4 py-2 text-xs font-black uppercase tracking-normal text-slate-950 shadow-[0_12px_28px_rgba(132,204,22,0.22)]">
              {content.eyebrow}
            </p>
            <h3 className="mt-6 max-w-xl font-display text-4xl font-black leading-[0.9] text-slate-950 sm:text-5xl lg:text-6xl">
              {content.titleLead}
              <span className="block text-blue-500">{content.titleAccent}</span>
            </h3>
            <div className="mt-8 max-w-xl space-y-3 text-base font-medium leading-8 text-slate-600">
              {content.description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="absolute inset-0 overflow-hidden rounded-[2.4rem] mask-image-bottom">
              {Array.from({ length: 20 }).map((_, index) => (
                <span
                  key={index}
                  className="ai-rain-streak absolute top-0 h-36 w-px rounded-full bg-blue-200/70"
                  style={{ left: `${5 + index * 4.8}%`, opacity: index % 3 === 0 ? 0.28 : 0.14 }}
                />
              ))}
            </div>

            {allTools.map((tool) => (
              <div
                key={tool.name}
                className={`ai-falling-logo absolute ${tool.position} flex h-20 w-20 items-center justify-center rounded-[1.35rem] border-4 border-white ${tool.tile} shadow-[0_24px_54px_rgba(15,23,42,0.18)] will-change-transform sm:h-24 sm:w-24 lg:h-28 lg:w-28`}
                aria-label={tool.name}
                data-rotate={tool.rotate}
              >
                <LogoGlyph mark={tool.mark} className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14" />
              </div>
            ))}
          </div>
        </div>

        <div className="ai-capability-grid relative z-10 mt-8 grid gap-5 lg:grid-cols-2">
          <AiCapabilityCard title={content.learning.title} icon={BookOpen} tools={aiToolRows.learning} bullets={content.learning.bullets} />
          <AiCapabilityCard title={content.agents.title} icon={Terminal} tools={aiToolRows.agents} bullets={content.agents.bullets} />
        </div>

        <div className="ai-principle-bar relative z-10 mt-5 grid gap-5 rounded-[1.8rem] bg-blue-50/80 p-5 text-slate-950 shadow-[0_18px_54px_rgba(59,130,246,0.08)] backdrop-blur lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:items-center lg:p-6">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-[0_14px_30px_rgba(59,130,246,0.12)]">
              <BrainCircuit size={32} />
            </span>
            <p className="text-base font-black leading-7 text-slate-950">
              {content.foundationLead}
              <span className="block text-blue-500">{content.foundationAccent}</span>
            </p>
          </div>

          {content.principles.map((principle, index) => {
            const Icon = principleIcons[index];

            return (
              <div key={principle.title} className="flex items-center gap-4 border-slate-200 lg:border-l lg:pl-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-[0_12px_28px_rgba(59,130,246,0.1)]">
                  <Icon size={23} />
                </span>
                <p className="text-sm font-semibold leading-6 text-slate-700">
                  <span className="block font-black text-blue-500">{principle.title}</span>
                  {principle.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Growth = () => {
  const { t } = useTranslation("growth");
  const highlights = t("highlights", { returnObjects: true });
  const groups = t("groups", { returnObjects: true });
  const aiContent = t("ai", { returnObjects: true });

  return (
    <section id="growth" className="relative overflow-hidden px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute right-8 top-20 hidden h-44 w-24 rotate-[24deg] rounded-[4rem] bg-lime-200 lg:block" />
      <SectionHeader align="center" eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="stagger-group mt-12 grid gap-5 md:grid-cols-3">
        {highlights.map((item, index) => {
          const Icon = growthHighlightMeta[index].icon;

          return (
            <article key={item.value} className="stagger-card rounded-[1.8rem] border border-slate-200 bg-white p-6 text-center shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white">
                <Icon size={23} />
              </span>
              <h3 className="mt-5 font-display text-3xl font-black text-slate-950">{item.value}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-600">{item.label}</p>
            </article>
          );
        })}
      </div>

      <div className="stagger-group mt-6 grid gap-5 lg:grid-cols-4">
        {groups.map((group, index) => {
          const Icon = skillGroupMeta[index].icon;

          return (
            <article
              key={group.title}
              className="stagger-card group overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)] transition-transform duration-500 hover:-translate-y-2"
            >
              <div className="flex items-center justify-between gap-4">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${skillGroupMeta[index].color}`}>
                  <Icon size={22} />
                </span>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{t("stackBadge")}</span>
              </div>
              <h3 className="mt-7 font-display text-2xl font-black leading-none text-slate-950">{group.title}</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-700 transition-colors duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <AiWorkflow content={aiContent} />
    </section>
  );
};
