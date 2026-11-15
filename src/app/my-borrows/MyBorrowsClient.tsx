
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
  BookOpen,
  CalendarDays,
  Clock,
  RotateCcw,
  Library,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  authorName: string;
  bookImageUrl?: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  returnBy: string;
  returned: boolean;
  createdAt: string;
};

type BorrowResponse = {
  success: boolean;
  total: number;
  borrows: Borrow[];
  message?: string;
};

// =====================================
// GET BETTER AUTH JWT TOKEN
// =====================================

async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    console.error("JWT Token Error:", error);

    throw new Error(
      error?.message || "Unable to generate JWT token. Please sign in again."
    );
  }

  // Log only whether a token was generated.
  // Do not expose the actual bearer token in console logs.
  console.log("JWT Token Generated:", Boolean(data.token));

  return data.token;
}

// =====================================
// FORMAT DATE
// =====================================

function formatDate(date: string) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// =====================================
// BORROW CARD SKELETON
// =====================================

function BorrowCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e9e4d7] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="mx-auto h-56 w-40 shrink-0 rounded-xl bg-gray-200 sm:mx-0 sm:h-48 sm:w-36" />

        <div className="flex flex-1 flex-col gap-4 py-2">
          <div className="h-5 w-24 rounded-full bg-gray-200" />
          <div className="h-7 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="h-16 rounded-xl bg-gray-200" />
            <div className="h-16 rounded-xl bg-gray-200" />
          </div>

          <div className="mt-auto h-11 w-36 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// =====================================
// MAIN COMPONENT
// =====================================

export default function MyBorrowsClient() {
  // =====================================
  // AUTHENTICATION
  // =====================================

  const {
    data: session,
    isPending: sessionPending,
  } = authClient.useSession();

  const user = session?.user;

  const userEmail = user?.email?.trim().toLowerCase() || "";

  // =====================================
  // STATES
  // =====================================

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"active" | "returned">(
    "active"
  );

  const [error, setError] = useState("");

  // =====================================
  // FETCH MY BORROWS
  // =====================================

  const fetchBorrows = useCallback(async () => {
    if (!userEmail) {
      setBorrows([]);
      setIsLoading(false);
      return;
    }

    try {
      setError("");

      // Generate JWT token
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/api/my-borrows`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data: BorrowResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load borrowed books."
        );
      }

      setBorrows(
        Array.isArray(data.borrows) ? data.borrows : []
      );
    } catch (err) {
      console.error("Fetch Borrows Error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading borrowed books.";

      setError(message);

      toast.error("Loading Failed", message);
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  // =====================================
  // LOAD DATA AFTER AUTHENTICATION
  // =====================================

  useEffect(() => {
    if (sessionPending) return;

    if (!userEmail) {
      setBorrows([]);
      setIsLoading(false);
      setError("Please sign in to view your borrowed books.");
      return;
    }

    setIsLoading(true);
    fetchBorrows();
  }, [sessionPending, userEmail, fetchBorrows]);

  // =====================================
  // RETURN BOOK
  // =====================================

  const handleReturnBook = async (borrow: Borrow) => {
    if (!userEmail || returningId !== null || borrow.returned) {
      return;
    }

    try {
      setReturningId(borrow._id);

      // Generate JWT token
      const token = await getAuthToken();

      const response = await fetch(`${API_URL}/return-book`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: borrow.bookId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not return this book."
        );
      }

      // Update UI immediately after successful response
      setBorrows((previous) =>
        previous.map((item) =>
          item._id === borrow._id
            ? {
                ...item,
                returned: true,
              }
            : item
        )
      );

      toast.success(
        "Book Returned Successfully!",
        `${borrow.bookTitle} has been returned.`
      );
    } catch (err) {
      console.error("Return Book Error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to return the book.";

      toast.error("Return Failed", message);
    } finally {
      setReturningId(null);
    }
  };

  // =====================================
  // FILTER BOOKS
  // =====================================

  const activeBorrows = borrows.filter(
    (borrow) => borrow.returned !== true
  );

  const returnedBorrows = borrows.filter(
    (borrow) => borrow.returned === true
  );

  const visibleBorrows =
    activeTab === "active" ? activeBorrows : returnedBorrows;

  // =====================================
  // LOADING STATE
  // =====================================

  if (sessionPending || isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f5ea] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 animate-pulse">
            <div className="mb-3 h-4 w-40 rounded bg-gray-200" />
            <div className="h-9 w-64 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
          </div>

          <div className="flex flex-col gap-5">
            {[1, 2, 3, 4].map((item) => (
              <BorrowCardSkeleton key={item} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =====================================
  // ERROR STATE
  // =====================================

  if (error && !borrows.length) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f8f5ea] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-11 w-11 text-red-500" />

          <h2 className="text-xl font-bold text-gray-900">
            Unable to Load Borrowed Books
          </h2>

          <p className="mt-3 text-sm text-gray-600">
            {error}
          </p>

          {userEmail && (
            <button
              onClick={() => {
                setIsLoading(true);
                fetchBorrows();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2f6b52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#275c46]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
        </div>
      </main>
    );
  }

  // =====================================
  // MAIN PAGE
  // =====================================

  return (
    <main className="min-h-screen bg-[#f8f5ea] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* PAGE HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#2f6b52]">
              Your Reading Journey
            </p>

            <h1 className="font-serif text-3xl font-bold text-[#25251f] sm:text-4xl">
              My Borrows
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Keep track of the books you have borrowed from BookNook.
            </p>
          </div>

          {/* ACTIVE BORROW COUNTER */}

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <div className="rounded-xl bg-[#e8f2e9] p-3 text-[#2f6b52]">
              <Library size={22} />
            </div>

            <div>
              <p className="text-2xl font-bold text-[#2f6b52]">
                {activeBorrows.length}
              </p>

              <p className="text-xs text-gray-500">
                Active Borrows
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}

        <div className="mb-7 flex flex-wrap items-center gap-3 border-b-4 border-green-500 pb-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "active"
                ? "bg-[#2f6b52] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-[#e8f2e9] hover:text-[#2f6b52]"
            }`}
          >
            Active Borrows ({activeBorrows.length})
          </button>

          <button
            onClick={() => setActiveTab("returned")}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              activeTab === "returned"
                ? "bg-[#2f6b52] text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-[#e8f2e9] hover:text-[#2f6b52]"
            }`}
          >
            Returned ({returnedBorrows.length})
          </button>
        </div>

        {/* BORROW CARDS */}

        {visibleBorrows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9d2c1] bg-white/70 px-5 py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f2e9] text-[#2f6b52]">
              <BookOpen size={30} />
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#25251f]">
              {activeTab === "active"
                ? "No Active Borrows"
                : "No Returned Books Yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {activeTab === "active"
                ? "You have no currently borrowed books. Explore our library and find your next favorite read."
                : "Books you return will appear here."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {visibleBorrows.map((borrow) => (
              <article
                key={borrow._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row">

                  {/* BOOK IMAGE */}

                  <div className="mx-auto h-56 w-40 shrink-0 overflow-hidden rounded-xl bg-[#f0eee5] sm:mx-0 sm:h-48 sm:w-36">
                    {borrow.bookImageUrl ? (
                      <img
                        src={borrow.bookImageUrl}
                        alt={borrow.bookTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#2f6b52]">
                        <BookOpen size={42} />
                      </div>
                    )}
                  </div>

                  {/* BOOK INFORMATION */}

                  <div className="flex min-w-0 flex-1 flex-col">

                    {/* STATUS */}

                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          borrow.returned
                            ? "bg-gray-100 text-gray-600"
                            : "bg-[#e8f2e9] text-[#2f6b52]"
                        }`}
                      >
                        {borrow.returned
                          ? "Returned"
                          : "Active Borrow"}
                      </span>

                      <span className="text-xs text-gray-400">
                        ID: {borrow._id.slice(-6)}
                      </span>
                    </div>

                    {/* TITLE */}

                    <h2 className="line-clamp-2 font-serif text-xl font-bold leading-snug text-[#25251f] transition-colors group-hover:text-[#2f6b52] sm:text-2xl">
                      {borrow.bookTitle}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      Written by{" "}
                      <span className="font-medium text-gray-700">
                        {borrow.authorName}
                      </span>
                    </p>

                    {/* BORROW DATES */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#f8f5ea] p-3">
                        <p className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDays
                            size={15}
                            className="text-[#2f6b52]"
                          />
                          Borrowed Date
                        </p>

                        <p className="text-sm font-semibold text-[#25251f]">
                          {formatDate(borrow.borrowedAt)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#f8f5ea] p-3">
                        <p className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                          <Clock
                            size={15}
                            className="text-[#2f6b52]"
                          />
                          Return Deadline
                        </p>

                        <p className="text-sm font-semibold text-[#25251f]">
                          {formatDate(borrow.returnBy)}
                        </p>
                      </div>
                    </div>

                    {/* RETURN BUTTON */}

                    {!borrow.returned ? (
                      <div className="mt-5 sm:mt-auto sm:pt-5">
                        <button
                          onClick={() => handleReturnBook(borrow)}
                          disabled={returningId !== null}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6b52] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#275c46] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
                        >
                          <RotateCcw
                            size={16}
                            className={
                              returningId === borrow._id
                                ? "animate-spin"
                                : ""
                            }
                          />

                          {returningId === borrow._id
                            ? "Returning..."
                            : "Return Book"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-5 flex items-center gap-2 text-sm font-medium text-gray-500 sm:mt-auto sm:pt-5">
                        <BookOpen size={16} />
                        This book has been returned.
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* FOOTER */}

        {borrows.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              Showing {visibleBorrows.length}{" "}
              {activeTab === "active" ? "active" : "returned"}{" "}
              book(s).
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
