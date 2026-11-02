'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Book = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImage?: string;
  bookImageUrl?: string;
  shortDescription: string;
};

const AllBooksContent = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('http://localhost:8000/all-books', {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch books');

        const data = await res.json();
        console.log('📦 All Books API:', data);

        // ✅ মূল ফিক্স — সঠিকভাবে books অ্যারে বের করছি
        let booksList: Book[] = [];
        if (data?.success && Array.isArray(data.books)) {
          booksList = data.books;
        } else if (Array.isArray(data)) {
          booksList = data;
        } else {
          booksList = [];
          console.warn('⚠️ Unexpected data format:', data);
        }

        setBooks(booksList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Fetch error:', err);
      }
    };

    fetchBooks();
  }, []);

  // ইমেজ URL নির্ধারণ
  const getImageUrl = (book: Book): string => {
    const img = book.bookImage || book.bookImageUrl;
    return img?.startsWith('http')
      ? img
      : 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center text-red-600">
        Failed to load data — please check if the backend is running
      </div>
    );
  }

  // ✅ নিশ্চিত: books সর্বদা অ্যারে
  const safeBooks = Array.isArray(books) ? books : [];

  return (
    <div className="min-h-screen bg-[#f8f5ea] py-12 px-4 mx-auto container">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
            All Books
          </h1>
          <p className="text-gray-500 italic">
            Every book on the BookNook shelf.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {safeBooks.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              No books found
            </div>
          ) : (
            safeBooks.map((book) => (
              <div
                key={book._id}
                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-black/50
                  transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                  <Image
                    src={getImageUrl(book)}
                    alt={book.bookTitle || 'Book cover'}
                    fill
                    className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                </div>

                <div className="p-4 flex flex-col min-h-48">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full capitalize">
                      {book.category || 'General'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {book.bookTitle || 'Unknown Title'}
                  </h3>

                  <p className="text-gray-500 text-sm mb-3">
                    By {book.authorName || 'Unknown Author'}
                  </p>

                  <p className="text-gray-600 text-sm leading-5 mb-3 line-clamp-2">
                    {book.shortDescription || 'No description available.'}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <span className="text-xs text-gray-500">
                      Copies: {book.totalCopies}
                    </span>
                    <Link
                      href={`/all-books/${book._id}`}
                      className="px-4 py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white text-xs font-semibold rounded transition-colors whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const AllBooksPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#2f6b52] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        </div>
      }
    >
      <AllBooksContent />
    </Suspense>
  );
};

export default AllBooksPage;