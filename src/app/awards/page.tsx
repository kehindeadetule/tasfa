import { Metadata } from "next";
import Link from "next/link";
import AnimatedSection from "@/components/common/AnimatedSection";

export const metadata: Metadata = {
  title: "Awards - TASFA 2025",
  description:
    "Get in touch with our experts to discuss your IT needs and start your digital transformation journey.",
  openGraph: {
    title: "Awards - TASFA 2025",
    description:
      "Get in touch with our experts to discuss your IT needs and start your digital transformation journey.",
    url: "https://dga0m8ap1tk9g.cloudfront.net/contact",
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
      "Get in touch with our experts to discuss your IT needs and start your digital transformation journey.",
    images: ["/hero-bg-m.png"],
  },
  alternates: {
    canonical: "/awards",
  },
};

const zones = [
  {
    id: "east",
    name: "East Zone",
    description: "Celebrating artistic excellence across the Eastern regions",
    highlight: "Rising Stars",
    color: "from-[#005B96] to-[#1B1464]",
  },
  {
    id: "west",
    name: "West Zone",
    description: "Honoring creative innovation in the Western territories",
    highlight: "Creative Innovators",
    color: "from-[#C6007E] to-[#ED1C24]",
  },
  {
    id: "north",
    name: "North Zone",
    description: "Recognizing cultural heritage in the Northern regions",
    highlight: "Cultural Guardians",
    color: "from-[#F37021] to-[#FFD200]",
  },
  {
    id: "south",
    name: "South Zone",
    description: "Showcasing artistic brilliance in the Southern areas",
    highlight: "Artistic Pioneers",
    color: "from-[#ED1C24] to-[#C6007E]",
  },
];

export default function AwardsPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#E7FBFE] text-[#1B1464] px-4 py-2 text-sm font-medium rounded-full mb-6">
              TASFA 2025 AWARDS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#1B1464] mb-6">
              🎭 Choose Your
              <br className="hidden md:block" />
              <span className="text-[#005B96]">Artistic Territory</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Embark on a journey across Nigeria's creative landscape. Each zone
              tells a unique story of talent, passion, and artistic excellence
              waiting to be celebrated.
            </p>
          </div>
        </AnimatedSection>

        {/* Stats Section */}
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-[#005B96] to-[#1B1464] rounded-2xl p-8 md:p-12 text-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  ✨ Four Zones, Infinite Talent ✨
                </h2>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Discover extraordinary performers, innovative institutions,
                  and legendary figures who are shaping the future of Nigerian
                  theatre arts.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    26
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Award Categories
                  </div>
                  <div className="text-xs text-blue-200 mt-1">Per Zone</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    1000+
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Nominees
                  </div>
                  <div className="text-xs text-blue-200 mt-1">Nationwide</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    50K+
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Expected Votes
                  </div>
                  <div className="text-xs text-blue-200 mt-1">
                    Community driven
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-3xl font-bold text-[#FFD200] mb-2">
                    4
                  </div>
                  <div className="text-sm font-medium text-blue-100">
                    Cultural Zones
                  </div>
                  <div className="text-xs text-blue-200 mt-1">
                    United in arts
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 rounded-full text-sm font-medium border border-green-200 mb-4">
                🚀 Voting Opens Soon - Get Ready to Vote!
              </div>
              <p className="text-gray-600">
                Select your zone below to explore categories and discover the
                incredible talent
                <br className="hidden md:block" />
                that makes each region unique in Nigeria's theatre arts
                landscape.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Zone Selection */}
        <AnimatedSection animation="fadeInUp" delay={0.3}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B1464] mb-4">
              🗺️ Explore the Zones
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each zone represents a unique blend of cultural heritage, artistic
              innovation, and creative excellence. Click to discover the stars
              of your region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {zones.map((zone, index) => (
              <AnimatedSection
                key={zone.id}
                animation="fadeInUp"
                delay={0.1 * index}
              >
                <Link
                  href={`/awards/${zone.id}`}
                  className="group block relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100"
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${zone.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <div className="relative p-8">
                    {/* Zone Icon */}
                    <div className="text-center mb-6">
                      <div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${zone.color} text-white text-2xl font-bold mb-4`}
                      >
                        {zone.name.charAt(0)}
                      </div>
                    </div>

                    {/* Zone Info */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#1B1464] mb-3 group-hover:text-[#005B96] transition-colors">
                        {zone.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {zone.description}
                      </p>

                      {/* Highlight Badge */}
                      <div
                        className={`inline-block px-3 py-1 bg-gradient-to-r ${zone.color} text-white text-xs font-medium rounded-full mb-4`}
                      >
                        {zone.highlight}
                      </div>

                      {/* Action Indicator */}
                      <div className="flex items-center justify-center space-x-2 text-[#005B96] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                        <span className="text-sm font-medium">
                          Explore Awards
                        </span>
                        <span className="transform group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${zone.color}`}
                    ></div>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${zone.color}`}
                    ></div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* Call to Action */}
        <AnimatedSection animation="fadeInUp" delay={0.6}>
          <div className="text-center mt-16 py-12 bg-gradient-to-r from-[#005B96] to-[#1B1464] rounded-2xl text-white max-w-5xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              🌟 Ready to Celebrate Excellence?
            </h3>
            <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
              Join the movement that celebrates creativity, recognizes talent,
              and strengthens the bonds of Nigeria's vibrant theatre arts
              community across all zones.
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
