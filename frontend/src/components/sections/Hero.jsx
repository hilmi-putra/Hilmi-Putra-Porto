import { useTranslation } from "react-i18next";
import { Code2, MapPin, Sparkles } from "lucide-react";
import { heroVisuals, profile } from "../../data/portfolio";
import { MagneticButton } from "../ui/MagneticButton";

export const Hero = () => {
  const { t } = useTranslation("hero");
  const titleLines = t("titleLines", { returnObjects: true });
  const stats = t("stats", { returnObjects: true });

  return (
    <section id="hero" className="relative overflow-hidden rounded-[2rem] bg-white px-5 pb-10 pt-28 shadow-[0_28px_70px_rgba(15,23,42,0.18)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute -right-16 top-24 h-80 w-40 rotate-[38deg] rounded-[4rem] bg-lime-300" />
      <div className="pointer-events-none absolute right-20 top-44 h-64 w-28 -rotate-[24deg] rounded-[4rem] bg-lime-200/80" />
      <div className="pointer-events-none absolute -left-20 bottom-24 h-56 w-24 -rotate-[34deg] rounded-[4rem] bg-blue-100" />
      <div className="pointer-events-none absolute inset-x-8 top-24 border-t border-slate-100" />

      <div className="relative z-10 grid min-h-[calc(100svh-9rem)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col items-start gap-8">
          <div className="hero-reveal inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-slate-950">
              <Sparkles size={17} />
            </span>
            <span className="text-sm font-extrabold text-slate-950">{t("badge")}</span>
          </div>

          <div className="max-w-5xl">
            <p className="hero-reveal mb-5 flex items-center gap-2 text-sm font-bold text-blue-600">
              <MapPin size={16} />
              {t("locationPrefix")} {profile.location}
            </p>
            <h1 className="hero-reveal font-display text-[clamp(3.4rem,9vw,8.4rem)] font-black leading-[0.86] tracking-normal text-slate-950">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <p className="hero-reveal max-w-2xl text-lg leading-8 text-slate-600">{t("description")}</p>

          <div className="hero-reveal flex flex-col gap-3 sm:flex-row">
            <MagneticButton href="#future" variant="primary">
              {t("ctaPrimary")}
            </MagneticButton>
            <MagneticButton href={`mailto:${profile.email}`} variant="outline">
              {t("ctaSecondary")}
            </MagneticButton>
          </div>

          <div className="hero-reveal grid w-full max-w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.value} className="rounded-[1.4rem] border border-slate-200 bg-white/80 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)]">
                <div className="font-display text-3xl font-black text-blue-600">{stat.value}</div>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-reveal relative mx-auto w-full max-w-[560px] py-6">
          <div className="parallax-soft absolute -left-5 top-14 z-20 hidden rotate-[-8deg] rounded-[1.4rem] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:block">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-500">{t("currentFocusEyebrow")}</p>
            <p className="mt-2 max-w-48 text-sm font-extrabold leading-5 text-slate-950">{t("currentFocusText")}</p>
          </div>

          <div className="float-item relative z-10 overflow-hidden rounded-[2rem] bg-blue-500 p-4 shadow-[0_30px_80px_rgba(59,130,246,0.34)]">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-white">
              <img src={heroVisuals.portrait} alt={t("portraitAlt", { name: profile.name })} className="image-scale h-[380px] w-full object-cover object-center sm:h-[520px]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/82 to-transparent p-6 text-white">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-lime-200">{t("portraitLabel")}</p>
                <h2 className="mt-2 font-display text-3xl font-black leading-none">{t("portraitTitle")}</h2>
              </div>
            </div>
          </div>

          <div className="float-item absolute -right-8 top-0 z-0 hidden h-36 w-36 rotate-12 items-center justify-center rounded-[2rem] bg-slate-950 p-5 shadow-[0_22px_60px_rgba(15,23,42,0.2)] sm:flex">
            <img src={heroVisuals.layer} alt="" className="h-full w-full object-contain" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
};
