/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from '@/components/ui/toast';

type BorrowedBook = {
  _id: string;
  bookId: string;
  bookTitle: string;
  authorName: string;
  bookImageUrl: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  returnBy: string;
  returned?: boolean;
};

const API_URL = 'http://localhost:8000';

// Keep this consistent with the Book Details page.
// Replace with the real Better Auth session user when integrating auth.
const getLoggedInUser = () => ({
  name: 'Shahin Mahmud',
  email: 'shahinph306@gmail.com',
});

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  const user = getLoggedInUser();
  const borrowerEmail = user.email.trim().toLowerCase();

  // Load borrow records from MongoDB
  const fetchBorrows = async () => {
    try {
      console.log('📤 Loading My Borrows for:', borrowerEmail);

      const response = await fetch(`${API_URL}/api/my-borrows`, {
        method: 'GET',
        headers: {
          'X-User-Email': borrowerEmail,
        },
        cache: 'no-store',
      });

      const result = await response.json();

      console.log('📥 My Borrows API response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Could not load borrowed books.');
      }

      const activeBorrows = (result.borrows || []).filter(
        (item: BorrowedBook) => item.returned !== true
      );

      setBorrows(activeBorrows);

      console.log('✅ Active borrow records:', activeBorrows);
    } catch (error) {
      console.error('❌ My Borrows loading error:', error);

      toast.add({
        type: 'error',
        title: 'Loading Failed',
        description:
          error instanceof Error ? error.message : 'Could not load borrows.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return book
  const handleReturn = async (item: BorrowedBook) => {
    if (returningId) return;

    setReturningId(item._id);

    console.log('📤 Sending return request:', {
      bookId: item.bookId,
      borrowerEmail,
    });

    try {
      const response = await fetch(`${API_URL}/return-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: item.bookId,
          borrowerEmail,
        }),
      });

      const result = await response.json();

      console.log('📥 Return API response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to return this book.');
      }

      // Remove from current page only after backend success
      setBorrows((previous) =>
        previous.filter((book) => book._id !== item._id)
      );

      toast.add({
        type: 'success',
        title: 'Book Returned',
        description: `${item.bookTitle} has been returned successfully.`,
      });

      console.log('✅ Book returned:', item.bookTitle);
    } catch (error) {
      console.error('❌ Return error:', error);

      toast.add({
        type: 'error',
        title: 'Return Failed',
        description:
          error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setReturningId(null);
    }
  };

  const getImageUrl = (book: BorrowedBook) => {
    if (book.bookImageUrl?.startsWith('http')) {
      return book.bookImageUrl;
    }

    return 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your borrows...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-gray-900 mb-6 text-center">
          My Borrows
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Borrower: {borrowerEmail}
        </p>

        <div className="flex justify-end mb-5">
          <button
            onClick={() => {
              setLoading(true);
              fetchBorrows();
            }}
            className="px-4 py-2 rounded bg-[#2f6b52] text-white hover:bg-[#275c46]"
          >
            Refresh
          </button>
        </div>

        {borrows.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            You haven&apos;t borrowed any books yet.{' '}
            <Link
              href="/all-books"
              className="text-[#2f6b52] underline font-medium"
            >
              Browse Books
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {borrows.map((item) => {
              const borrowedDate = new Date(
                item.borrowedAt
              ).toLocaleDateString();

              const returnDate = new Date(
                item.returnBy
              ).toLocaleDateString();

              const isOverdue = new Date(item.returnBy) < new Date();
              const isReturning = returningId === item._id;

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-sm p-4 border flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-24 h-36 shrink-0 bg-gray-50 rounded overflow-hidden relative">
                    <Image
                      src={getImageUrl(item)}
                      alt={item.bookTitle}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.bookTitle}
                    </h3>

                    <p className="text-gray-500 text-sm mb-2">
                      By {item.authorName}
                    </p>

                    <p className="text-xs text-gray-500">
                      Borrowed: {borrowedDate}
                    </p>

                    <p
                      className={`text-xs mt-1 ${
                        isOverdue
                          ? 'text-red-600 font-medium'
                          : 'text-green-600'
                      }`}
                    >
                      Return by: {returnDate}
                      {isOverdue && ' (Overdue)'}
                    </p>
                  </div>

                  <div className="flex items-center sm:justify-center">
                    <button
                      onClick={() => handleReturn(item)}
                      disabled={returningId !== null}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium ${
                        isReturning
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isReturning ? 'Returning...' : 'Return Book'}
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