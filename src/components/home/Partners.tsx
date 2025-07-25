"use client";
import nantap from "@/assets/client-logo/nantap.png";
import pawstudios from "@/assets/client-logo/pawstudio.jpeg";
import sonata from "@/assets/client-logo/sonata.png";
import Image from "next/image";

const partners = [
  { logo: nantap, alt: "Nantap" },
  { logo: pawstudios, alt: "Paw Studios", className: "bg-[#005B96]" },
  { logo: sonata, alt: "Sonata" },
  { logo: pawstudios, alt: "Paw Studios" },
  { logo: nantap, alt: "Nantap" },
  { logo: pawstudios, alt: "Paw Studios" },
  { logo: sonata, alt: "Sonata" },
  { logo: nantap, alt: "Nantap" },
  { logo: pawstudios, alt: "Paw Studios" },
  { logo: sonata, alt: "Sonata" },
  { logo: pawstudios, alt: "Paw Studios" },
  { logo: nantap, alt: "Nantap" },
];

export default function AboutPartners() {
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
          <div className="inline-block bg-[#E7FBFE] text-[#005B96] px-6 py-2 text-sm rounded-full mb-6 font-medium shadow-sm">
            OUR PARTNERS
          </div>
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-6 bg-clip-text bg-gradient-to-r from-white via-[#7FB3D5] to-[#AED6F1] drop-shadow-lg">
            Trusted by Industry Leaders
          </h2>
          <p className="text-white/90 text-lg md:text-xl leading-relaxed">
            Our partners are at the forefront of innovation and excellence,
            bringing their expertise and resources to make TASFA 2025 a
            remarkable success.
          </p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* First row - moving left */}
          <div className="flex animate-scroll-left">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`left-${index}`}
                className="rounded-lg flex items-center justify-center h-20 md:min-w-[180px] min-w-[160px] mx-4"
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

          {/* Second row - moving right */}
          <div className="flex animate-scroll-right mt-8 mb-8">
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`right-${index}`}
                className=" rounded-lg flex items-center justify-center h-20 md:min-w-[180px] min-w-[160px]  mx-4"
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
            ))}
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
        @media (min-width: 768px) {
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          @keyframes scroll-right {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-scroll-left {
            animation: scroll-left 55s linear infinite;
          }

          .animate-scroll-right {
            animation: scroll-right 55s linear infinite;
          }
        }

        @media (max-width: 767px) {
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-300%);
            }
          }

          @keyframes scroll-right {
            0% {
              transform: translateX(-300%);
            }
            100% {
              transform: translateX(0);
            }
          }

          .animate-scroll-left {
            animation: scroll-left 20s linear infinite;
          }

          .animate-scroll-right {
            animation: scroll-right 20s linear infinite;
          }
        }

        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
