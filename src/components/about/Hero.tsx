import heroBg from "@/assets/bg-img-3.jpg";
import AnimatedSection from "../common/AnimatedSection";

export default function AboutHero() {
  return (
    <section
      className="relative min-h-[86vh] md:min-h-[65vh] lg:min-h-screen overflow-hidden bg-[#003677]"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 z-[1]" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 h-full">
        <div className="w-11/12 md:w-2/3 lg:w-1/2 text-white text-right mx-auto absolute lg:inset-y-75 md:inset-y-60 inset-y-48 md:right-2 lg:right-14 xl:right-8">
          <AnimatedSection animation="fadeInUp">
            <h1 className="text-3xl md:text-5xl font-semibold mb-8 md:tracking-normal tracking-wide [text-shadow:_0_4px_8px_rgba(0,0,0,0.8)] leading-16 ">
              Showcasing <br className="md:hidden" /> Cultural{" "}
              <br className="hidden md:block" />
              Heritage <br className="md:hidden" />
              <span className="text-[#005B96]">Through Art</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <p className="md:text-xl leading-relaxed text-gray-100">
              A premier platform uniting theatre arts students to showcase
              <br className="md:hidden" /> creativity, innovation, and Nigeria's
              rich cultural diversity.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
