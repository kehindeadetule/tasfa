import HomePage from "@/components/home/HomePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TASFA - Home",
  description: "Theatre Arts Students Festival and Awards",
  openGraph: {
    title: "TASFA - Home",
    description: "Theatre Arts Students Festival and Awards",
    url: "https://dga0m8ap1tk9g.cloudfront.net",
    siteName: "TASFA",
    images: [
      {
        url: "/hero-bg-m.png",
        width: 1200,
        height: 630,
        alt: "TASFA - Home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TASFA - Home",
    description: "Theatre Arts Students Festival and Awards",
    images: ["/hero-bg-m.png"],
  },
  alternates: {
    canonical: "https://dga0m8ap1tk9g.cloudfront.net",
  },
};

export default function Home() {
  return (
    <section>
      <HomePage />
    </section>
  );
}
