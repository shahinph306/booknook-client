

'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AllBooksContent = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch('http://localhost:8000/all-books', {
                    cache: 'no-store',
                });
                if (!res.ok) throw new Error('Failed to fetch books');
                const data = await res.json();
                setBooks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Fetch error:', err);
            }
        };
        fetchBooks();
    }, []);

    const getImageUrl = (book: { bookImageUrl?: string; bookTitle?: string }) => {
        if (book.bookImageUrl && book.bookImageUrl.startsWith('http')) {
            return book.bookImageUrl;
        }
        const title = encodeURIComponent(book.bookTitle || 'book');
        return `https://covers.openlibrary.org/b/title/${title}-L.jpg`;
    };

    if (error) {
        return (
            <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center text-red-600">
                Failed to load data — please check if the backend is running
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f5ea] py-12 px-4 mx-auto container">
            <div className="max-w-7xl mx-auto">
                {/* Page Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">All Books</h1>
                    <p className="text-gray-500 italic">Every book on the BookNook shelf.</p>
                </div>

                {/* Books Grid — Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {books.length === 0 ? (
                        <div className="col-span-full text-center py-16 text-gray-500">
                            No books found
                        </div>
                    ) : (
                        books.map((book: {
                            category: string;
                            authorName: string;
                            _id: number; bookImageUrl?: string; bookTitle?: string
                        }, i: number) => (
                            <div
                                key={i}
                                className="group bg-white rounded-xl shadow-sm overflow-hidden border border-black-100 
                           transition-all duration-300 ease-out
                           hover:shadow-lg hover:-translate-y-2 cursor-pointer"
                            >
                                {/* Book Cover Image — Zoom on card hover */}
                                <div className="relative w-full h-72 bg-gray-50 overflow-hidden">
                                    <Image
                                        src={getImageUrl(book)}
                                        alt={book.bookTitle || 'Book cover'}
                                        fill
                                        className="object-cover 
                               transition-transform duration-500 ease-out
                               group-hover:scale-110"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        unoptimized
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
                                        }}
                                    />
                                </div>

                                {/* Card Info */}
                                <div className="p-4">
                                    <span className="inline-block px-2 py-1 bg-gray-200 text-red-600 border text-xs rounded mb-3 capitalize">
                                        {book.category || 'General'}
                                    </span>

                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {book.bookTitle || 'Unknown Title'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        by {book.authorName || 'Unknown Author'}
                                    </p>

                                    <Link
                                        href={`/all-books/${book._id || i}`}
                                        className="block w-full py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white text-center text-sm font-medium rounded transition-colors"
                                    >
                                        View Details
                                    </Link>
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