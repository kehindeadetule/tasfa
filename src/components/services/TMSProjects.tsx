import upgradeIcon from "@/assets/icons/upgrade-icon.png";
import migrateIcon from "@/assets/icons/migrate-icon.png";
import implementIcon from "@/assets/icons/implement-icon.png";
import Image from "next/image";
import AnimatedSection from "../common/AnimatedSection";

export default function TMSProjects() {
  const tmsServices = [
    {
      icon: upgradeIcon,
      title: "TMS Upgrade",
      description:
        "We provide seamless enhancements to existing TMS platforms by ensuring smooth business continuity with zero downtime, maximizing system efficiency through feature and performance upgrades, and strengthening data protection with robust security improvements.",
    },
    {
      icon: migrateIcon,
      title: "TMS Migration",
      description:
        "We facilitate a smooth transition from legacy TMS to modern solutions by ensuring data integrity and system compatibility to prevent disruptions, implementing risk management and strategic planning for seamless migrations, and maintaining business continuity to keep operations running efficiently.",
    },
    {
      icon: implementIcon,
      title: "TMS Implementation",
      description:
        "We provide full-scale TMS deployment tailored to your logistics strategy, ensuring custom configuration to align with business needs. Our end-to-end project management covers everything from planning to execution. With dedicated post-implementation support, we guarantee long-term success.",
    },
  ];

  return (
    <div className="bg-white md:py-16 py-12 ">
      <div className="max-w-7xl md:max-w-3xl lg:max-w-7xl mx-auto px-4 md:px-0 ">
        <div className="text-center mb-8">
          <AnimatedSection animation="fadeIn">
            <div className="inline-block px-3 py-1 text-xs text-[#016CEE] bg-[#E7FBFE] rounded-full mb-4">
              OUR SERVICES
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <h2 className="text-[27px] md:text-4xl md:font-semibold font-medium text-[#016CEE] md:mb-4 mb-0">
              Transportation Management System (TMS) Projects
            </h2>
            <h3 className="text-[27px] md:text-4xl md:font-semibold font-medium text-[#016CEE] mb-6">
              Optimizing Logistics and <br className="md:hidden block" /> Supply
              Chains.
            </h3>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <p className="md:text-xl  text-gray-700 max-w-3xl mx-auto">
              We help businesses enhance supply chain efficiency and logistics
              operations by delivering expertly managed TMS projects.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {tmsServices.map((service, index) => (
            <AnimatedSection
              key={index}
              animation="fadeInUp"
              delay={0.4 + index * 0.1}
            >
              <div className="bg-white rounded-xl h-auto w-full p-8 shadow-xl transition-transform hover:scale-105">
                <div className="bg-[#1B1464] rounded-full h-12 w-12 flex items-center justify-center mb-6">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    className="w-6 h-6"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#1B1464] mb-4">
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
