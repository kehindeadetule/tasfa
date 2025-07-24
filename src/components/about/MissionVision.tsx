import strategicIcon from "@/assets/icons/strategic-icon.png";
import stakeholderIcon from "@/assets/icons/stakeholder-icon.png";
import Image from "next/image";
import AnimatedSection from "../common/AnimatedSection";

export default function MissionVision() {
  return (
    <section
      id="mission"
      className="relative min-h-screen bg-[#005B96] overflow-hidden "
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),rgba(0,91,150,0.05))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>

      <div className="container mx-auto px-4 py-14 md:py-20 relative">
        <AnimatedSection animation="fadeInUp">
          <div className="text-center text-white mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Our Purpose<span className="hidden md:inline">,</span>{" "}
              <br className="md:hidden" /> Our Path
            </h2>
            <p className="text-xl text-blue-200 mt-4">
              Driving Innovation and Success
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Vision Section */}
            <AnimatedSection animation="fadeIn" delay={0.4}>
              <div id="vision" className="relative mb-16 md:mb-20">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-24 bg-gradient-to-b from-[#ED1C24] to-[#C6007E] rounded-full"></div>
                <div className="ml-2 md:ml-12">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ED1C24] to-[#C6007E] p-1">
                      <div className="w-full h-full bg-[#005B96] rounded-xl flex items-center justify-center">
                        <Image
                          src={stakeholderIcon}
                          alt="Vision Icon"
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1B1464]">
                      Our Vision
                    </h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                    <p className="text-white/90 leading-relaxed text-lg">
                      To be a beacon of artistic excellence and cultural unity,
                      empowering theatre arts students with the skills,
                      recognition, and opportunities they need to lead and
                      innovate in the future of the performing arts industry.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            {/* Mission Section */}
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <div className="relative mb-16 md:mb-20">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-24 bg-gradient-to-b from-[#FFD200] to-[#F37021] rounded-full"></div>
                <div className="ml-2 md:ml-12">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FFD200] to-[#F37021] p-1">
                      <div className="w-full h-full bg-[#005B96] rounded-xl flex items-center justify-center">
                        <Image
                          src={strategicIcon}
                          alt="Mission Icon"
                          className="w-8 h-8"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-[#1B1464]">
                      Our Mission
                    </h3>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                    <p className="text-white/90 leading-relaxed text-lg">
                      To create an inclusive and inspiring platform that
                      celebrates the talents of theatre arts students across the
                      nation, promotes cultural diversity, and fosters
                      connections between academia and the professional arts
                      community.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-0 top-1/4 w-96 h-96 bg-[#FFD200]/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-[#F37021]/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute left-1/4 bottom-0 w-72 h-72 bg-[#ED1C24]/5 rounded-full blur-[80px] animate-pulse delay-500"></div>
        <div className="absolute right-1/4 top-0 w-72 h-72 bg-[#C6007E]/5 rounded-full blur-[80px] animate-pulse delay-1500"></div>
      </div>
    </section>
  );
}
