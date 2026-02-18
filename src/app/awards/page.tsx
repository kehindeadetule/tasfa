import { Metadata } from "next";
import AwardsPage from "@/components/awards/AwardsPage";

export const metadata: Metadata = {
  title: "Awards - TASFA 2025",
  description:
    "Vote for the brightest stars and most innovative institutions in theatre arts.",
  openGraph: {
    title: "Awards - TASFA 2025",
    description:
      "Vote for the brightest stars and most innovative institutions in theatre arts.",
    url: "https://www.tasfa.com.ng/awards",
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
      "Vote for the brightest stars and most innovative institutions in theatre arts.",
    images: ["/hero-bg-m.png"],
  },
  alternates: {
    canonical: "https://www.tasfa.com.ng/awards",
  },
};

export default function Awards() {
  return <AwardsPage />;
}
