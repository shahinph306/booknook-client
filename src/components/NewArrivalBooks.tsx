// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// type Book = {
//     _id: string;
//     bookTitle: string;
//     authorName: string;
//     category: string;
//     bookImageUrl?: string;
// };

// const NewArrivalBooks = () => {
//     const [books, setBooks] = useState<Book[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBooks = async () => {
//             try {
//                 const res = await fetch('http://localhost:8000/all-books', {
//                     cache: 'no-store',
//                 });
//                 if (!res.ok) throw new Error('Failed to fetch');
//                 const data: Book[] = await res.json();
//                 setBooks(data.slice(0, 12));
//             } catch (err) {
//                 console.error('Error fetching books:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBooks();
//     }, []);

//     const getImageUrl = (book: Book): string => {
//         if (book.bookImageUrl && book.bookImageUrl.startsWith('http')) {
//             return book.bookImageUrl;
//         }
//         const title = encodeURIComponent(book.bookTitle || 'book');
//         return `https://covers.openlibrary.org/b/title/${title}-L.jpg`;
//     };

//     if (loading) {
//         return (
//             <section className="py-16 px-4 bg-[#f8f5ea]">
//                 <div className="max-w-7xl mx-auto text-center">
//                     <div className="w-10 h-10 border-4 border-[#2f6b52] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//                     <p className="text-gray-600">Loading new arrivals...</p>
//                 </div>
//             </section>
//         );
//     }

//     return (
//         <section className="py-16 px-4 bg-[#f8f5ea]">
//             <div className="max-w-7xl mx-auto">
//                 {/* Heading */}
//                 <div className="text-center mb-10">
//                     <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">New Arrivals</h2>
//                     <p className="text-gray-500 text-sm italic">The latest books added by our readers.</p>
//                 </div>
//                 {/* Books Grid — Responsive */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//                     {books.length === 0 ? (
//                         <div className="col-span-full text-center py-16 text-gray-500">
//                             No books found
//                         </div>
//                     ) : (
//                         books.map((book: {
//                             category: string;
//                             authorName: string;
//                             _id: number; bookImageUrl?: string; bookTitle?: string
//                         }, i: number) => (
//                             <div
//                                 key={i}
//                                 className="group bg-white rounded-xl shadow-sm overflow-hidden border border-black-100 
//                            transition-all duration-300 ease-out
//                            hover:shadow-lg hover:-translate-y-2 cursor-pointer"
//                             >
//                                 {/* Book Cover Image — Zoom on card hover */}
//                                 <div className="relative w-full h-72 bg-gray-50 overflow-hidden">
//                                     <Image
//                                         src={getImageUrl(book)}
//                                         alt={book.bookTitle || 'Book cover'}
//                                         fill
//                                         className="object-cover 
//                                transition-transform duration-500 ease-out
//                                group-hover:scale-110"
//                                         sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                                         unoptimized
//                                         onError={(e) => {
//                                             e.currentTarget.src = 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Card Info */}
//                                 <div className="p-4">
//                                     <span className="inline-block px-2 py-1 bg-gray-200 text-red-600 border text-xs rounded mb-3 capitalize">
//                                         {book.category || 'General'}
//                                     </span>

//                                     <h3 className="font-semibold text-gray-900 mb-1">
//                                         {book.bookTitle || 'Unknown Title'}
//                                     </h3>
//                                     <p className="text-gray-500 text-sm mb-4">
//                                         by {book.authorName || 'Unknown Author'}
//                                     </p>

//                                     <Link
//                                         href={`/all-books/${book._id || i}`}
//                                         className="block w-full py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white text-center text-sm font-medium rounded transition-colors"
//                                     >
//                                         View Details
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))
//                     )}
//                 </div>
//                 {/* See All Button */}
//                 <div className="text-center mt-10">
//                     <Link
//                         href="/all-books"
//                         className="px-6 py-2 border border-gray-300 text-gray-700 text-sm rounded
//                        hover:bg-gray-100 transition-colors"
//                     >
//                         View All Books
//                     </Link>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default NewArrivalBooks;










'use client';

import { useState, useEffect } from 'react';
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
  createdAt?: string;
};

export default function NewArrivalBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/all-books', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch books');
        
        const data = await res.json();
        console.log('📦 API Response:', data);

        let allBooks: Book[] = [];
        if (data?.success && Array.isArray(data.books)) {
          allBooks = data.books;
        } else if (Array.isArray(data)) {
          allBooks = data;
        } else {
          allBooks = [];
          console.warn('⚠️ Unexpected data format:', data);
        }

        // নতুন বই বাছাই — তারিখ অনুযায়ী সাজানো
        const selectedBooks = allBooks
          .filter((book) => book.createdAt)
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4);

        setBooks(selectedBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getImageUrl = (book: Book): string => {
    const img = book.bookImage || book.bookImageUrl;
    return img?.startsWith('http') 
      ? img 
      : 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
  };

  if (loading) {
    return (
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Loading new arrivals...</p>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">❌ {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-gray-900 mb-2">New Arrivals</h2>
          <p className="text-gray-500">Freshly added to our collection</p>
        </div>

        {books.length === 0 ? (
          <p className="text-center text-gray-500">No new arrivals yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {
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
                      }
          </div>
        )}
      </div>
    </section>
  );
}