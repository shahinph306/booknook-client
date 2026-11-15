/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import BorrowBookDialog from "@/components/BorrowBookDialog";
import BookNotFound from "@/components/BookNotFound";

type Book = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category?: string;
  shortDescription?: string;
  totalCopies: number;
  userName?: string;
  userEmail?: string;
  bookImageUrl?: string;
  bookImage?: string;
};


type BorrowRecord = {
  bookId: string;
  returned?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FALLBACK_IMAGE = "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg";

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bookId = params.id;

  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = useState(false);
  const [borrowStatusLoading, setBorrowStatusLoading] = useState(false);

  const getJwtToken = async (): Promise<string> => {
    const { data, error } = await authClient.token();
    if (error) throw new Error(error.message || "Unable to get JWT token.");
    if (!data?.token) throw new Error("JWT token was not returned.");
    return data.token;
  };

  const getImageUrl = () => {
    const image = book?.bookImageUrl || book?.bookImage;
    if (image?.startsWith("http") || image?.startsWith("data:")) return image;
    return FALLBACK_IMAGE;
  };

  useEffect(() => {
    if (!bookId || sessionLoading) return;

    let active = true;
    const fetchBook = async () => {
      setLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (user) {
          const jwtToken = await getJwtToken();
          headers.Authorization = `Bearer ${jwtToken}`;
        }

        const response = await fetch(`${API_URL}/all-book/${bookId}`, {
          method: "GET",
          headers,
          cache: "no-store",
        });

        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Failed to load book.");
        if (active) setBook(result.book);
      } catch (error) {
        // console.error("Book loading error:", error);

        if (active) {
          setBook(null);

          // ✅ Book Not Found এররে টোস্ট দেখাবে না
          const errMsg = error instanceof Error ? error.message : "";
          const isBookNotFound =
            errMsg.toLowerCase().includes("invalid book id") ||
            errMsg.toLowerCase().includes("book not found") ||
            errMsg.toLowerCase().includes("not found");

          if (!isBookNotFound) {
            toast.error(
              "Loading Failed",
              errMsg || "Could not load book."
            );
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchBook();
    return () => { active = false; };
  }, [bookId, sessionLoading, user?.email]);

  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!book?._id || !email || sessionLoading) {
      setIsAlreadyBorrowed(false);
      setBorrowStatusLoading(false);
      return;
    }

    let active = true;
    const checkBorrow = async () => {
      setBorrowStatusLoading(true);
      try {
        const jwtToken = await getJwtToken();
        const response = await fetch(`${API_URL}/api/my-borrows`, {
          method: "GET",
          headers: { Authorization: `Bearer ${jwtToken}` },
          cache: "no-store",
        });

        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Could not check borrow status.");

        const borrows: BorrowRecord[] = Array.isArray(result.borrows) ? result.borrows : [];
        const already = borrows.some(
          (item) => String(item.bookId) === String(book._id) && item.returned !== true
        );
        if (active) setIsAlreadyBorrowed(already);
      } catch (error) {
        console.error("Borrow status error:", error);
        if (active) setIsAlreadyBorrowed(false);
      } finally {
        if (active) setBorrowStatusLoading(false);
      }
    };

    checkBorrow();
    return () => { active = false; };
  }, [book?._id, user?.email, sessionLoading]);

  const handleOpenBorrowDialog = () => {
    if (sessionLoading) return;
    if (!user) {
      toast.error("Login Required", "Please log in to borrow a book.");
      return;
    }
    if (!user.name?.trim() || !user.email?.trim()) {
      toast.error("User Information Missing", "Please update your profile name and email.");
      return;
    }
    if (borrowStatusLoading) {
      toast.error("Please Wait", "Checking your previous borrow records.");
      return;
    }
    if (isAlreadyBorrowed) {
      toast.error("Already Borrowed", "You have already borrowed this book.");
      return;
    }
    if (!book || book.totalCopies <= 0) {
      toast.error("Not Available", "This book has no available copies.");
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmBorrow = async () => {
    if (borrowLoading) return;
    if (!book?._id || !user) {
      toast.error("Login Required", "Please log in to borrow a book.");
      return;
    }

    const normalizedName = user.name?.trim();
    const normalizedEmail = user.email?.trim().toLowerCase();
    if (!normalizedName || !normalizedEmail) {
      toast.error("User Information Missing", "Please update your profile name and email.");
      return;
    }
    if (book.totalCopies <= 0) {
      toast.error("Not Available", "This book has no available copies.");
      return;
    }
    if (isAlreadyBorrowed) {
      toast.error("Already Borrowed", "You have already borrowed this book.");
      return;
    }

    setBorrowLoading(true);
    try {
      const jwtToken = await getJwtToken();
      if (!jwtToken) throw new Error("Authentication token is missing. Please log in again.");

      const borrowedAt = new Date().toISOString();
      const returnBy = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const borrowData = { bookId: book._id, borrowedAt, returnBy };
      const response = await fetch(`${API_URL}/borrow-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(borrowData),
        cache: "no-store",
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Book borrow failed.");

      setBook((prev) => prev ? { ...prev, totalCopies: prev.totalCopies - 1 } : null);
      setIsAlreadyBorrowed(true);
      setOpenDialog(false);

      toast.success("Book Borrowed Successfully!", `${book.bookTitle} has been added to My Borrows.`);
      router.push("/my-borrows");
    } catch (error) {
      console.error("Borrow request failed:", error);
      toast.error(
        "Borrow Failed",
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBorrowLoading(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f5ea]">
        <span className="loading loading-spinner loading-lg text-[#2f6b52]" />
        <p className="animate-pulse text-base font-semibold text-gray-700">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return <BookNotFound />;
  }

  const noCopiesLeft = book.totalCopies <= 0;

  return (
    <div className="min-h-screen bg-[#f8f5ea] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="relative h-80 w-full overflow-hidden rounded-xl bg-white shadow-lg md:h-105">
              <Image
                src={getImageUrl()}
                alt={book.bookTitle}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-col justify-center md:col-span-2">
            <span className="mb-4 inline-block w-fit rounded-full bg-red-50 px-3 py-1 text-xs capitalize text-red-600">
              {book.category || "General"}
            </span>

            <h1 className="mb-3 font-serif text-3xl text-gray-900 md:text-4xl">
              {book.bookTitle}
            </h1>

            <p className="mb-5 text-gray-500">
              By <span className="font-medium text-gray-800">{book.authorName}</span>
            </p>

            <p className="mb-8 leading-relaxed text-gray-600">
              {book.shortDescription || "No description available."}
            </p>

            <div className="mb-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="mb-2 text-xs uppercase text-gray-400">Added By</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {book.userName || "Unknown User"}
                  </p>
                  <p className="mt-1 break-all text-xs text-gray-400">
                    {book.userEmail || ""}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase text-gray-400">Copies Left</p>
                  <p className={`text-2xl font-bold ${noCopiesLeft ? "text-red-500" : "text-[#2f6b52]"}`}>
                    {book.totalCopies}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">Available Copies</p>
                </div>
              </div>
            </div>

            <div className="mb-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-1 text-lg font-semibold text-gray-800">Borrower Information</h3>
              <p className="mb-4 text-sm text-gray-500">
                Your logged-in account information will be used for borrowing.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="borrowerName" className="mb-2 block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    id="borrowerName"
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="borrowerEmail" className="mb-2 block text-sm font-medium text-gray-700">
                    Your Email
                  </label>
                  <input
                    id="borrowerEmail"
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-400">
                These details are taken from your logged-in account.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleOpenBorrowDialog}
                disabled={!user || noCopiesLeft || borrowLoading || borrowStatusLoading || isAlreadyBorrowed}
                className={`rounded-lg px-7 py-6 ${
                  !user || noCopiesLeft || isAlreadyBorrowed
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : "bg-[#2f6b52] text-white hover:bg-[#275c46]"
                }`}
              >
                {!user
                  ? "Login Required"
                  : noCopiesLeft
                    ? "Not Available"
                    : isAlreadyBorrowed
                      ? "Already Borrowed"
                      : borrowStatusLoading
                        ? "Checking Borrow..."
                        : "Borrow This Book"}
              </Button>

              <Link href="/all-books" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
                ← Back to All Books
              </Link>
            </div>
          </div>
        </div>
      </div>

      <BorrowBookDialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!borrowLoading) setOpenDialog(open);
        }}
        bookTitle={book.bookTitle}
        authorName={book.authorName}
        bookImageUrl={getImageUrl()}
        totalCopies={book.totalCopies}
        borrowerName={user?.name || ""}
        borrowerEmail={user?.email || ""}
        borrowLoading={borrowLoading}
        sessionLoading={false}
        onConfirm={handleConfirmBorrow}
      />
    </div>
  );
}
