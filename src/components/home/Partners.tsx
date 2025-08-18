"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

const partners = [
  { logo: "/assets/client-logo/nantap.png", alt: "Nantap" },
  {
    logo: "/assets/client-logo/pawstudio.jpeg",
    alt: "Paw Studios",
    className: "bg-[#005B96]",
  },
  { logo: "/assets/client-logo/sonata.png", alt: "Sonata" },
  { logo: "/assets/client-logo/nantap.png", alt: "Nantap" },
  { logo: "/assets/client-logo/pawstudio.jpeg", alt: "Paw Studios" },
  { logo: "/assets/client-logo/sonata.png", alt: "Sonata" },
  { logo: "/assets/client-logo/nantap.png", alt: "Nantap" },
  { logo: "/assets/client-logo/pawstudio.jpeg", alt: "Paw Studios" },
  { logo: "/assets/client-logo/sonata.png", alt: "Sonata" },
  { logo: "/assets/client-logo/pawstudio.jpeg", alt: "Paw Studios" },
  { logo: "/assets/client-logo/nantap.png", alt: "Nantap" },
  { logo: "/assets/client-logo/pawstudio.jpeg", alt: "Paw Studios" },
  { logo: "/assets/client-logo/sonata.png", alt: "Sonata" },
];

const schoolLogos = [
  { logo: "/assets/school-logo/aaua.jpg", alt: "AAUA" },
  { logo: "/assets/school-logo/bouesti.jpg", alt: "Bouesti" },
  { logo: "/assets/school-logo/fuoye.jpg", alt: "Fuoye" },
  { logo: "/assets/school-logo/ui.jpg", alt: "UI" },
  { logo: "/assets/school-logo/eksu.png", alt: "Eksu" },
  { logo: "/assets/school-logo/eaued.jpg", alt: "EAUED" },
  { logo: "/assets/school-logo/fceabk.jpg", alt: "FCEABK" },
  { logo: "/assets/school-logo/leadcity.png", alt: "Lead City" },
  { logo: "/assets/school-logo/oau.jpg", alt: "OAU" },
  { logo: "/assets/school-logo/oou.jpg", alt: "OOU" },
  { logo: "/assets/school-logo/redeemers.jpg", alt: "Redeemers" },
  { logo: "/assets/school-logo/bowen.png", alt: "Bowen" },
  { logo: "/assets/school-logo/unn.jpg", alt: "unn" },
  { logo: "/assets/school-logo/unioyo.jpg", alt: "Uinoyo" },
];

export default function AboutPartners() {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leftScroll = leftScrollRef.current;
    const rightScroll = rightScrollRef.current;

    if (!leftScroll || !rightScroll) return;

    let leftInterval: NodeJS.Timeout;
    let rightInterval: NodeJS.Timeout;

    // Left scroll (partners)
    const startLeftScroll = () => {
      leftInterval = setInterval(() => {
        if (leftScroll.scrollLeft >= leftScroll.scrollWidth / 2) {
          leftScroll.scrollLeft = 0;
        } else {
          leftScroll.scrollLeft += 2;
        }
      }, 27); // Much faster scroll
    };

    // Right scroll (school logos)
    const startRightScroll = () => {
      rightInterval = setInterval(() => {
        if (rightScroll.scrollLeft <= 0) {
          rightScroll.scrollLeft = rightScroll.scrollWidth / 2;
        } else {
          rightScroll.scrollLeft -= 2;
        }
      }, 27); // Much faster scroll
    };

    startLeftScroll();
    startRightScroll();

    // Pause on hover
    const handleMouseEnter = () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
    };

    const handleMouseLeave = () => {
      startLeftScroll();
      startRightScroll();
    };

    leftScroll.addEventListener("mouseenter", handleMouseEnter);
    leftScroll.addEventListener("mouseleave", handleMouseLeave);
    rightScroll.addEventListener("mouseenter", handleMouseEnter);
    rightScroll.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearInterval(leftInterval);
      clearInterval(rightInterval);
      leftScroll.removeEventListener("mouseenter", handleMouseEnter);
      leftScroll.removeEventListener("mouseleave", handleMouseLeave);
      rightScroll.removeEventListener("mouseenter", handleMouseEnter);
      rightScroll.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-20 md:py-16  relative overflow-hidden">
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

      <div className="containe relative z-10 mx-auto px-">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block bg-[#E7FBFE] font-semibold text-[#1B1464] px-6 py-2 text-sm rounded-full mb-6 shadow-sm">
            OUR PARTNERS
          </div>
          <h2 className="text-xl md:text-4xl font-bold text-white md:mb-6 mb-0 bg-clip-text bg-gradient-to-r from-white via-[#7FB3D5] to-[#AED6F1] drop-shadow-lg">
            Trusted by Industry Leaders
          </h2>
          <p className="text-white/90 text-sm md:text-xl leading-relaxed p-3 md:p-0">
            Our partners are at the forefront of innovation and excellence,
            bringing their expertise and resources to make TASFA 2025 a
            remarkable success.
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* First row - moving left */}
          <div
            ref={leftScrollRef}
            className="flex overflow-x-hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={`left-${index}`}
                className="rounded-lg flex items-center justify-center h-20 md:min-w-[180px] min-w-[160px] mx-4 flex-shrink-0"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={partner.logo}
                    alt={partner.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 160px) 100vw, 160px"
                    priority={index < 7} // Prioritize first set of logos
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Decorative divider with gradient and dots */}
          <div className="flex items-center justify-center mt-5 py-4">
            <div className="flex items-center space-x-4 w-full max-w-2xl">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <h3 className="text-white font-medium">
              Participanting Institutions
            </h3>
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-4 w-full max-w-2xl">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
          </div>

          {/* Second row - moving right */}
          <div
            ref={rightScrollRef}
            className="flex overflow-x-hidden mt-5 mb-8"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[...schoolLogos, ...schoolLogos, ...schoolLogos].map(
              (partner, index) => (
                <div
                  key={`right-${index}`}
                  className=" rounded-lg flex items-center justify-center h-20 md:min-w-[180px] min-w-[160px]  mx-4 flex-shrink-0"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={partner.logo}
                      alt={partner.alt}
                      fill
                      className="object-contain "
                      sizes="(max-width: 160px) 100vw, 160px"
                      priority={index < 7} // Prioritize first set of logos
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-0 top-1/4 w-96 h-96 bg-[#7FB3D5]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-[#AED6F1]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute left-1/4 bottom-0 w-72 h-72 bg-[#005B96]/20 rounded-full blur-[80px] animate-pulse delay-500"></div>
        <div className="absolute right-1/4 top-0 w-72 h-72 bg-[#0077C0]/20 rounded-full blur-[80px] animate-pulse delay-1500"></div>
      </div>

      <style jsx global>{`
        /* Hide scrollbars */
        .overflow-x-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
