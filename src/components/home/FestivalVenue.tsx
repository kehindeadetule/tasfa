import strategicIcon from "@/assets/icons/strategic-icon.png";
import serviceIcon from "@/assets/icons/service-icon.png";
import visionIcon from "@/assets/icons/vision.png";
import stakeholderIcon from "@/assets/icons/stakeholder-icon.png";
import Image, { StaticImageData } from "next/image";
import AnimatedSection from "../common/AnimatedSection";

export default function Services() {
  return (
    <section className="py-16 md:py-24 relative bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[#005B96]">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#005B96] via-[#0077C0] to-[#003D66] opacity-90"></div>

        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),rgba(0,91,150,0.05))]"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block bg-[#E7FBFE] text-[#1B1464] px-6 py-2 text-sm rounded-full mb-6 font-medium shadow-sm">
            FESTIVAL VENUE
          </div>
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-white text-lg md:text-xl leading-relaxed">
            Our partners are at the forefront of innovation and excellence,
            bringing their expertise and resources to make TASFA 2025 a
            remarkable success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w- mx-auto">
          {/* High Visibility */}
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <ServiceCard
              title="High Visibility Across a Large, Captive Audience"
              icon={visionIcon}
              description="The enclosed and self-contained nature of the camp means sponsor branding will dominate the space throughout the four-day festival. Banners, stage backdrops, branded zones, and digital screens ensure continuous exposure to every attendee."
            />
          </AnimatedSection>

          {/* Activation Opportunities */}
          <AnimatedSection animation="fadeIn" delay={0.3}>
            <ServiceCard
              title="On-Site Activation Opportunities"
              icon={serviceIcon}
              description="Sponsors can set up activation booths, demo areas, or interactive stands within high-traffic zones like registration points, workshop halls, and the main arena — maximizing brand interaction in a secure, concentrated setting."
            />
          </AnimatedSection>

          {/* Extended Brand Exposure */}
          <AnimatedSection animation="fadeIn" delay={0.4}>
            <ServiceCard
              title="Extended Brand Exposure"
              icon={strategicIcon}
              description="Unlike a traditional venue with short rental windows, the camp allows for multi-day engagement. Your brand presence stays active for the entire festival duration — including both day and late-night events."
            />
          </AnimatedSection>

          {/* Media Content Opportunities */}
          <AnimatedSection animation="fadeIn" delay={0.5}>
            <ServiceCard
              title="Media Content Opportunities"
              icon={stakeholderIcon}
              description="The venue's layout and open-air spaces allow for creative filming, influencer engagement, and branded media coverage. Sponsors can co-create content that lives beyond the event and connects with wider online audiences."
            />
          </AnimatedSection>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-0 top-1/4 w-96 h-96 bg-[#7FB3D5]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-[#AED6F1]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute left-1/4 bottom-0 w-72 h-72 bg-[#005B96]/20 rounded-full blur-[80px] animate-pulse delay-500"></div>
        <div className="absolute right-1/4 top-0 w-72 h-72 bg-[#0077C0]/20 rounded-full blur-[80px] animate-pulse delay-1500"></div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  title: string;
  icon: StaticImageData;
  description: string;
}

function ServiceCard({ title, icon, description }: ServiceCardProps) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-[#7FB3D5]/40 transition-all duration-300 hover:transform hover:-translate-y-2 shadow-lg shadow-black/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7FB3D5]/5 to-[#AED6F1]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10">
        <div className="w-12 h-12 mb-6 bg-white/5 rounded-xl p-3 flex items-center justify-center border border-white/10">
          <Image
            src={icon}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>

        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <h4 className="text-lg xl:text-lg font-semibold mb-4 text-white group-hover:text-[#1B1464] transition-colors duration-300">
            {title}
          </h4>
        </AnimatedSection>

        <p className="text-white/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
