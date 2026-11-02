/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/purity */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BookCard, { Book } from './BookCard';
import Link from 'next/link';

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
  const getSafeImageUrl = (book: Book): string => {
    // bookImageUrl বা bookImage যেকোনো একটি ব্যবহার
    const url = book.bookImageUrl || (book as any).bookImage || '';
    
    // যদি বৈধ লিঙ্ক হয় — ব্যবহার করুন
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // না হলে ডিফল্ট ছবি — প্রতিটি বইয়ের জন্য আলাদা করার জন্য বইয়ের নাম যোগ করুন
    const fallbackBase = 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
    // বইয়ের নাম বা id যোগ করলে ক্যাশ না হয়ে আলাদা আলাদা দেখাবে
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
              <BookCard 
                key={book._id} 
                book={{
                  ...book,
                  // ✅ প্রতিটি বইয়ের জন্য নিজস্ব ছবি URL পাঠান
                  bookImageUrl: getSafeImageUrl(book),
                }} 
              />
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
