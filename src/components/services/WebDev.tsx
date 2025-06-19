import Image from "next/image";
import strategicIcon from "@/assets/icons/strategic-icon.png";
import teamIcon from "@/assets/icons/team-icon.png";
import agileIcon from "@/assets/icons/agile-icon.png";
import qualityIcon from "@/assets/icons/quality-icon.png";
import AnimatedSection from "../common/AnimatedSection";

export default function WebDev() {
  const webDevServices = [
    {
      icon: strategicIcon,
      title: "Strategic Project Planning",
      description:
        "We establish clear objectives, define scope, and allocate resources effectively. Timelines and risk management strategies are set to ensure project success.",
    },
    {
      icon: agileIcon,
      title: "Agile Development Management",
      description:
        "We use iterative development cycles to enable faster feature deployment. Continuous stakeholder feedback helps refine requirements for optimal results.",
    },
    {
      icon: teamIcon,
      title: "Cross-Functional Team Coordination",
      description:
        "Our teams of designers, developers, and testers collaborate seamlessly. Defined milestones keep the project on track and aligned with business goals.",
    },
    {
      icon: qualityIcon,
      title: "Quality Assurance",
      description:
        "We conduct functional and performance testing to maintain high standards. Security validation ensures a risk-free and reliable digital experience.",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl md:max-w-3xl lg:max-w-7xl mx-auto px-4 md:px-0">
        <div className="text-center mb-12">
          <AnimatedSection animation="fadeIn">
            <div className="inline-block px-3 py-1 text-xs text-[#016CEE] bg-[#E7FBFE] rounded-full mb-4">
              OUR SERVICES
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h2 className="md:text-4xl text-3xl md:font-semibold font-medium text-[#016CEE] mb-4">
              Web Development – Scalable and Business Driven Solutions
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <p className="md:text-lg text-gray-700 max-w-3xl mx-auto">
              We manage web development projects through a structured,
              project-focused approach, ensuring timely delivery and quality
              outcomes.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {webDevServices.map((service, index) => (
            <AnimatedSection
              key={index}
              animation="fadeInUp"
              delay={0.4 + index * 0.1}
            >
              <div className="border border-gray-200 h-auto rounded-xl p-8 shadow-xl transition-transform hover:scale-105">
                <div className="bg-[#1B1464] text-white p-3 rounded-full inline-block mb-4">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    className="w-6.5 h-6"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1B1464] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
