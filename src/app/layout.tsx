import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./global.css";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dga0m8ap1tk9g.cloudfront.net"),
  title: {
    default: "Theatre Art Students Festival and Awards",
    template: "%s | Theatre Art Students Festival and Awards",
  },
  description: "Theatre Art Students Festival and Awards",
  keywords: [
    "Theatre Art Students Festival and Awards",
    "Music and Dance",
    "Theatre",
    "Art",
    "Festival",
    "Awards",
    "TASFA",
    "Vote",
  ],
  authors: [{ name: "Theatre Art Students Festival and Awards" }],
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
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  verification: {
    google: "your-google-site-verification",
  },
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
