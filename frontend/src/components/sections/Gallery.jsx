import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SectionHeader } from "../ui/SectionHeader";
import { fetchItems } from "../../services/api";
import useEmblaCarousel from "embla-carousel-react";

// Maintain the original bento grid spans
const gridSpans = [
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-3",
];
const getGridSpan = (index) => gridSpans[index % gridSpans.length];

export const Gallery = () => {
  const { t } = useTranslation("gallery");
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auto carousel threshold logic
  const isCarousel = galleries.length > 5;
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    active: isCarousel,
  });

  useEffect(() => {
    const loadGalleries = async () => {
      setIsLoading(true);
      const { data } = await fetchItems("gallery");
      if (data) {
        const formatted = data.map((item) => ({
          id: item.id,
          title: item.caption_en || "Untitled",
          label: item.description || "Category",
          image: item.media_url,
        }));
        setGalleries(formatted);
      }
      setIsLoading(false);
    };
    loadGalleries();
  }, []);

  const renderCard = (item, index, forCarousel = false) => {
    const spanClass = forCarousel
      ? "w-[85vw] sm:w-[60vw] lg:w-[45vw] h-[350px] lg:h-[480px] shrink-0 mr-5"
      : getGridSpan(index);

    return (
      <figure
        key={item.id}
        className={`stagger-card group relative min-h-[250px] overflow-hidden rounded-[1.8rem] bg-white/8 ${spanClass}`}
      >
        <img
          src={item.image}
          alt={item.title}
          className="image-scale h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/8 to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-lime-200">
            {item.label}
          </p>
          <h3 className="mt-2 font-display text-3xl font-black leading-none text-white">
            {item.title}
          </h3>
        </figcaption>
      </figure>
    );
  };

  const renderSkeleton = (index, forCarousel = false) => {
    const spanClass = forCarousel
      ? "w-[85vw] sm:w-[60vw] lg:w-[45vw] h-[350px] lg:h-[480px] shrink-0 mr-5"
      : getGridSpan(index);
    return (
      <figure
        key={`skeleton-${index}`}
        className={`stagger-card relative min-h-[250px] overflow-hidden rounded-[1.8rem] bg-white/10 animate-pulse ${spanClass}`}
      >
        <div className="absolute inset-0 bg-slate-800/50" />
        <figcaption className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-3 h-3 w-24 rounded-full bg-white/20" />
          <div className="h-8 w-2/3 rounded-full bg-white/20" />
        </figcaption>
      </figure>
    );
  };

  return (
    <section
      id="gallery"
      className="section-transition relative overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-20"
    >
      <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
        <SectionHeader
          light
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
        <div className="reveal-up flex flex-col items-start gap-6 lg:justify-self-end">
          <img src="/icon.svg" alt="H. Logo" className="w-40 sm:w-48 lg:w-56 h-auto object-contain" />
          <p className="max-w-xl text-base leading-8 text-white/62">
            {t("helper")}
          </p>
        </div>
      </div>

      <div className="mt-12">
        {isLoading ? (
          <div className="stagger-group grid gap-5 lg:grid-cols-12 lg:auto-rows-[230px]">
            {Array(5)
              .fill(0)
              .map((_, i) => renderSkeleton(i, false))}
          </div>
        ) : galleries.length === 0 ? (
          <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/5 py-20 text-center shadow-xl backdrop-blur-xl">
            <p className="text-lg font-bold text-white/50">
              Gallery is currently empty.
            </p>
          </div>
        ) : isCarousel ? (
          // Embla Carousel View
          <div className="stagger-group overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {galleries.map((item, index) => renderCard(item, index, true))}
            </div>
          </div>
        ) : (
          // Static Grid View
          <div className="stagger-group grid gap-5 lg:grid-cols-12 lg:auto-rows-[230px]">
            {galleries.map((item, index) => renderCard(item, index, false))}
          </div>
        )}
      </div>
    </section>
  );
};
