"use client";

import Link from "next/link";
import logo from "@/assets/t-logo.png";
import poweredBy from "@/assets/i560.jpg";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contact" className="bg-white text-[#1B1464] pt-16 pb-8">
      <div
        className="h-1 mb-8 bg-gradient-to-r from-[#ED1C24] via-[#C6007E] via-[#005B96] via-[#1B1464] via-[#FFD200] to-[#F37021]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ED1C24, #C6007E, #005B96, #1B1464, #FFD200, #F37021)",
          borderStyle: "dashed",
          borderWidth: "2px 0",
          borderImage:
            "linear-gradient(to right, #ED1C24, #C6007E, #005B96, #1B1464, #FFD200, #F37021) 1",
        }}
      />
      <div className="container mx-auto px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-10 lg:gap-28 md:gap-16 gap-8">
          {/* Company Info */}
          <div className="md:col-span-4">
            <Image src={logo} alt="TASFA Logo" className="h-14  w-auto mb-4" />
            <p className="text-[#1B1464] text-sm mb-4">
              Theatre Arts Students Festival and Awards
            </p>
            <a
              href="mailto:hello.tasfa@gmail.com"
              className="text-sm hover:text-[#005B96]"
            >
              hello.tasfa@gmail.com
            </a>
          </div>

          {/* Company */}
          <div className="col-span-2">
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-[#005B96]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/awards" className="text-sm hover:text-[#005B96]">
                  Awards
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-2">
            <h3 className="font-medium mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/t.a.s.f.a?igsh=MWd3eHYzZ2JtZnAzbA%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-[#005B96]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-[#005B96]"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Sponsors */}
          <div className="col-span-2">
            <h3 className="font-medium mb-4">Powered by</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.instagram.com/1560_productions/profilecard/?igsh=MW9yYjBnMWxwYTd4ag=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                  <Image
                    src={poweredBy}
                    alt="powered by Logo"
                    className="h-28 w-auto mb-4"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-xs text-[#1B1464] ">
          <p>
            © {new Date().getFullYear()} Theatre Arts Students Festival and
            Awards. All rights reserved.
          </p>
          <p>
            designed by{" "}
            <a
              href="https://www.areshtechub.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" font-semibold hover:text-[#005B96]"
            >
              Arestechub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
