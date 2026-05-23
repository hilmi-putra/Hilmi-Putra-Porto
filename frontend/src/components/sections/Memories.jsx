import { useTranslation } from "react-i18next";
import { memoryMeta } from "../../data/portfolio";
import { SectionHeader } from "../ui/SectionHeader";

export const Memories = () => {
  const { t } = useTranslation("memories");
  const items = t("items", { returnObjects: true });

  return (
    <section id="memories" className="section-transition relative overflow-hidden rounded-[2rem] bg-blue-500 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20">
      <div className="pointer-events-none absolute -right-8 top-10 h-44 w-24 rotate-[28deg] rounded-[4rem] bg-lime-300" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-28 w-72 -rotate-6 rounded-[3rem] bg-white/12" />

      <div className="relative z-10 flex flex-col gap-12">
        <SectionHeader light eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <div className="stagger-group grid gap-5 md:grid-cols-3">
          {items.map((memory, index) => {
            const Icon = memoryMeta[index].icon;

            return (
              <article
                key={memory.title}
                className="stagger-card group relative min-h-[320px] overflow-hidden rounded-[1.8rem] bg-white p-6 text-slate-950 shadow-[0_22px_55px_rgba(15,23,42,0.12)] transition-transform duration-500 hover:-translate-y-2"
              >
                <span className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-lime-300 group-hover:text-slate-950">
                  <Icon size={24} />
                </span>
                <div className="flex h-full flex-col justify-between gap-10">
                  <span className="w-fit rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">{memory.year}</span>
                  <div>
                    <h3 className="font-display text-3xl font-black leading-none">{memory.title}</h3>
                    <p className="mt-5 text-sm leading-7 text-slate-600">{memory.text}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
