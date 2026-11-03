/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

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

const navLinks = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "All Books",
    href: "/all-books",
    icon: Library,
  },
  {
    title: "Add Book",
    href: "/add-book",
    icon: BookPlus,
  },
  {
    title: "My Books",
    href: "/my-books",
    icon: BookOpen,
  },
  {
    title: "My Borrows",
    href: "/my-borrows",
    icon: BookMarked,
  },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Close menus whenever route changes
  useEffect(() => {
    setPopoverOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      closePopover();
      closeMobileMenu();

      await authClient.signOut();

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="container mx-auto flex min-h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={() => {
            closeMobileMenu();
            closePopover();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white shadow-md">
            <BookOpen size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-green-700 sm:text-2xl">
              BookNook
            </h1>

            <p className="text-[10px] font-medium tracking-wider text-gray-500">
              YOUR DIGITAL LIBRARY
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closePopover}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-green-50 hover:text-green-700"
              >
                <Icon size={17} />
                {link.title}
              </Link>
            );
          })}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
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

                <ChevronDown size={16} className="text-green-700" />
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-64 overflow-hidden rounded-xl border border-green-100 bg-white p-2 shadow-xl"
              >
                <div className="mb-2 flex items-center gap-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3">
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

                {/* My Profile */}
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
            <>
              <Button
                nativeButton={false}
                render={<Link href="/login" />}
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
              >
                Login
              </Button>

              <Button
                nativeButton={false}
                render={<Link href="/register" />}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-green-50 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-green-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="container mx-auto flex flex-col gap-1">

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-700"
                >
                  <Icon size={19} />
                  {link.title}
                </Link>
              );
            })}

            <div className="my-2 border-t border-gray-100" />

            {isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ) : user ? (
              <>
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

                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-green-50"
                >
                  <User size={18} />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut size={18} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      href="/login"
                      onClick={closeMobileMenu}
                    />
                  }
                  variant="outline"
                  className="flex-1 border-green-600 text-green-700"
                >
                  Login
                </Button>

                <Button
                  nativeButton={false}
                  render={
                    <Link
                      href="/register"
                      onClick={closeMobileMenu}
                    />
                  }
                  className="flex-1 bg-green-600 text-white hover:bg-green-700"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
