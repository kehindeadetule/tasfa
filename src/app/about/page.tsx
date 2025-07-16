import { Metadata } from "next";
import About from "../../components/about/About";

export const metadata: Metadata = {
  title: "TASFA - About",
  description: "Theatre Arts Students Festival and Awards",
  openGraph: {
    title: "TASFA - About",
    description: "Theatre Arts Students Festival and Awards",
    url: "https://dga0m8ap1tk9g.cloudfront.net/about",
    siteName: "TASFA",
    images: [
      {
        url: "/hero-bg-m.png",
        width: 1200,
        height: 630,
        alt: "TASFA - About",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TASFA - About",
    description: "Theatre Arts Students Festival and Awards",
    images: ["/hero-bg-m.png"],
  },
  alternates: {
    canonical: "https://dga0m8ap1tk9g.cloudfront.net/about",
  },
};

export default function AboutRoute() {
  return <About />;
}
