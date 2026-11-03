/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound, Mail, CalendarDays } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const UserProfilePage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed.");
      }

      toast.add({
        title: "Logout Successful!",
        description: "You have been logged out successfully.",
        type: "success",
      });

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      toast.add({
        title: "Logout Failed!",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  // Loading state
  if (isPending || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#faf7f0]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#d8c8ad] border-t-[#4b3525] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#806f5e]">Loading profile...</p>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently joined";

  const userName = user.name || "BookNook User";
  const userEmail = user.email || "No email available";

  return (
    <main className="min-h-[70vh] bg-[#faf7f0] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-[#fffdfa] border border-[#e3d7c5] rounded-xl shadow-md px-6 py-8 sm:px-10 text-center">

          {/* Profile Image */}
          <div className="flex justify-center mb-5">
            <div className="w-28 h-28 rounded-full p-1 bg-[#e1dfd4]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={userName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#eee6d9] flex items-center justify-center">
                  <UserRound size={48} className="text-[#70563e]" />
                </div>
              )}
            </div>
          </div>

          {/* User Name */}
          <h1 className="text-3xl font-bold text-[#302015] font-serif mb-1">
            {userName}
          </h1>

          {/* Email */}
          <p className="text-[#806f5e] flex items-center justify-center gap-2">
            <Mail size={16} />
            <span>{userEmail}</span>
          </p>

          {/* Member Since */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#806f5e]">
            <CalendarDays size={17} />
            <span>Member since {memberSince}</span>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e8dfd2] my-7" />

          {/* Account Information */}
          <div className="text-left space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#806f5e]">Account Status</span>
              <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#806f5e]">Account Type</span>
              <span className="text-sm font-medium text-[#302015]">
                BookNook Member
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-[#4b3525] hover:bg-[#352416] text-white font-medium py-3 px-5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingOut ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut size={18} />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
