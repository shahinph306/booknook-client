/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Book = {
  _id?: string;
  bookTitle?: string;
  authorName?: string;
  category?: string;
  shortDescription?: string;
  totalCopies?: number;
  userName?: string;
  userEmail?: string;
  bookImageUrl?: string;
  bookImage?: string;
};

type BooksResponse = {
  success: boolean;
  books: Book[];
  message?: string;
};

const CategoryBooks = () => {
  const params = useParams<{ category: string }>();
  const category = params.category?.toLowerCase();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ ছবির URL ঠিক করার ফাংশন — প্রতিটি বইয়ের জন্য আলাদাভাবে
  const getImageUrl = (book: Book): string => {
    const url = book.bookImageUrl || (book as any).bookImage || '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    const fallbackBase = 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
    return `${fallbackBase}?t=${encodeURIComponent(book.bookTitle || 'book')}-${book._id || Date.now()}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          'http://localhost:8000/all-books',
          { cache: 'no-store' }
        );

        if (!res.ok) {
          throw new Error('Failed to fetch books');
        }

        const data: BooksResponse | Book[] = await res.json();
        console.log('📦 Books Data:', data);

        const bookList: Book[] = Array.isArray(data)
          ? data
          : data.books && Array.isArray(data.books)
            ? data.books
            : [];

        const filteredBooks = bookList.filter(
          (book) => book.category?.toLowerCase() === category
        );

        setBooks(filteredBooks);

      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong'
        );
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchBooks();
    }
  }, [category]);

  const categoryTitle =
    category.charAt(0).toUpperCase() + category.slice(1);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2f6b52] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8f5ea] py-12 px-4">
      <div className="max-w-7xl mx-auto container">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
            {categoryTitle} Books
          </h1>
          <p className="text-gray-500 italic">
            Explore our {category} book collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {books.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              No books found in this category.
            </div>
          ) : (
            books.map((book) => (
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

        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-green-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryBooks;
