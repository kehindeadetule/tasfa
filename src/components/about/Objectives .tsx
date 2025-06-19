import values from "@/assets/about-two.png";
import valuesMobile from "@/assets/about-two-m.png";
import Image from "next/image";
import AnimatedSection from "../common/AnimatedSection";
import { Users, Globe, Award, Network } from "lucide-react";

export default function Values() {
  return (
    <section
      id="objectives"
      className="md:py-20 py-14 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 md:px-0">
        <div className="text-center mb-12">
          <AnimatedSection animation="fadeIn">
            <span className="inline-block bg-[#E7FBFE] text-[#1B1464] px-4 py-2 text-sm font-medium rounded-full mb-4">
              TASFA OBJECTIVES
            </span>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              Our <span className="text-[#1B1464]">Mission</span> to Empower
              <br className="hidden md:block" />
              Theatre Arts <span className="text-[#1B1464]">Students</span>
            </h2>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#E7FBFE] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#1B1464]" />
              </div>
              <h3 className="text-xl text-[#1B1464] font-semibold mb-4">
                Unite Theatre Arts Students
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Connect theatre arts students from all higher institutions of
                learning to foster a sense of community, collaboration, and
                cultural appreciation.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.4}>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#E7FBFE] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-[#1B1464]" />
              </div>
              <h3 className="text-xl text-[#1B1464] font-semibold mb-4">
                Showcase Cultural Richness
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Provide a platform for students to express and celebrate the
                diversity and depth of our cultural heritage through various
                forms of artistic expression.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.5}>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#E7FBFE] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Award className="w-7 h-7 text-[#1B1464]" />
              </div>
              <h3 className="text-xl text-[#1B1464] font-semibold mb-4">
                Recognize Artistic Ingenuity
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Award and honor students who demonstrate outstanding talent and
                academic achievements, encouraging the pursuit of both creative
                and intellectual growth.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.6}>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#E7FBFE] w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Network className="w-7 h-7 text-[#1B1464]" />
              </div>
              <h3 className="text-xl text-[#1B1464] font-semibold mb-4">
                Bridge the Gap to Industry
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Facilitate networking opportunities between students and
                practitioners in the industry, fostering mentorship, real-world
                insights, and potential career pathways.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fadeInUp" delay={0.9}>
          <div className="mt-12">
            <Image
              src={values}
              alt="TASFA Values"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
