
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define Book type
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
};

// Define Params type
type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const BookDetailsPage = ({ params }: BookDetailsPageProps) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const resolvedParams = await params;
        const bookId = resolvedParams.id;

        const res = await fetch(`http://localhost:8000/all-book/${bookId}`, {
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch book');
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params]);

  // Image URL with fallback
  const getImageUrl = (): string => {
    if (!book) return '';
    if (book.bookImageUrl && book.bookImageUrl.startsWith('http')) {
      return book.bookImageUrl;
    }
    const title = encodeURIComponent(book.bookTitle || 'book');
    return `https://covers.openlibrary.org/b/title/${title}-L.jpg`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center mx-auto container">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#2f6b52] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center text-gray-600">
        Book not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ea] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover Image */}
          <div className="md:col-span-1">
            <div className="relative w-full h-125 rounded overflow-hidden shadow-lg">
              <Image
                src={getImageUrl()}
                alt={book.bookTitle || 'Book cover'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-gray-100 border border-red-300 text-red-600 text-xs rounded mb-4 capitalize w-fit">
              {book.category || 'General'}
            </span>

            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
              {book.bookTitle || 'Unknown Title'}
            </h1>

            <p className="text-gray-500 mb-4">by {book.authorName || 'Unknown Author'}</p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {book.shortDescription || 'No description available.'}
            </p>

            {/* Info Card */}
            <div className="border border-black-200 rounded p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Added by</p>
                  <p className="text-sm text-gray-700">{book.userName || 'Unknown'}</p>
                  <p className="text-xs text-gray-400">{book.userEmail || ''}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Copies left</p>
                  <p className="text-lg font-semibold text-gray-900">{book.totalCopies || 0}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap items-center">
              <button className="px-6 py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white text-sm font-medium rounded transition-colors">
                Borrow This Book
              </button>
              
              {/* ← Back to all books — Colorful underline on hover */}
              <Link
                href="/all-books"
                className="relative px-1 py-1 text-gray-600 text-sm font-medium 
                           after:absolute after:bottom-0 after:left-0 after:h-0.5 
                           after:w-0 hover:after:w-full 
                           after:bg-linear-to-r after:from-emerald-500 after:via-teal-500 after:to-green-500 
                           after:transition-all after:duration-300 after:ease-out
                           hover:text-gray-900 transition-colors"
              >
                ← Back to all books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;