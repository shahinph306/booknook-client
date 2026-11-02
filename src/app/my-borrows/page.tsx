/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from '@/components/ui/toast';

type BorrowedBook = {
  id: string;
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

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('myBorrows') || '[]';
      const data = JSON.parse(raw) as Partial<BorrowedBook>[];

      // ✅ ডুপ্লিকেট সরান + id নিশ্চিত + টাইপ সঠিক
      const bookMap = new Map<string, Partial<BorrowedBook>>();
      data.forEach(item => {
        if (item.bookId) {
          bookMap.set(item.bookId, item);
        }
      });

      const unique: BorrowedBook[] = Array.from(bookMap.values()).map(item => ({
        bookId: item.bookId!,
        bookTitle: item.bookTitle || 'Unknown Title',
        authorName: item.authorName || 'Unknown Author',
        bookImageUrl: item.bookImageUrl || '',
        borrowerName: item.borrowerName || '',
        borrowerEmail: item.borrowerEmail || '',
        borrowedAt: item.borrowedAt || new Date().toISOString(),
        returnBy: item.returnBy || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        returned: item.returned,
        // ✅ সর্বদা ইউনিক id তৈরি
        id: item.id || `${item.bookId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      }));

      if (unique.length !== data.length) {
        localStorage.setItem('myBorrows', JSON.stringify(unique));
      }

      setBorrows(unique);
    } catch (err) {
      console.error('Load borrows error:', err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReturn = (item: BorrowedBook) => {
    const updated = borrows.filter(b => b.id !== item.id);
    localStorage.setItem('myBorrows', JSON.stringify(updated));
    setBorrows(updated);

    toast.add({
      type: 'success',
      title: '✅ Book Returned',
      description: `"${item.bookTitle}" has been returned successfully. Thank you!`,
    });
  };

  const getImageUrl = (book: BorrowedBook): string => {
    if (book.bookImageUrl?.startsWith('http')) return book.bookImageUrl;
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
    <main className="min-h-screen bg-amber-50 py-10 px-4 container mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-gray-900 mb-6 text-center">My Borrows</h1>

        {borrows.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            You haven&apos;t borrowed any books yet.{' '}
            <Link href="/all-books" className="text-[#2f6b52] underline font-medium">
              Browse Books
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {borrows.map((item) => {
              // ✅ এখানে 'item' পুরোপুরি টাইপড BorrowedBook
              const borrowedDate = new Date(item.borrowedAt).toLocaleDateString();
              const returnDate = new Date(item.returnBy).toLocaleDateString();
              const isOverdue = new Date(item.returnBy) < new Date();

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 border flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-24 h-36 shrink-0 bg-gray-50 rounded overflow-hidden">
                    <Image
                      src={getImageUrl(item)}
                      alt={item.bookTitle}
                      width={96}
                      height={144}
                      className="w-full h-full object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{item.bookTitle}</h3>
                    <p className="text-gray-500 text-sm mb-2">By {item.authorName}</p>
                    <p className="text-xs text-red-400">
                      Borrowed: {borrowedDate}
                    </p>
                    <p className={`text-xs mt-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-white bg-red-500 w-fit p-1'}`}>
                      Return by: {returnDate} {isOverdue && '(Overdue)'}
                    </p>
                  </div>
                  <div className="flex items-center sm:justify-center">
                    <button
                      onClick={() => handleReturn(item)}
                      className="px-4 py-2 bg-green-400 text-black hover:bg-green-600 rounded text-sm transition-colors"
                    >
                      Return Book
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
