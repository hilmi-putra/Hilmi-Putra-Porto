import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import gsap from "gsap";
import Starfield from "../ui/Starfield";

// Assets
import infraschMockup from "../../assets/infrasch_mockup.png";

export const FeaturedWork = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideContainer = useRef();

  const projects = [
    {
      title: "Manavest",
      subTitle: "Manajemen Investasi",
      description: "A premium full-stack personal finance and investment management platform featuring detailed charts, asset class tracking, and automatic real-time API-driven rate updates.",
      category: "Financial Dashboard",
      image: infraschMockup, // Swappable mockup image
      link: "#",
    },
    {
      title: "Infrasch Mobile App",
      subTitle: "Kolaborasi Tim Modern",
      description: "A sleek, collaborative mobile app interface tailored for creative agencies and tech teams to synchronize schedules, track task lists, and exchange resources on the fly.",
      category: "UI/UX Mobile App",
      image: infraschMockup, // High quality white smartphone mockup
      link: "#",
    },
    {
      title: "Midtrans Payment Gateway",
      subTitle: "Sistem Pembayaran E-Commerce",
      description: "An advanced modular e-commerce gateway integration utilizing Midtrans API, fully supporting manual/automatic status synchronization, webhooks, and secure checkout portals.",
      category: "API Integration / Backend",
      image: infraschMockup,
      link: "#",
    },
  ];

  const handleNext = () => {
    // GSAP exit animation
    gsap.to(".slide-content", {
      opacity: 0,
      x: -30,
      duration: 0.3,
      onComplete: () => {
        setActiveSlide((prev) => (prev + 1) % projects.length);
        // GSAP enter animation
        gsap.fromTo(".slide-content", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
      },
    });
  };

  const handlePrev = () => {
    // GSAP exit animation
    gsap.to(".slide-content", {
      opacity: 0,
      x: 30,
      duration: 0.3,
      onComplete: () => {
        setActiveSlide((prev) => (prev - 1 + projects.length) % projects.length);
        // GSAP enter animation
        gsap.fromTo(".slide-content", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" });
      },
    });
  };

  const currentProject = projects[activeSlide];

  return (
    <section id="projects" className="py-28 bg-[#111111] text-white flex flex-col justify-center relative overflow-hidden select-none border-b border-white/5">
      <Starfield className="absolute inset-0 pointer-events-none z-0" count={7} palette={["#60A5FA", "#A78BFA", "#F4C848"]} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col gap-12 relative z-10">
        {/* Section Header */}
        <div className="flex justify-between items-center w-full">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Featured Work</h2>
          <span className="text-xs uppercase tracking-widest text-text-secondary font-light">
            Slide {activeSlide + 1} of {projects.length}
          </span>
        </div>

        {/* Carousel Content Split Container */}
        <div ref={slideContainer} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[400px] slide-content">
          {/* Left Text Block */}
          <div className="lg:col-span-6 flex flex-col items-start text-left gap-6">
            <span className="text-brand-orange text-xs uppercase tracking-widest font-bold">{currentProject.category}</span>
            <h3 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {currentProject.title} : <span className="block text-text-secondary font-medium text-2xl sm:text-3xl mt-1">{currentProject.subTitle}</span>
            </h3>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed font-light font-sans max-w-xl">{currentProject.description}</p>
            <a
              href={currentProject.link}
              className="text-sm uppercase tracking-wider font-semibold border-b-2 border-brand-orange pb-1 text-white hover:text-brand-orange hover:scale-105 transition-all mt-4"
            >
              See More Project Details
            </a>
          </div>

          {/* Right Phone Mockup Block */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6">
            {/* Ambient Background glow */}
            <div className="absolute w-72 h-72 bg-brand-orange/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="max-w-xs sm:max-w-sm rounded-3xl overflow-hidden drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] transform hover:rotate-2 hover:scale-[1.03] transition-all duration-500">
              <img src={currentProject.image} alt="Smartphone Application Mockup" className="w-full h-auto object-contain max-h-[480px]" />
            </div>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 hidden md:block">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-text-dark transition-all duration-300 active:scale-95"
            aria-label="Previous slide"
          >
            <ArrowLeft size={16} />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 -translate-y-1/2 hidden md:block">
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-text-dark transition-all duration-300 active:scale-95"
            aria-label="Next slide"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 mt-4 md:hidden">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:bg-white active:text-text-dark transition-all"
            aria-label="Previous slide"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white active:bg-white active:text-text-dark transition-all"
            aria-label="Next slide"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
