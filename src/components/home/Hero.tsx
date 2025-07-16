"use client";

import Image from "next/image";
import AnimatedSection from "../common/AnimatedSection";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bgImg1 from "@/assets/bg-img-1.jpg";
import bgImg2 from "@/assets/bg-img-2.jpg";
import bgImg3 from "@/assets/bg-img-3.jpg";

const events = [
  {
    title: "Opening Ceremony",
    description:
      "A grand launch to set the tone, featuring welcome addresses, karaoke, DJ rave, and formal introductions of participating schools and dignitaries.",
    image: bgImg3,
  },
  {
    title: "Carnival / Costume Parade",
    description:
      "A vibrant display of cultural pride through costumes, music, dance, and theatrical showcases.",
    image: bgImg2,
  },
  {
    title: "Stage Performances",
    description:
      "Competing schools present original or adapted plays or choreographed works, showcasing creativity and stagecraft while reflecting cultural and social themes.",
    image: bgImg3,
  },
  {
    title: "Old Skool Night",
    description:
      "A nostalgic evening honoring theatre legends with throwback music, performances, and vintage fashion.",
    image: bgImg1,
  },
  {
    title: "Workshops / Masterclasses",
    description:
      "Hands-on sessions with theatre experts on acting, directing, playwriting, stage design, and other areas of the art.",
    image: bgImg3,
  },
  {
    title: "Academic Paper Presentations",
    description:
      "A platform for students to share research on theatre, performance, and cultural studies.",
    image: bgImg1,
  },
  {
    title: "Meet, Greet & Connect",
    description:
      "Networking session to foster connections between students, professionals, and participants.",
    image: bgImg2,
  },
  {
    title: "Female Creatives Leadership Training",
    description:
      "The second and final session of the Female Creatives Leadership Training will focus on practical activities and teamwork. At the end of the session, grants will be awarded to 40 outstanding female students to support their creative projects.",
    image: bgImg3,
  },
  {
    title: "Award Night / Closing Gala",
    description:
      "The festival's climax, celebrating excellence in performance and scholarship with awards and festivities.",
    image: bgImg1,
  },
  {
    title: "Gyration! Gyration!! Gyration!!!",
    description:
      "A high-energy post-gala celebration with music and dance to close the night.",
    image: bgImg2,
  },
];

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-8 md:top-1/2 top-3/4 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all "
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-8  md:top-1/2 top-3/4 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}

export default function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="relative lg:min-h-screen overflow-hidden">
      <Slider {...settings} className="h-screen">
        {events.map((event, index) => (
          <div key={index} className="relative h-screen">
            <div className="absolute inset-0">
              <Image
                src={event.image}
                alt=""
                fill
                className="object-cover object-center"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="container relative z-10 mx-auto mt-6 md:mt-0 px-4 h-full flex flex-col items-stArts justify-center">
              <AnimatedSection animation="fadeInUp">
                {/* <h2 className="text-lg md:text-xl text-white/90 font-medium mb-6 [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">
                  {event.date}
                </h2> */}
                <h1 className="text-2xl lg:text-3xl md:leading-12 leading-8 font-bold tracking-wide text-white max-w-4xl mb-8 [text-shadow:_0_4px_8px_rgba(0,0,0,0.8)]">
                  {event.title}
                </h1>
                <p className="text-lg md:text-xl mb-12 text-white/90 max-w-5xl [text-shadow:_0_2px_4px_rgba(0,0,0,0.8)]">
                  {event.description}
                </p>
              </AnimatedSection>

              {/* <AnimatedSection animation="fadeInUp" delay={0.3}>
                <Link
                  href="/contact"
                  className="mt-12 bg-white text-[#005B96] px-12 py-3 text-lg rounded-full font-medium hover:bg-[#005B96] hover:text-white transition-colors [box-shadow:_0_8px_16px_rgba(0,0,0,0.4)]"
                >
                  Vote Now
                </Link>
              </AnimatedSection> */}
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
