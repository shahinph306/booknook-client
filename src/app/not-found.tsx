"use client";

import Link from "next/link";
import { Home, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fff5e6] px-4 py-10 mx-auto container">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&auto=format&fit=crop&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
        }}
      />
      <div className="absolute inset-0 bg-[#fff5e6]/70 pointer-events-none" />

      <div className="relative max-w-xl w-full text-center">
        <BookOpen size={80} className="mx-auto text-[#b88a53] mb-6" />
        
        <h1 className="text-7xl sm:text-8xl font-bold text-[#59351d] mb-4">404</h1>
        <h2 className="text-2xl sm:text-3xl font-serif text-[#452713] mb-3">Page Not Found</h2>
        <p className="text-lg text-[#71513a] mb-8">
          Oops! The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-linear-to-r from-[#653a20] to-[#4b2915] text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home size={20} />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-2 border-[#a45b28] text-[#653a20] font-semibold hover:bg-[#fbf0e1] transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
