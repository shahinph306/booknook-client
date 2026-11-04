/* eslint-disable react-hooks/purity */

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import BorrowBookDialog from "@/components/BorrowBookDialog";

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

type BorrowData = {
  bookId: string;
  bookTitle: string;
  authorName: string;
  bookImageUrl: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  returnBy: string;
};

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const API_URL = "http://localhost:8000";

const FALLBACK_IMAGE =
  "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg";

export default function BookDetailsPage({
  params,
}: BookDetailsPageProps) {
  const router = useRouter();

  // Better Auth session
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const borrowerName = session?.user?.name || "";
  const borrowerEmail =
    session?.user?.email?.trim().toLowerCase() || "";

  // States
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] =
    useState(false);
  const [borrowStatusLoading, setBorrowStatusLoading] =
    useState(false);

  // Get book image
  const getImageUrl = () => {
    const image = book?.bookImageUrl || book?.bookImage;

    if (
      image?.startsWith("http") ||
      image?.startsWith("data:")
    ) {
      return image;
    }

    return FALLBACK_IMAGE;
  };

  // Load book details
  useEffect(() => {
    let active = true;

    const fetchBook = async () => {
      try {
        const resolvedParams = await params;
        const bookId = resolvedParams.id;

        const response = await fetch(
          `${API_URL}/all-book/${bookId}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load book."
          );
        }

        if (active) {
          setBook(result.book);
        }
      } catch (error) {
        console.error("Book loading error:", error);

        if (active) {
          toast.add({
            type: "error",
            title: "Loading Failed",
            description:
              error instanceof Error
                ? error.message
                : "Could not load book.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      active = false;
    };
  }, [params]);

  // Check existing borrow
  useEffect(() => {
    if (!book?._id || !borrowerEmail) {
      setIsAlreadyBorrowed(false);
      return;
    }

    let active = true;

    const checkBorrow = async () => {
      setBorrowStatusLoading(true);

      try {
        const response = await fetch(
          `${API_URL}/api/my-borrows`,
          {
            headers: {
              "X-User-Email": borrowerEmail,
            },
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not check borrow status."
          );
        }

        const already = result.borrows.some(
          (item: {
            bookId: string;
            returned?: boolean;
          }) =>
            item.bookId === book._id &&
            item.returned !== true
        );

        if (active) {
          setIsAlreadyBorrowed(already);
        }
      } catch (error) {
        console.error("Borrow status error:", error);
      } finally {
        if (active) {
          setBorrowStatusLoading(false);
        }
      }
    };

    checkBorrow();

    return () => {
      active = false;
    };
  }, [book?._id, borrowerEmail]);

  // Confirm borrow
  const handleConfirmBorrow = async () => {
    if (borrowLoading) return;

    // Login validation
    if (!session?.user || !borrowerEmail) {
      toast.add({
        type: "error",
        title: "Login Required",
        description:
          "Please login before borrowing a book.",
      });

      setOpenDialog(false);
      router.push("/auth/sign-in");
      return;
    }

    if (!borrowerName) {
      toast.add({
        type: "error",
        title: "User Information Missing",
        description:
          "Your account name could not be found.",
      });
      return;
    }

    if (!book?._id) return;

    if (book.totalCopies <= 0) {
      toast.add({
        type: "error",
        title: "Not Available",
        description:
          "This book has no available copies.",
      });
      return;
    }

    if (isAlreadyBorrowed) {
      toast.add({
        type: "error",
        title: "Already Borrowed",
        description:
          "You have already borrowed this book.",
      });
      return;
    }

    setBorrowLoading(true);

    const borrowedAt = new Date().toISOString();

    const returnBy = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const borrowData: BorrowData = {
      bookId: book._id,
      bookTitle: book.bookTitle,
      authorName: book.authorName,
      bookImageUrl: getImageUrl(),
      borrowerName,
      borrowerEmail,
      borrowedAt,
      returnBy,
    };

    try {
      const response = await fetch(
        `${API_URL}/borrow-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(borrowData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Book borrow failed."
        );
      }

      // Update book copies
      setBook((previous) =>
        previous
          ? {
            ...previous,
            totalCopies: previous.totalCopies - 1,
          }
          : null
      );

      setIsAlreadyBorrowed(true);

      setOpenDialog(false);

      toast.add({
        type: "success",
        title: "Book Borrowed Successfully!",
        description: `${book.bookTitle} has been added to My Borrows.`,
      });

      router.push("/my-borrows");
      router.refresh();
    } catch (error) {
      console.error("Borrow request failed:", error);

      toast.add({
        type: "error",
        title: "Borrow Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      });
    } finally {
      setBorrowLoading(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="loading loading-spinner loading-lg text-success" />

        <p className="text-base font-semibold animate-pulse">
          Loading book details...
        </p>
      </div>
    );
  }
  
  // Book not found
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f5ea] gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Book Not Found
        </h2>
        <Link
          href="/all-books"
          className="text-[#2f6b52] underline"
        >
          Back to All Books
        </Link>
      </div>
    );
  }

  const noCopiesLeft = book.totalCopies <= 0;

  const formattedReturnDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8f5ea] py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Book Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Book Image */}
          <div className="md:col-span-1">
            <div className="relative w-full h-80 md:h-[420px] rounded-xl overflow-hidden shadow-lg bg-white">
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

          {/* Book Information */}
          <div className="md:col-span-2 flex flex-col justify-center">

            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full mb-4 capitalize w-fit">
              {book.category || "General"}
            </span>

            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
              {book.bookTitle}
            </h1>

            <p className="text-gray-500 mb-5">
              By{" "}
              <span className="font-medium text-gray-800">
                {book.authorName}
              </span>
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {book.shortDescription ||
                "No description available."}
            </p>

            {/* Book Information Card */}
            <div className="border border-gray-200 rounded-xl p-5 mb-7 bg-white shadow-sm">
              <div className="grid grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">
                    Added By
                  </p>

                  <p className="text-sm font-semibold text-gray-800">
                    {book.userName || "Unknown User"}
                  </p>

                  <p className="text-xs text-gray-400 mt-1 break-all">
                    {book.userEmail || ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase mb-2">
                    Copies Left
                  </p>

                  <p
                    className={`text-2xl font-bold ${noCopiesLeft
                        ? "text-red-500"
                        : "text-[#2f6b52]"
                      }`}
                  >
                    {book.totalCopies}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Available Copies
                  </p>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap items-center">

              <Button
                onClick={() => {
                  if (!session?.user) {
                    toast.add({
                      type: "error",
                      title: "Login Required",
                      description:
                        "Please login before borrowing a book.",
                    });

                    router.push("/auth/sign-in");
                    return;
                  }

                  setOpenDialog(true);
                }}
                disabled={
                  sessionLoading ||
                  isAlreadyBorrowed ||
                  noCopiesLeft ||
                  borrowLoading ||
                  borrowStatusLoading
                }
                className={`px-7 py-6 rounded-lg ${isAlreadyBorrowed || noCopiesLeft
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#2f6b52] hover:bg-[#275c46] text-white"
                  }`}
              >
                {sessionLoading
                  ? "Checking User..."
                  : noCopiesLeft
                    ? "Not Available"
                    : isAlreadyBorrowed
                      ? "Already Borrowed"
                      : borrowStatusLoading
                        ? "Checking Borrow..."
                        : "Borrow This Book"}
              </Button>

              <Link
                href="/all-books"
                className="text-gray-600 text-sm font-medium hover:text-gray-900 transition"
              >
                ← Back to All Books
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* Interactive Borrow Dialog */}

      {/* Interactive Borrow Dialog */}

      <BorrowBookDialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!borrowLoading) {
            setOpenDialog(open);
          }
        }}
        bookTitle={book.bookTitle}
        authorName={book.authorName}
        bookImageUrl={getImageUrl()}
        totalCopies={book.totalCopies}
        borrowerName={borrowerName}
        borrowerEmail={borrowerEmail}
        borrowLoading={borrowLoading}
        sessionLoading={sessionLoading}
        onConfirm={handleConfirmBorrow}
      />

    </div>
  );
}
