/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */

"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

type BorrowedBook = {
  _id: string;
  bookId: string;
  bookTitle: string;
  authorName: string;
  bookImageUrl?: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  returnBy: string;
  returned?: boolean;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const FALLBACK_IMAGE =
  "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const borrowerEmail = session?.user?.email?.trim().toLowerCase() || "";

  // =====================================
  // REDIRECT IF NOT LOGGED IN
  // =====================================
  useEffect(() => {
    if (isPending) return;
    if (!borrowerEmail) {
      router.replace("/login");
    }
  }, [isPending, borrowerEmail, router]);

  // =====================================
  // FETCH MY BORROWS
  // =====================================
  const fetchBorrows = useCallback(async () => {
    if (!borrowerEmail) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/my-borrows`, {
        method: "GET",
        headers: {
          "X-User-Email": borrowerEmail,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load borrowed books.");
      }

      const activeBorrows: BorrowedBook[] = (
        result.borrows || []
      ).filter((item: BorrowedBook) => item.returned !== true);

      setBorrows(activeBorrows);
    } catch (error) {
      console.error("Fetch Borrows Error:", error);

      toast.add({
        type: "error",
        title: "Loading Failed",
        description:
          error instanceof Error
            ? error.message
            : "Could not load borrowed books.",
      });
    } finally {
      setLoading(false);
    }
  }, [borrowerEmail]);

  // =====================================
  // LOAD USER BORROWS
  // =====================================
  useEffect(() => {
    if (isPending || !borrowerEmail) return;
    fetchBorrows();
  }, [isPending, borrowerEmail, fetchBorrows]);

  // =====================================
  // RETURN BOOK
  // =====================================
  const handleReturn = async (item: BorrowedBook) => {
    if (returningId || !borrowerEmail) return;

    setReturningId(item._id);

    try {
      const response = await fetch(`${API_URL}/return-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: item.bookId,
          borrowerEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to return this book.");
      }

      setBorrows((previous) =>
        previous.filter((book) => book._id !== item._id)
      );

      toast.add({
        type: "success",
        title: "Book Returned Successfully!",
        description: `${item.bookTitle} has been returned.`,
      });
    } catch (error) {
      console.error("Return Book Error:", error);

      toast.add({
        type: "error",
        title: "Return Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setReturningId(null);
    }
  };

  // =====================================
  // IMAGE FALLBACK
  // =====================================
  const getImageUrl = (item: BorrowedBook) => {
    const url = item.bookImageUrl;
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return url;
    }
    return FALLBACK_IMAGE;
  };

  // =====================================
  // SHOW NOTHING IF NO USER
  // =====================================
  if (!isPending && !borrowerEmail) {
    return null;
  }

  // =====================================
  // AUTH LOADING
  // =====================================
  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-amber-50 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-10 w-56 bg-gray-200 rounded-lg animate-pulse mx-auto" />
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-5 shadow-sm flex gap-5 animate-pulse"
            >
              <div className="w-24 h-32 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-4 py-2">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-9 bg-gray-200 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // =====================================
  // MAIN PAGE
  // =====================================
  return (
    <main className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* PAGE HEADER */}
        <div className="text-center mb-10">
          <span className="text-4xl">📚</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3">
            My Borrows
          </h1>
          <p className="text-gray-500 mt-3">
            Manage your borrowed books and return them on time.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {borrowerEmail}
          </p>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-100 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Currently Borrowed
            </p>
            <h2 className="text-3xl font-bold text-[#2f6b52]">
              {borrows.length}
            </h2>
          </div>
          <button
            onClick={fetchBorrows}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-[#2f6b52] text-white hover:bg-[#275c46] disabled:opacity-50 transition"
          >
            ↻ Refresh
          </button>
        </div>

        {/* EMPTY STATE */}
        {borrows.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 px-5">
            <div className="text-6xl mb-5">📖</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No Borrowed Books
            </h2>
            <p className="text-gray-500 mb-7">
              You haven&apos;t borrowed any books yet. Explore our collection!
            </p>
            <Link
              href="/all-books"
              className="inline-block bg-[#2f6b52] text-white px-7 py-3 rounded-lg hover:bg-[#275c46] transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          /* BORROWED BOOK LIST */
          <div className="space-y-5">
            {borrows.map((item) => {
              const borrowedDate = new Date(item.borrowedAt);
              const returnDate = new Date(item.returnBy);

              const isOverdue =
                !Number.isNaN(returnDate.getTime()) &&
                returnDate.getTime() < Date.now();

              const isReturning = returningId === item._id;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row gap-5 hover:shadow-md transition"
                >
                  {/* BOOK IMAGE */}
                  <div className="relative w-28 h-40 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(item)}
                      alt={item.bookTitle}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                      unoptimized
                    />
                  </div>

                  {/* BOOK INFORMATION */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.bookTitle}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      By {item.authorName}
                    </p>
                    <div className="mt-5 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Borrowed:</span>{" "}
                        {Number.isNaN(borrowedDate.getTime())
                          ? "N/A"
                          : borrowedDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Return By:</span>{" "}
                        {Number.isNaN(returnDate.getTime())
                          ? "N/A"
                          : returnDate.toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                          isOverdue
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isOverdue ? "Overdue" : "Active Borrow"}
                      </span>
                    </div>
                  </div>

                  {/* RETURN BUTTON */}
                  <div className="flex items-center sm:justify-center">
                    <button
                      onClick={() => handleReturn(item)}
                      disabled={returningId !== null}
                      className={`w-full sm:w-auto px-5 py-3 rounded-lg text-sm font-semibold transition ${
                        isReturning
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                      }`}
                    >
                      {isReturning ? "Returning..." : "↩ Return Book"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
