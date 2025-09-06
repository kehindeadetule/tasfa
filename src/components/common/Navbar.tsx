"use client";
import Link from "next/link";
// import logo from "/assets/t-logo.png";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path: string) => {
    // For awards section, check if pathname starts with /awards to handle nested routes
    if (path === "/awards") {
      return pathname.startsWith("/awards");
    }
    // For about section, check if pathname starts with /about to handle nested routes
    if (path === "/about") {
      return pathname.startsWith("/about");
    }
    // For other paths, use exact matching
    return pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 py-4 px-4 md:px-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/t-logo.png"
                alt="Tasfa Logo"
                width={100}
                height={100}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center flex-grow mx-8">
            <div className="flex space-x-10">
              <div className="relative group">
                <div className="relative">
                  <button
                    className={`text-[#00244F] text-lg hover:text-[#016CEE] transition-colors ${
                      isActive("/about") ? "font-semibold text-[#005B96]" : ""
                    }`}
                    onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                  >
                    About Us
                  </button>
                  {isAboutDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/about"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsAboutDropdownOpen(false)}
                      >
                        About Us
                      </Link>
                      <Link
                        href="/about#mission"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsAboutDropdownOpen(false)}
                      >
                        Mission
                      </Link>
                      <Link
                        href="/about#vision"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsAboutDropdownOpen(false)}
                      >
                        Vision
                      </Link>
                      <Link
                        href="/about#objectives"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsAboutDropdownOpen(false)}
                      >
                        Objectives
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/awards"
                className={`text-[#00244F] text-lg hover:text-[#016CEE] transition-colors ${
                  isActive("/awards") ? "font-semibold text-[#005B96]" : ""
                }`}
              >
                Awards
              </Link>
              <Link
                href="/judges"
                className={`text-[#00244F] text-lg hover:text-[#016CEE] transition-colors ${
                  isActive("/judges") ? "font-semibold text-[#005B96]" : ""
                }`}
              >
                Judges
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/voting"
                    className="bg-[#005B96] text-white text-sm px-5 py-2 rounded-full font-medium hover:bg-[#004080] transition-colors"
                  >
                    Vote Now
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {user?.phoneNumber}
                    </span>
                    <button
                      onClick={logout}
                      className="text-sm text-red-600 hover:text-red-800 underline"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="bg-[#005B96] text-white text-sm px-5 py-2 rounded-full font-medium hover:bg-[#004080] transition-colors"
                >
                  Login / Sign Up
                </Link>
              )}
              <Link
                href="#contact"
                className="border-[2px] border-gray-300 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:border-none px-5 py-2 rounded-full font-medium transition-colors"
              >
                Contact Us
              </Link>
            </div>
            <button
              className="md:hidden text-[#00244F]"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-0 z-50 w-4/6 ml-auto bg-[#00245F] bg-opacity-100 flex flex-col transition-all duration-300 md:hidden">
            <button
              className="absolute top-8 right-6 text-white text-3xl"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <nav className="flex flex-col mt-32 space-y-10 px-8">
              <Link
                href="/about"
                className={`text-white text-lg font-medium hover:text-[#016CEE] ${
                  isActive("/about") ? "!text-[#005B96] font-semibold" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/awards"
                className={`text-white text-lg font-medium hover:text-[#016CEE] ${
                  isActive("/awards") ? "!text-[#005B96] font-semibold" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Awards
              </Link>
              <Link
                href="/judges"
                className={`text-white text-lg hover:text-[#016CEE] transition-colors ${
                  isActive("/judges") ? "font-semibold text-[#005B96]" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Judges
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/voting"
                    className={`text-white text-lg font-medium hover:text-[#016CEE] ${
                      isActive("/voting") ? "!text-[#005B96] font-semibold" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vote Now
                  </Link>
                  <div className="text-white text-sm">
                    <div className="text-gray-300">Logged in as:</div>
                    <div className="font-medium">{user?.phoneNumber}</div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-red-400 hover:text-red-300 underline mt-2"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-white text-lg font-medium hover:text-[#016CEE]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}

              <Link
                href="#contact"
                className={`text-white text-lg font-medium hover:text-[#016CEE] ${
                  isActive("#contact") ? "!text-[#005B96] font-semibold" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

// #ED1C24
// #C6007E
// #005B96
// #1B1464
// #FFD200
// #F37021
