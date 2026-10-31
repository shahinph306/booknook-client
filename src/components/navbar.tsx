// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { BookOpen, Menu, Moon, Sun, X } from "lucide-react"
// import { cn } from "cn"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// type NavItem = {
//   label: string
//   href: string
// }

// const baseLinks: NavItem[] = [
//   { label: "Home", href: "/" },
//   { label: "All Books", href: "#" },
// ]

// const memberLinks: NavItem[] = [
//   { label: "Add Book", href: "#" },
//   { label: "My Books", href: "#" },
//   { label: "My Borrows", href: "#" },
// ]

// type NavbarProps = {
//   isLoggedIn?: boolean
// }

// export default function Navbar({ isLoggedIn = false }: NavbarProps) {
//   const [dark, setDark] = React.useState(false)
//   const [mobileOpen, setMobileOpen] = React.useState(false)

//   const links = isLoggedIn ? [...baseLinks, ...memberLinks] : baseLinks

//   function toggleTheme() {
//     const next = !dark
//     setDark(next)
//     document.documentElement.classList.toggle("dark", next)
//   }

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-black/[0.07] bg-[#fbfaf7]/95 backdrop-blur-md dark:border-white/10 dark:bg-[#121814]/95">
//       <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-4 px-4 sm:px-6 md:gap-10 lg:px-12">
//         <Link href="/" className="flex shrink-0 items-center gap-2 sm:gap-2.5">
//           <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#2f6b52] text-white shadow-sm sm:size-9">
//             <BookOpen className="size-5" strokeWidth={2.2} />
//           </span>
//           <span className="text-xl font-semibold tracking-tight text-[#1d2822] dark:text-white sm:text-2xl">
//             BookNook
//           </span>
//         </Link>

//         <nav className="hidden items-center gap-8 md:flex">
//           {links.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               className={cn(
//                 "text-sm font-medium text-[#4b554f] transition-colors hover:text-[#1d2822] dark:text-white/70 dark:hover:text-white",
//                 link.href === "/" && "text-[#1d2822] dark:text-white"
//               )}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
//           <button
//             type="button"
//             onClick={toggleTheme}
//             aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
//             className="inline-flex size-8 items-center justify-center rounded-full text-[#4b554f] transition-colors hover:bg-black/[0.06] hover:text-[#1d2822] sm:size-9 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
//           >
//             {dark ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
//           </button>

//           {isLoggedIn ? (
//             <Link href="#" aria-label="Your profile" className="ml-1">
//               <Avatar
//                 size="lg"
//                 className="size-8 ring-2 ring-[#e7e5dd] ring-offset-2 ring-offset-[#fbfaf7] sm:size-9 dark:ring-white/15 dark:ring-offset-[#121814]"
//               >
//                 <AvatarImage src="/images/avatar-tiger.jpg" alt="Your profile" />
//                 <AvatarFallback>BN</AvatarFallback>
//               </Avatar>
//             </Link>
//           ) : (
//             <div className="hidden items-center gap-2 sm:flex">
//               <Link
//                 href="#"
//                 className="inline-flex h-9 items-center justify-center rounded-md border border-[#d6d9d4] bg-white px-4 text-sm font-medium text-[#2a352e] transition-colors hover:bg-[#f3f4f1] dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/10"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="#"
//                 className="inline-flex h-9 items-center justify-center rounded-md bg-[#2f6b52] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#275c46]"
//               >
//                 Register
//               </Link>
//             </div>
//           )}

//           <button
//             type="button"
//             onClick={() => setMobileOpen((open) => !open)}
//             aria-expanded={mobileOpen}
//             aria-label={mobileOpen ? "Close menu" : "Open menu"}
//             className="inline-flex size-8 items-center justify-center rounded-full text-[#4b554f] transition-colors hover:bg-black/[0.06] hover:text-[#1d2822] sm:size-9 md:hidden dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
//           >
//             {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
//           </button>
//         </div>
//       </div>

//       {mobileOpen && (
//         <div className="border-t border-black/[0.07] bg-[#fbfaf7] md:hidden dark:border-white/10 dark:bg-[#121814]">
//           <nav className="mx-auto flex w-full max-w-[1400px] flex-col gap-1 px-4 py-3">
//             {links.map((link) => (
//               <Link
//                 key={link.label}
//                 href={link.href}
//                 onClick={() => setMobileOpen(false)}
//                 className="rounded-md px-3 py-2 text-sm font-medium text-[#4b554f] transition-colors hover:bg-black/[0.05] hover:text-[#1d2822] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>
//           {!isLoggedIn && (
//             <div className="mx-auto flex w-full max-w-[1400px] gap-2 px-4 pb-4 sm:hidden">
//               <Link
//                 href="#"
//                 className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-[#d6d9d4] bg-white text-sm font-medium text-[#2a352e] dark:border-white/15 dark:bg-transparent dark:text-white"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="#"
//                 className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-[#2f6b52] text-sm font-medium text-white dark:bg-[#2f6b52]"
//               >
//                 Register
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </header>
//   )
// }






'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NavbarPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#fbfaf7]/95 backdrop-blur-md dark:bg-[#121814]/95 border-b border-black/[0.07] dark:border-white/10">
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
            { label: "All Books", href: "/books" },
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
                { label: "All Books", href: "/books" },
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