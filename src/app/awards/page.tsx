import { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/common/AnimatedSection";
import VotingStatusIndicator from "@/components/VotingStatusIndicator";
import NotificationSettings from "@/components/NotificationSettings";

export const metadata: Metadata = {
  title: "Awards - TASFA 2025",
  description:
    "Vote for the brightest stars and most innovative institutions in theatre arts.",
  openGraph: {
    title: "Awards - TASFA 2025",
    description:
      "Vote for the brightest stars and most innovative institutions in theatre arts.",
    url: "https://dga0m8ap1tk9g.cloudfront.net/awards",
    siteName: "TASFA",
    images: [
      {
        url: "/hero-bg-m.png",
        width: 1200,
        height: 630,
        alt: "TASFA - Awards",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Awards - TASFA 2025",
    description:
      "Vote for the brightest stars and most innovative institutions in theatre arts.",
    images: ["/hero-bg-m.png"],
  },
  alternates: {
    canonical: "/awards",
  },
};

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

export default function AwardsPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#E7FBFE] text-[#1B1464] px-4 py-2 text-sm font-medium rounded-full">
              TASFA 2025 AWARDS
            </div>
          </div>
        </AnimatedSection>

        {/* Voting Status and Notifications */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <VotingStatusIndicator />
            <NotificationSettings />
          </div>
        </div>

        <div className="md:space-y-16 space-y-8">
          {/* Student Categories */}
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
            <AnimatedSection animation="fadeInUp" delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.student.map((category, index) => (
                  <AnimatedSection
                    key={category}
                    animation="fadeInUp"
                    delay={0.1 * (index % 6)}
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
                          Vote Now
                        </span>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </section>
        </div>

        {/* Call to Action */}
        <AnimatedSection animation="fadeInUp" delay={0.6}>
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-[#005B96] to-[#1B1464] rounded-2xl text-white max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🌟 Ready to Celebrate Excellence?
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
              Join the movement that celebrates creativity, recognizes talent,
              and strengthens the bonds of Nigeria's vibrant theatre arts
              community.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <span className="flex items-center">🎭 Theatre Excellence</span>
              <span className="flex items-center">🏆 Merit Recognition</span>
              <span className="flex items-center">🤝 Community Unity</span>
              <span className="flex items-center">🎨 Cultural Heritage</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
