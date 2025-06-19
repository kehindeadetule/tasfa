import heroBg from "@/assets/service-bg.png";
import AnimatedSection from "../common/AnimatedSection";

export default function ServicesHero() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-[#001d3d] lg:min-h-[100vh] md:min-h-[calc(100vh-300px)] min-h-[calc(100vh-200px)] ">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg.src})`,
          // opacity: 0.8,
        }}
      />

      <div className="container text-right relative z-10 mx-auto px-4 lg:mt-48 mt-32 flex flex-col items-end justify-center h-full">
        <div className="md:w-2/3 text-white">
          <AnimatedSection animation="fadeInUp">
            <h1 className="text-3xl md:text-5xl font-semibold mb-8 md:leading-16  md:tracking-wide tracking-wider [text-shadow:_0_4px_8px_rgba(0,0,0,0.8)] w-5/6 md:w-full ml-14 md:ml-0">
              Tailored IT Solutions for Seamless{" "}
              <br className="hidden lg:block" />
              Digital Transformation
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <p className="md:text-xl leading-relaxed w-full">
              We provide expert-driven project management for TMS,{" "}
              <br className="hidden lg:block" /> application migration, and web
              development delivering <br className="hidden lg:block" />{" "}
              efficient, scalable, and future-ready solutions.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
