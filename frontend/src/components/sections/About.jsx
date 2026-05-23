import { ArrowLeft, ArrowRight } from "lucide-react";
import hilmiPortrait from "../../assets/hilmi_portrait.png";
import Starfield from "../ui/Starfield";

export const About = () => {
  return (
    <section id="about" className="py-24 bg-white text-text-dark flex flex-col justify-center relative select-none grainy-overlay">
      <Starfield className="absolute inset-0 pointer-events-none z-0" count={6} />
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column - Large grainy stippled black & white portrait */}
        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="w-full max-w-sm rounded-2xl overflow-hidden aspect-[3/4] relative shadow-[0_20px_40px_rgba(0,0,0,0.15)] group border border-black/5">
            <img src={hilmiPortrait} alt="Hilmi B&W Portrait" className="w-full h-full object-cover stippled-img transition-transform duration-700 ease-out group-hover:scale-103" />
            {/* Soft Grainy filter accent */}
            <div className="absolute inset-0 bg-neutral-900/10 pointer-events-none mix-blend-overlay" />
          </div>
        </div>

        {/* Right Column - About information */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left items-start">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-text-dark">About Me</h2>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light font-sans max-w-2xl">
            I am a graduate of SMK Negeri 1 Cimahi majoring in Software Engineering, with a strong interest in web and application development. I have hands-on experience in full-stack development
            using HTML, CSS, JavaScript, PHP (Laravel & Native), Tailwind CSS, and Bootstrap.
          </p>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light font-sans max-w-2xl">
            I am skilled in team management, technical documentation, API integration (such as Midtrans), and capable of working both independently and collaboratively. Known as a fast learner,
            adaptable, and passionate about continuous growth in the field of information technology.
          </p>

          {/* Custom Arrows Navigation matching mockup */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => {
                const element = document.getElementById("hero");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-text-dark hover:border-brand-orange hover:text-brand-orange transition-all duration-300 hover:scale-105"
              aria-label="Previous section"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("projects");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-12 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-brand-orange hover:scale-105 transition-all duration-300"
              aria-label="Next section"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
