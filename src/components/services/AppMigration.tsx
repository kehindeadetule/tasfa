import projectIcon from "@/assets/icons/project-icon.png";
import riskIcon from "@/assets/icons/risk-icon.png";
import agileIcon from "@/assets/icons/agile-icon.png";
import qualityIcon from "@/assets/icons/quality-icon.png";
import supportIcon from "@/assets/icons/support-icon.png";
import stakeholderIcon from "@/assets/icons/stakeholder-icon.png";
import boxIcon from "@/assets/icons/service-icon.png";
import Image from "next/image";
import AnimatedSection from "../common/AnimatedSection";

export default function AppMigration() {
  const migrationServices = [
    {
      icon: projectIcon,
      title: "Comprehensive Project Planning",
      description:
        "We create detailed project plans with a clear scope, timelines, and resources. Our risk management and stakeholder alignment ensure a smooth, disruption-free transition.",
    },
    {
      icon: stakeholderIcon,
      title: "Stakeholder Management",
      description:
        "We coordinate cross-functional teams and vendors while maintaining transparency. Clear communication and timely decisions keep projects aligned with business goals.",
    },
    {
      icon: riskIcon,
      title: "Risk & Impact Assessment",
      description:
        "We analyze risks and potential impacts to foresee project challenges. Mitigation strategies help reduce disruptions and optimize project execution.",
    },
    {
      icon: agileIcon,
      title: "Agile Project Execution",
      description:
        "We follow an adaptive, iterative approach to ensure flexibility in migration. Continuous feedback loops allow us to refine and enhance project strategies.",
    },
    {
      icon: qualityIcon,
      title: "Quality Assurance & Testing",
      description:
        "We conduct testing to ensure system security, performance and stability. User Acceptance Testing guarantees functionality before full deployment.",
    },
    {
      icon: supportIcon,
      title: "Post-Migration Support & Optimization",
      description:
        "We monitor system performance, resolve issues, and provide user training. Continuous improvements ensure long-term success and business efficiency.",
    },
  ];

  return (
    <div className="bg-[#016CEE] py-16 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="text-center mb-8">
          <AnimatedSection animation="fadeIn">
            <div className="inline-block px-3 py-1 text-xs text-[#016CEE] bg-[#E7FBFE] rounded-full mb-4">
              OUR SERVICES
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h2 className="md:text-4xl text-3xl md:font-semibold font-medium text-white mb-4">
              Application Migration: Secure and Hassle Free Transitions.
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <p className="md:text-xl text-white max-w-3xl mx-auto">
              We manage application migration projects with a structured,
              project-driven approach to minimize risk and ensure seamless
              transitions.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 relative">
          {migrationServices.map((service, index) => (
            <AnimatedSection
              key={index}
              animation="fadeInUp"
              delay={0.4 + index * 0.1}
            >
              <div className="md:p-6 p-1 rounded-lg items-start">
                <div className="text-white flex items-center gap-3 mb-2">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    className="w-6 h-6"
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                </div>
                <div>
                  <p className="text-white">{service.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      {/* left and right plus sign */}
      <div className="absolute inset-0 z-0 mt-4">
        <div className="absolute left-0 top-0 md:w-24 w-14 md:h-24 h-14">
          <Image
            src={boxIcon}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="absolute right-0 top-0 md:w-24 md:h-24 w-14 h-14">
          <Image
            src={boxIcon}
            alt=""
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
