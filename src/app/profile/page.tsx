"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  UserRound,
  Mail,
  CalendarDays,
  ShieldCheck,
  Crown,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const UserProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const result = await authClient.signOut();
      if (result.error) throw new Error(result.error.message || "Logout failed.");
      toast.add({ title: "Logout Successful!", description: "You have been logged out successfully.", type: "success" });
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.add({
        title: "Logout Failed!",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#fff5e6]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e5c9a5] border-t-[#59351d] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[#806047] font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const userName = user.name || "BookNook User";
  const userEmail = user.email || "No email available";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Recently joined";

  return (
    <main className="relative min-h-screen overflow-hidden px-3 py-5 sm:px-4 sm:py-6 mx-auto max-w-5xl">
      {/* ✅ ব্যাকগ্রাউন্ড — সঠিকভাবে ফিট করবে, overflow হবে না */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-[#fff5e6]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#fff5e6]/60 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
          <div className="flex items-center gap-2 text-[#492a16]">
            <BookOpen size={42} strokeWidth={2} />
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">BookNook</h2>
          </div>
          <div className="text-right">
            <p className="text-base sm:text-lg font-serif italic text-[#654126]">Read • Borrow • Explore</p>
            <div className="h-0.5 w-3/4 ml-auto mt-1 rounded-full bg-[#c58b4d] rotate-[-3deg]" />
          </div>
        </header>

        {/* মূল কার্ড */}
        <section className="bg-white/75 rounded-[32px] overflow-hidden border border-white/90 shadow-lg backdrop-blur-[8px]">
          
          {/* উপরের ব্যানার — উচ্চতা কমানো হয়েছে */}
          <div className="relative px-1 pt-1">
            <div
              className="relative h-[160px] sm:h-[200px] rounded-t-[28px] rounded-b-[24px] overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&auto=format&fit=crop&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="text-xs tracking-widest font-semibold">WELCOME TO</p>
                <p className="font-serif text-xl sm:text-2xl font-bold">BookNook Library</p>
              </div>
            </div>
          </div>

          {/* প্রোফাইল ছবি — আকার কমানো হয়েছে */}
          <div className="relative flex justify-center -mt-[85px] sm:-mt-[100px] z-10">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-[5px] bg-white shadow-md">
              <div className="w-full h-full rounded-full border-4 border-[#d8a568] bg-[#f8ead6] flex items-center justify-center overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <UserRound size={72} strokeWidth={1.8} className="text-[#59351d]" />
                )}
              </div>
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-11 h-11 rounded-full bg-green-600 border-4 border-white flex items-center justify-center shadow-md">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </div>
          </div>

          {/* বিস্তারিত */}
          <div className="px-4 sm:px-8 md:px-10 pt-3 pb-8">
            <h1 className="text-center text-2xl sm:text-4xl font-bold font-serif text-[#452713] break-words">
              {userName}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-2 mt-3 text-[#71513a]">
              <Mail size={20} />
              <span className="text-base sm:text-lg break-all">{userEmail}</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-[#71513a]">
              <CalendarDays size={21} />
              <span className="text-base sm:text-lg">Member since {memberSince}</span>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="h-0.5 bg-[#ecd7b8] flex-1" />
              <BookOpen size={32} strokeWidth={1.8} className="text-[#a87943]" />
              <div className="h-0.5 bg-[#ecd7b8] flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[20px] bg-[#fbf0e1]/85 border border-[#f1dfc8] hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-sm">
                  <ShieldCheck size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-base sm:text-lg text-[#514033]">Account Status</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-700 mt-0.5">Active</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 sm:p-5 rounded-[20px] bg-[#fbf0e1]/85 border border-[#f1dfc8] hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-[#87552e] to-[#492a16] flex items-center justify-center shadow-sm">
                  <Crown size={28} className="text-[#fff1d9]" />
                </div>
                <div className="min-w-0">
                  <p className="text-base sm:text-lg text-[#514033]">Account Type</p>
                  <p className="text-lg sm:text-xl font-bold text-[#452713] mt-0.5">BookNook Member</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="group relative mt-7 w-full min-h-[64px] flex items-center justify-center gap-3 rounded-full border-2 border-[#a45b28] bg-gradient-to-r from-[#653a20] via-[#754322] to-[#4b2915] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loggingOut ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span className="text-lg sm:text-xl font-semibold">Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={28} />
                  <span className="text-xl sm:text-2xl font-semibold">Logout</span>
                  <span className="absolute right-4 sm:right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <ArrowRight size={20} />
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 mt-6 text-[#896441]">
              <div className="hidden sm:block h-0.5 flex-1 max-w-32 bg-[#e8d1b1]" />
              <ShieldCheck size={20} className="shrink-0 text-[#a87943]" />
              <p className="text-sm text-center">Your account is safe and secure with BookNook</p>
              <div className="hidden sm:block h-0.5 flex-1 max-w-32 bg-[#e8d1b1]" />
            </div>
          </div>
        </section>

        <footer className="relative flex justify-center items-center mt-6 pb-3">
          <BookOpen size={72} strokeWidth={1} className="text-[#b88a53]" />
        </footer>
      </div>
    </main>
  );
};

export default UserProfilePage;
