
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  BookGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeleton/skeleton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Book {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImage?: string;
  bookImageUrl?: string;
  shortDescription: string;
}

export default function AllBooksContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      try {
        setError("");

        const response = await fetch(`${API_URL}/all-books`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books.");
        }

        const data = await response.json();

        const booksList = Array.isArray(data)
          ? data
          : Array.isArray(data?.books)
            ? data.books
            : [];

        setBooks(booksList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();

    return () => controller.abort();
  }, []);

  const getImageUrl = (book: Book) => {
    const image = book.bookImageUrl || book.bookImage;

    return image?.startsWith("http") ? image : null;
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f5ea] px-4 py-12">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <PageHeaderSkeleton />
          </div>

          <BookGridSkeleton count={6} />

          <div className="mt-10 flex flex-col items-center gap-4 py-6">
            <span className="loading loading-spinner loading-lg text-success h-12! w-12!" />
            <p className="animate-pulse font-semibold text-green-800">
              Discovering amazing books...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ea] px-4">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">
            Failed to Load Books
          </h2>

          <p className="mt-3 text-sm text-gray-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-green-800 px-6 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen bg-[#f8f5ea] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            Explore Our Collection
          </span>

          <h1 className="mt-3 font-serif text-3xl font-bold text-gray-900 md:text-4xl">
            All Books
          </h1>

          <p className="mt-3 text-gray-500">
            Every book on the BookNook shelf.
          </p>

          <p className="mt-2 text-sm text-green-800">
            {books.length} Books Available
          </p>
        </div>

        {books.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-xl font-semibold text-gray-800">
              No Books Found
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-black bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative flex h-60 items-center justify-center overflow-hidden bg-black-100 p-5">
                  {getImageUrl(book) ? (
                    <Image
                      src={getImageUrl(book)!}
                      alt={book.bookTitle || "Book cover"}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <span className="text-4xl">📚</span>
                      <p className="mt-2 text-sm">No Book Cover</p>
                    </div>
                  )}
                </div>

                <div className="flex min-h-56 flex-col p-5">
                  <div className="mb-3">
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium capitalize text-red-700">
                      {book.category || "General"}
                    </span>
                  </div>

                  <h2 className="line-clamp-1 text-lg font-bold text-gray-900">
                    {book.bookTitle || "Unknown Title"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    By {book.authorName || "Unknown Author"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {book.shortDescription || "No description available."}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <span className="text-xs text-gray-500">
                      Copies: {Number(book.totalCopies) || 0}
                    </span>

                    <Link
                      href={`/all-books/${book._id}`}
                      className="rounded-lg bg-[#2f6b52] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#275c46]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
