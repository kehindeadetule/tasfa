import Link from "next/link";
import AnimatedSection from "@/components/common/AnimatedSection";

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
  institutional: [
    "Creative Art Institution of the Year",
    "Creative Art Institution of the Year (1st Runner-Up)",
    "Creative Art Institution of the Year (2nd Runner-Up)",
  ],
  honorary: ["Theatre Legend of the Year"],
};

export default function ZonePage({ params }: { params: { zone: string } }) {
  const zoneName = params.zone.charAt(0).toUpperCase() + params.zone.slice(1);

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#E7FBFE] text-[#1B1464] px-4 py-2 text-sm font-medium rounded-full mb-6">
              {zoneName.toUpperCase()} ZONE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1B1464] mb-6">
              🏆 Celebrate Excellence in
              <br className="hidden md:block" />
              <span className="text-[#005B96]">Theatre Arts</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Where talent meets recognition. Vote for the brightest stars and
              most innovative institutions shaping the future of theatre arts in
              the {zoneName} Zone.
            </p>
          </div>
        </AnimatedSection>

        {/* Stats and Intro */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-[#005B96] to-[#1B1464] rounded-2xl p-8 md:p-12 text-white mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  ✨ Your Voice, Their Victory ✨
                </h2>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Join thousands of voters in recognizing outstanding talent and
                  celebrating the artistic achievements that define our creative
                  community.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    {categories.student.length}
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Student Categories
                  </div>
                  <div className="text-xs text-blue-200 mt-1">
                    Celebrating emerging talent
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    {categories.institutional.length}
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Institutional Awards
                  </div>
                  <div className="text-xs text-blue-200 mt-1">
                    Honoring excellence
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    {categories.honorary.length}
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Honorary Awards
                  </div>
                  <div className="text-xs text-blue-200 mt-1">
                    Legendary recognition
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 rounded-full text-sm font-medium border border-green-200 mb-4">
                🗳️ Voting is Live - Make Your Voice Count!
              </div>
              <p className="text-gray-600">
                Click any category below to view nominees and cast your vote.
                <br className="hidden md:block" />
                Every vote helps recognize the incredible talent in our theatre
                arts community.
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="space-y-16">
          {/* Student Categories */}
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <section>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1B1464] mb-4">
                  🌟 Student Excellence Awards
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
                    delay={0.1 * (index % 6)}
                  >
                    <Link
                      href={`/awards/${params.zone}/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
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
                          Vote Now
                        </span>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* Institutional Awards */}
          <AnimatedSection animation="fadeInUp" delay={0.4}>
            <section>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1B1464] mb-4">
                  🏛️ Institutional Excellence
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Celebrating institutions that nurture talent, foster
                  creativity, and shape the future leaders of theatre arts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.institutional.map((category, index) => (
                  <AnimatedSection
                    key={category}
                    animation="fadeInUp"
                    delay={0.1 * index}
                  >
                    <Link
                      href={`/awards/${params.zone}/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-[#C6007E]/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 group-hover:text-[#C6007E] transition-colors">
                          {category}
                        </h3>
                        <div className="text-[#C6007E] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                          →
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-[#C6007E]/10 px-2 py-1 rounded-full">
                          Institution #{index + 1}
                        </span>
                        <span className="text-xs text-[#C6007E] font-medium">
                          Vote Now
                        </span>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* Honorary Awards */}
          <AnimatedSection animation="fadeInUp" delay={0.5}>
            <section>
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1B1464] mb-4">
                  👑 Legendary Recognition
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Honoring the titans who have paved the way and continue to
                  inspire generations of theatre artists.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.honorary.map((category, index) => (
                  <AnimatedSection
                    key={category}
                    animation="fadeInUp"
                    delay={0.1 * index}
                  >
                    <Link
                      href={`/awards/${params.zone}/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-[#F37021]/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 group-hover:text-[#F37021] transition-colors">
                          {category}
                        </h3>
                        <div className="text-[#F37021] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                          →
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-[#F37021]/10 px-2 py-1 rounded-full">
                          Honorary Recognition
                        </span>
                        <span className="text-xs text-[#F37021] font-medium">
                          Vote Now
                        </span>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </section>
          </AnimatedSection>
        </div>

        {/* Call to Action */}
        <AnimatedSection animation="fadeInUp" delay={0.6}>
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-[#005B96] to-[#1B1464] rounded-2xl text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🎭 Ready to Make a Difference?
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
              Your vote matters! Help us recognize and celebrate the outstanding
              talent that makes the {zoneName} Zone a beacon of artistic
              excellence.
            </p>
            <div className="text-sm text-blue-200">
              Join the celebration of creativity, innovation, and theatrical
              brilliance.
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
