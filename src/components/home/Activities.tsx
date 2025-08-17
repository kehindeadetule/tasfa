// import homeOne from "/assets/activity.webp";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "../common/AnimatedSection";

export default function Advantage() {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-5 md:px-0">
        <div className="text-center mb-12">
          <AnimatedSection animation="fadeIn">
            <span className=" text-sm bg-[#E7FBFE] font-semibold text-[#1B1464] py-2 px-4 rounded-full">
              TASFA 2025 THEME
            </span>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h2 className="text-2xl md:text-4xl text-[#1B1464] tracking-wide md:leading-12 leading-8 md:font-bold font-semibold mt-8 md:mt-6 mb-6">
              <span className="">Theatre Reimagined:</span>
              <br />
              Celebrating Roots, Creating Futures
            </h2>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 gap-10 items-center mb-10">
          <div className="">
            {/* Timeline Item 1 */}
            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <div className="mb-10">
                <h3 className="md:text-2xl text-lg font-medium text-[#1B1464] mb-3">
                  Nominations
                </h3>
                <p className="text-gray-700">July 21st – August 4th, 2025</p>
              </div>
            </AnimatedSection>

            {/* Timeline Item 2 */}
            <AnimatedSection animation="fadeInUp" delay={0.5}>
              <div className="mb-10">
                <h3 className="md:text-2xl text-lg font-medium text-[#1B1464] mb-3">
                  Online Voting
                </h3>
                <p className="text-gray-700">August 10th – August 24th, 2025</p>
              </div>
            </AnimatedSection>

            {/* Timeline Item 3 */}
            <AnimatedSection animation="fadeInUp" delay={0.6}>
              <div className="mb-10">
                <h3 className="md:text-2xl text-lg font-medium text-[#1B1464] mb-3">
                  Submission of Works
                </h3>
                <p className="text-gray-700">
                  August 30th – September 8th, 2025
                </p>
              </div>
            </AnimatedSection>

            {/* Timeline Item 4 */}
            <AnimatedSection animation="fadeInUp" delay={0.7}>
              <div className="mb-10">
                <h3 className="md:text-2xl text-lg font-medium text-[#1B1464] mb-3">
                  Grading of Submitted Works
                </h3>
                <p className="text-gray-700">
                  September 14th – September 28th, 2025
                </p>
              </div>
            </AnimatedSection>

            {/* Timeline Item 5 */}
            <AnimatedSection animation="fadeInUp" delay={0.8}>
              <div>
                <h3 className="md:text-2xl text-lg font-medium text-[#1B1464] mb-3">
                  Festival
                </h3>
                <p className="text-gray-700">
                  October 16th – October 19th, 2025
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
        {/* button */}
        <AnimatedSection animation="fadeIn" delay={0.9}>
          <div className="flex justify-center w-full mx-auto mt-15">
            <Link
              href="/awards"
              className="bg-[#005B96] md:text-lg text-center text-base hover:bg-[#344a6e] text-white py-2.5 px-20 rounded-full"
            >
              Vote Now
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
