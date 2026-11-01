
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NavbarPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fbfaf7]/95 backdrop-blur-md dark:bg-[#121814]/95 border-b border-black/[0.07] dark:border-white/10 font-semibold mx-auto container">
      <div className="max-w-350 mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-[10px] bg-[#2f6b52] flex items-center justify-center">
            <Image
              src="/images/bookIcon.png"
              alt="BookNook Logo"
              width={20}
              height={20}
            />
          </div>
          <span className="text-xl font-semibold text-[#1d2822] dark:text-white">BookNook</span>
        </Link>

        {/* Desktop/Tablet Links — পাশাপাশি দেখাবে */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Home", href: "/" },
            { label: "All Books", href: "/all-books" },
            { label: "Add Book", href: "/add-book" },
            { label: "My Books", href: "/my-books" },
            { label: "My Borrows", href: "/my-borrows" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-2 rounded-md text-sm text-[#4b554f] dark:text-white/70
                hover:bg-[#2f6b52]/10 hover:text-[#2f6b52]
                dark:hover:bg-white/10 dark:hover:text-white
                transition-colors duration-200 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons + Mobile Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md border border-[#d6d9d4] bg-white text-sm text-[#2a352e]
                hover:bg-[#f3f4f1] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/10
                transition-colors duration-200 whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-md bg-[#2f6b52] text-white text-sm
                hover:bg-[#275c46] transition-colors duration-200 whitespace-nowrap"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-[#4b554f] dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-4 right-4 top-16 z-50">
          <div className="bg-[#fbfaf7] dark:bg-[#121814] border border-black/[0.07] dark:border-white/10 rounded-lg shadow-lg p-3">
            <nav className="flex flex-col gap-1 mb-2">
              {[
                { label: "Home", href: "/" },
                { label: "All Books", href: "/all-books" },
                { label: "Add Book", href: "/add-book" },
                { label: "My Books", href: "/my-books" },
                { label: "My Borrows", href: "/my-borrows" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-md text-[#4b554f] dark:text-white/70
                    hover:bg-[#2f6b52]/10 hover:text-[#2f6b52]
                    dark:hover:bg-white/10 dark:hover:text-white
                    transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-md border border-[#d6d9d4] bg-white text-center text-[#2a352e]
                  dark:border-white/15 dark:bg-transparent dark:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-md bg-[#2f6b52] text-white text-center
                  hover:bg-[#275c46]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavbarPage;