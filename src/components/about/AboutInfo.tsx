import aboutInfo from "@/assets/bg-img-2.jpg";
import Image from "next/image";
import AnimatedSection from "../common/AnimatedSection";

export default function AboutInfo() {
  return (
    <section className="md:py-16 py-12 px-1 md:px-0">
      <div className="container mx-auto px-4 md:px-0">
        <div className="text-center mb-12">
          <AnimatedSection animation="fadeIn">
            <span className="inline-block bg-[#E7FBFE] text-[#1B1464] px-3 py-1.5 text-xs rounded-2xl mb-4">
              ABOUT TASFA
            </span>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h2 className="text-[#1B1464] text-3xl md:text-4xl font-semibold leading-tight mt-1">
              Celebrating Theatre Arts Excellence{" "}
              <br className="hidden md:block" />
              Across Nigerian Institutions
            </h2>
          </AnimatedSection>
        </div>
        <div className="relative">
          <Image
            src={aboutInfo}
            alt="TASFA Festival"
            className="rounded-xl w-full"
          />
        </div>

        <div className="mt-12">
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <p className="text-lg leading-relaxed mb-6">
              <span className="text-[#005B96]">
                THE THEATRE Arts STUDENTS FESTIVAL AND AWARDS (TASFA)
              </span>{" "}
              is a premier platform that unites theatre arts students from
              universities and colleges of education across Nigeria. Through
              this vibrant festival, we showcase the richness of cultural
              heritage, artistic expression, and academic excellence in the
              performing arts.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.4}>
            <p className="text-lg leading-relaxed mb-6">
              Our festival serves as a dynamic bridge between emerging
              student-artists and established practitioners in the industry. We
              create opportunities for meaningful mentorship, foster
              collaborative projects, and facilitate professional growth,
              ensuring that the next generation of theatre artists is
              well-prepared for the industry.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.5}>
            <p className="text-lg leading-relaxed">
              TASFA stands as a celebration of talent, a vibrant display of
              cultural diversity, and a testament to our commitment to nurturing
              the future of performing arts in Nigeria. Through our platform, we
              not only recognize excellence but also create a space where
              creativity flourishes and cultural heritage is preserved and
              celebrated.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
