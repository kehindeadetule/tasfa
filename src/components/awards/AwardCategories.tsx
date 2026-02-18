"use client";
import Link from "next/link";
import AnimatedSection from "@/components/common/AnimatedSection";

interface AwardCategoriesProps {
  year: string;
  onBack: () => void;
}

const categories = {
  student: [
    "Best Actor",
    "Best Actress",
    "Best Supporting Actor",
    "Best Supporting Actress",
    "Revelation of the Year (Male)",
    "Revelation of the Year (Female)",
    "Best Director",
    "Best Stage Manager",
    "Best Playwright",
    "Best Set Designer",
    "Best Light Designer",
    "Best Props Designer",
    "Best Costumier",
    "Best Makeup Artist",
    "Best Publicity Manager",
    "Best Dancer (Male)",
    "Best Dancer (Female)",
    "Best Drummer (Male)",
    "Best Drummer (Female)",
    "Best Choreographer",
    "Best Music Director",
    "Best Media Student (Male)",
    "Best Media Student (Female)",
  ],
};

export default function AwardCategories({ year, onBack }: AwardCategoriesProps) {
  return (
    <div>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#005B96] hover:text-[#1B1464] font-medium mb-8 transition-colors group"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
        Back to Awards
      </button>

      <div className="md:space-y-16 space-y-8">
        {/* Student Categories */}
        <section>
          <div className="text-center mb-10">
            <div className="inline-block bg-[#E7FBFE] font-semibold text-[#1B1464] px-4 py-2 text-sm rounded-full mb-4">
              TASFA {year} AWARDS
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#1B1464] mb-4">
              Students Excellence Awards
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recognizing the rising stars who are redefining creativity and
              pushing the boundaries of theatrical expression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.student.map((category, index) => (
              <AnimatedSection
                key={category}
                animation="fadeInUp"
                delay={0.1}
              >
                <Link
                  href={`/awards/category/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/\(/g, "")
                    .replace(/\)/g, "")}`}
                  className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-[#005B96]/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#005B96] transition-colors">
                      {category}
                    </h3>
                    <div className="text-[#005B96] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-[#005B96]/10 px-2 py-1 rounded-full">
                      Category #{index + 1}
                    </span>
                    <span className="text-xs text-[#005B96] font-medium">
                      Voting Closed
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <AnimatedSection animation="fadeInUp" delay={0.6}>
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-[#005B96] to-[#1B1464] rounded-2xl text-white max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Celebrate Excellence?
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
            Join the movement that celebrates creativity, recognizes talent,
            and strengthens the bonds of Nigeria&apos;s vibrant theatre arts
            community.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
            <span className="flex items-center">Theatre Excellence</span>
            <span className="flex items-center">Talent Recognition</span>
            <span className="flex items-center">Community Unity</span>
            <span className="flex items-center">Cultural Heritage</span>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
