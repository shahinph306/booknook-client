
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  BookOpen,
  Menu,
  X,
  User,
  LogOut,
  BookPlus,
  Library,
  BookMarked,
  Home,
  ChevronDown,
} from "lucide-react";

// Public navigation links
const publicLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "All Books", href: "/all-books", icon: Library },
];

// Logged-in navigation links
const privateLinks = [
  { title: "Home", href: "/", icon: Home },
  { title: "All Books", href: "/all-books", icon: Library },
  { title: "Add Book", href: "/add-book", icon: BookPlus },
  { title: "My Books", href: "/my-books", icon: BookOpen },
  { title: "My Borrows", href: "/my-borrows", icon: BookMarked },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const isLoggedIn = !!user;

  // Choose navigation according to authentication state
  const currentLinks = isLoggedIn ? privateLinks : publicLinks;

  // Close menus after route changes
  useEffect(() => {
    setPopoverOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const closePopover = () => setPopoverOpen(false);

  // Logout handler
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      closePopover();
      closeMobileMenu();

      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed.");
      }

      toast.add({
        type: "success",
        title: "Logout Successful!",
        description: "You have been logged out successfully.",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      toast.add({
        type: "error",
        title: "Logout Failed!",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isLoggedIn
          ? "border-green-100 bg-white/95 shadow-sm"
          : "border-[#e9e2d5] bg-[#faf7ef]/95 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex min-h-19 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => {
              closeMobileMenu();
              closePopover();
            }}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${
                isLoggedIn
                  ? "bg-green-600 shadow-md"
                  : "bg-[#20543a]"
              }`}
            >
              <BookOpen size={25} />
            </div>

            {isLoggedIn ? (
              <div>
                <h1 className="text-xl font-bold tracking-tight text-green-700 sm:text-2xl">
                  BookNook
                </h1>
                <p className="text-[10px] font-medium tracking-wider text-gray-500">
                  YOUR DIGITAL LIBRARY
                </p>
              </div>
            ) : (
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#30251c]">
                BookNook
              </h1>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {currentLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closePopover}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isLoggedIn
                        ? "text-green-700"
                        : "text-[#20543a]"
                      : isLoggedIn
                        ? "text-gray-700 hover:bg-green-50 hover:text-green-700"
                        : "text-[#655b50] hover:bg-[#eee7da] hover:text-[#20543a]"
                  }`}
                >
                  {isLoggedIn && <Icon size={17} />}
                  {link.title}
                </Link>
              );
            })}
          </div>

          {/* Desktop Authentication */}
          <div className="hidden items-center gap-3 lg:flex">
            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
            ) : isLoggedIn ? (
              /* Logged In: User Profile */
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Open user menu"
                      className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 p-1.5 pr-3 transition-all hover:border-green-300 hover:bg-green-100"
                    />
                  }
                >
                  <Avatar className="h-9 w-9 border-2 border-green-500">
                    <AvatarImage
                      src={user.image || ""}
                      alt={user.name || "User"}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback className="bg-green-600 font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="max-w-24 truncate text-sm font-semibold text-gray-700">
                    {user.name || "User"}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`text-green-700 transition-transform ${
                      popoverOpen ? "rotate-180" : ""
                    }`}
                  />
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  className="w-64 overflow-hidden rounded-xl border border-green-100 bg-white p-2 shadow-xl"
                >
                  {/* User Information */}
                  <div className="mb-2 flex items-center gap-3 rounded-lg bg-linear-to-r from-green-50 to-emerald-50 p-3">
                    <Avatar className="h-11 w-11 border-2 border-green-500">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User"}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-green-600 text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-800">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile */}
                  <Link
                    href="/profile"
                    onClick={closePopover}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                  >
                    <User size={17} />
                    My Profile
                  </Link>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={17} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              /* Logged Out: Login and Register */
              <>
                <Button
                  nativeButton={false}
                  render={<Link href="/login" />}
                  variant="outline"
                  className="border-[#e2d7c5] bg-transparent text-[#30251c] hover:bg-[#eee7da]"
                >
                  Login
                </Button>

                <Button
                  nativeButton={false}
                  render={<Link href="/register" />}
                  className="bg-[#20543a] text-white hover:bg-[#163d29]"
                >
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`rounded-lg p-2 transition hover:bg-green-50 lg:hidden ${
              isLoggedIn ? "text-gray-700" : "text-[#30251c]"
            }`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`border-t shadow-lg lg:hidden ${
            isLoggedIn
              ? "border-green-100 bg-white"
              : "border-[#e9e2d5] bg-[#faf7ef]"
          }`}
        >
          <div className="container mx-auto px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">

              {/* Mobile Navigation Links */}
              {currentLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {isLoggedIn && <Icon size={19} />}
                    {link.title}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-gray-200" />

              {isPending ? (
                <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
              ) : isLoggedIn ? (
                <>
                  {/* Mobile User Information */}
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                    <Avatar className="h-11 w-11 border-2 border-green-500">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User"}
                        referrerPolicy="no-referrer"
                      />
                      <AvatarFallback className="bg-green-600 text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-800">
                        {user.name || "User"}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Profile */}
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 transition hover:bg-green-50"
                  >
                    <User size={18} />
                    My Profile
                  </Link>

                  {/* Mobile Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <LogOut size={18} />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                /* Mobile Login and Register */
                <div className="flex gap-3 pt-1">
                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/login" onClick={closeMobileMenu} />
                    }
                    variant="outline"
                    className="flex-1 border-[#20543a] text-[#20543a]"
                  >
                    Login
                  </Button>

                  <Button
                    nativeButton={false}
                    render={
                      <Link href="/register" onClick={closeMobileMenu} />
                    }
                    className="flex-1 bg-[#20543a] text-white hover:bg-[#163d29]"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
