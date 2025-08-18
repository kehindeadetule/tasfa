import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./global.css";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Partners from "@/components/home/Partners";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tasfa.com.ng"),
  title: {
    default: "Theatre Arts Students Festival and Awards",
    template: "%s | Theatre Arts Students Festival and Awards",
  },
  description: "Theatre Arts Students Festival and Awards",
  keywords: [
    "Theatre Arts Students Festival and Awards",
    "Music and Dance",
    "Theatre",
    "Art",
    "Festival",
    "Awards",
    "TASFA",
    "Vote",
  ],
  authors: [{ name: "Theatre Arts Students Festival and Awards" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Navbar />
        {children}
        <Partners />
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
