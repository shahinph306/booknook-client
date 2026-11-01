
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BookCard, { Book } from './BookCard';
import Link from 'next/link';

const CategoryBooks = () => {
  const params = useParams<{ category: string }>();
  const category = params.category?.toLowerCase();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        const data: Book[] = await res.json();

        const filteredBooks = data.filter(
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

        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
            {categoryTitle} Books
          </h1>

          <p className="text-gray-500 italic">
            Explore our {category} book collection.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {books.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-500">
              No books found in this category.
            </div>
          ) : (
            books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))
          )}

        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CategoryBooks;
