import Contact from "@/components/contact/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TASFA - Contact",
  description: "Theatre Art Students Festival and Awards",
  openGraph: {
    title: "TASFA - Contact",
    description: "Theatre Art Students Festival and Awards",
    url: "https://dga0m8ap1tk9g.cloudfront.net/contact",
    siteName: "TASFA",
    images: [
      {
        url: "/hero-bg-m.png",
        width: 1200,
        height: 630,
        alt: "TASFA - Contact",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TASFA - Contact",
    description: "Theatre Art Students Festival and Awards",
    images: ["/hero-bg-m.png"],
  },
  alternates: {
    canonical: "https://dga0m8ap1tk9g.cloudfront.net/contact",
  },
};

export default function ContactRoute() {
  return <Contact />;
}
