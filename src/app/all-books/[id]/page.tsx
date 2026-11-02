/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-location-assign-relative-destination */
// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';

// type Book = {
//   _id: string;
//   bookTitle: string;
//   authorName: string;
//   category: string;
//   bookImageUrl?: string;
// };

// const CategoryBooks = () => {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const res = await fetch('http://localhost:8000/all-books', {
//           cache: 'no-store',
//         });
//         if (!res.ok) throw new Error('Failed to fetch');
//         const data: Book[] = await res.json();
//         // Get first 12 books
//         setBooks(data.slice(0, 12));
//       } catch (err) {
//         console.error('Error fetching books:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const getImageUrl = (book: Book): string => {
//     if (book.bookImageUrl && book.bookImageUrl.startsWith('http')) {
//       return book.bookImageUrl;
//     }
//     const title = encodeURIComponent(book.bookTitle || 'book');
//     return `https://covers.openlibrary.org/b/title/${title}-L.jpg`;
//   };

//   if (loading) {
//     return (
//       <section className="py-16 px-4 bg-[#f8f5ea]">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="w-10 h-10 border-4 border-[#2f6b52] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading books...</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 px-4 bg-[#f8f5ea]">
//       <div className="max-w-7xl mx-auto">
//         {/* Heading */}
//         <div className="text-center mb-10">
//           <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">Browse by Category</h2>
//           <p className="text-gray-500 text-sm italic">Explore books from different categories.</p>
//         </div>

//         {/* Books Grid — Responsive */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//           {books.map((book) => (
//             <div
//               key={book._id}
//               className="group bg-white rounded-sm shadow-sm overflow-hidden border border-gray-100
//                          transition-all duration-300 ease-out
//                          hover:shadow-md hover:-translate-y-2 flex flex-col h-full"
//             >
//               {/* Book Cover — Height increased */}
//               <div className="relative w-full h- overflow-hidden bg-gray-50">
//                 <Image
//                   src={getImageUrl(book)}
//                   alt={book.bookTitle}
//                   fill
//                   className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                   unoptimized
//                 />
//               </div>

//               {/* Card Content */}
//               <div className="p-4 flex flex-col flex-grow">
//                 {/* Category Badge */}
//                 <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-3 capitalize">
//                   {book.category || 'General'}
//                 </span>

//                 {/* Title & Author */}
//                 <h3 className="font-medium text-lg text-gray-900 mb-2">
//                   {book.bookTitle}
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   by {book.authorName || 'Unknown Author'}
//                 </p>

//                 {/* Button — Pushes to bottom */}
//                 <div className="mt-auto">
//                   <Link
//                     href={`/book/${book._id}`}
//                     className="block w-full py-2.5 bg-[#2f6b52] hover:bg-[#275c46] text-white text-center text-sm font-medium rounded transition-colors"
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategoryBooks;






// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';

// type Book = {
//   _id?: string;
//   bookTitle?: string;
//   authorName?: string;
//   category?: string;
//   shortDescription?: string;
//   totalCopies?: number;
//   userName?: string;
//   userEmail?: string;
//   bookImageUrl?: string;
// };

// type BookDetailsPageProps = {
//   params: Promise<{ id: string }>;
// };

// const BookDetailsPage = ({ params }: BookDetailsPageProps) => {
//   const [book, setBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         const resolvedParams = await params;
//         const bookId = resolvedParams.id;

//         const res = await fetch(`http://localhost:8000/all-book/${bookId}`, {
//           cache: 'no-store',
//         });

//         if (!res.ok) throw new Error('Failed to fetch book');
//         const data = await res.json();
//         console.log('📦 Book Detail API:', data);

//         // ✅ মূল ফিক্স — data.book থেকে বই নিচ্ছি
//         if (data?.book) {
//           setBook(data.book);
//         } else if (data) {
//           setBook(data);
//         } else {
//           setBook(null);
//         }
//       } catch (err) {
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBook();
//   }, [params]);

//   // ✅ ইমেজ URL — ফলব্যাক ঠিক করা
//   const getImageUrl = (): string => {
//     if (!book) return '';
//     if (book.bookImageUrl && book.bookImageUrl.startsWith('http')) {
//       return book.bookImageUrl;
//     }
//     return 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center mx-auto container">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-[#2f6b52] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading book details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="min-h-screen bg-[#f8f5ea] flex items-center justify-center text-gray-600">
//         Book not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f5ea] py-10 px-4">
//       <div className="max-w-5xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Book Cover Image */}
//           <div className="md:col-span-1">
//             <div className="relative w-full h-[320px] rounded overflow-hidden shadow-lg bg-gray-100">
//               <Image
//                 src={getImageUrl()}
//                 alt={book.bookTitle || 'Book cover'}
//                 fill
//                 className="object-contain p-3"
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 unoptimized
//               />
//             </div>
//           </div>

//           {/* Book Info */}
//           <div className="md:col-span-2 flex flex-col justify-center">
//             <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs rounded mb-4 capitalize w-fit">
//               {book.category || 'General'}
//             </span>

//             <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
//               {book.bookTitle || 'Unknown Title'}
//             </h1>

//             <p className="text-gray-500 mb-4">by {book.authorName || 'Unknown Author'}</p>

//             <p className="text-gray-600 mb-8 leading-relaxed">
//               {book.shortDescription || 'No description available.'}
//             </p>

//             {/* Info Card */}
//             <div className="border border-gray-200 rounded p-4 mb-6 bg-white">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Added by</p>
//                   <p className="text-sm font-medium text-gray-800">{book.userName || 'Unknown'}</p>
//                   <p className="text-xs text-gray-400 mt-1">{book.userEmail || ''}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Copies Left</p>
//                   <p className="text-lg font-semibold text-gray-900">{book.totalCopies ?? 0}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-4 flex-wrap items-center">


//               <Link
//                 href={"/my-borrows"}
//                 className="px-6 py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white text-sm font-medium rounded transition-colors">
//                 Borrow This Book
//               </Link>

//               <Link
//                 href="/all-books"
//                 className="relative px-1 py-1 text-gray-600 text-sm font-medium 
//                           after:absolute after:bottom-0 after:left-0 after:h-0.5 
//                           after:w-0 hover:after:w-full 
//                           after:bg-emerald-500 
//                           after:transition-all after:duration-300 after:ease-out
//                           hover:text-gray-900 transition-colors"
//               >
//                 ← Back to all books
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookDetailsPage;





'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';

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

type BorrowData = {
  id: string;
  bookId: string;
  bookTitle: string;
  authorName: string;
  bookImageUrl: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowedAt: string;
  returnBy: string;
};

type BookDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const getLoggedInUser = () => {
  return {
    name: 'Shahin Mahmud',
    email: 'shahinph306@gmail.com',
  };
};

const BookDetailsPage = ({ params }: BookDetailsPageProps) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [isAlreadyBorrowed, setIsAlreadyBorrowed] = useState<boolean>(false);

  const loggedUser = getLoggedInUser();
  const borrowerName = loggedUser.name;
  const borrowerEmail = loggedUser.email;

  // ✅ নিজে আগে বুক করেছেন কিনা চেক
  useEffect(() => {
    if (!book?._id) return;

    const myBorrows = JSON.parse(localStorage.getItem('myBorrows') || '[]');
    const already = myBorrows.some(
      (item: BorrowData) => item.bookId === book._id
    );
    setIsAlreadyBorrowed(already);
  }, [book?._id]);

  // ✅ বইয়ের ডেটা লোড
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

        if (data?.book) {
          setBook(data.book);
        } else if (data) {
          setBook(data);
        } else {
          setBook(null);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params]);

  const getImageUrl = (): string => {
    if (!book) return 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
    
    const imgUrl = book.bookImageUrl || book.bookImage;
    
    if (imgUrl && imgUrl.startsWith('http')) {
      return imgUrl;
    }

    return 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';
  };

  // ✅ বুক করার ফাংশন — কপি কমানোসহ
  const handleConfirmBorrow = async () => {
    if (!book?._id) return;
    if ((book.totalCopies ?? 0) <= 0) {
      toast.add({
        type: 'error',
        title: '❌ Not Available',
        description: 'This book is currently out of stock.',
      });
      return;
    }
    if (isAlreadyBorrowed) {
      toast.add({
        type: 'error',
        title: '❌ Already Borrowed',
        description: 'You have already borrowed this book.',
      });
      return;
    }

    setBorrowLoading(true);

    try {
      const borrowedAt = new Date().toISOString();
      const returnBy = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const borrowData: BorrowData = {
        id: crypto.randomUUID(),
        bookId: book._id,
        bookTitle: book.bookTitle || 'Unknown Title',
        authorName: book.authorName || 'Unknown Author',
        bookImageUrl: getImageUrl(),
        borrowerName,
        borrowerEmail,
        borrowedAt,
        returnBy,
      };

      // ✅ localStorage-এ যোগ
      const existing = JSON.parse(localStorage.getItem('myBorrows') || '[]');
      const filtered = existing.filter(
        (item: BorrowData) => item.bookId !== book._id
      );
      localStorage.setItem(
        'myBorrows',
        JSON.stringify([borrowData, ...filtered])
      );

      // ✅ সার্ভারে কপি সংখ্যা কমানোর অনুরোধ
      const updateRes = await fetch(`http://localhost:8000/decrement-copies/${book._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (updateRes.ok) {
        // ✅ স্থানীয় স্টেটেও কপি কমান
        setBook(prev => prev ? { ...prev, totalCopies: (prev.totalCopies ?? 1) - 1 } : null);
      }

      setIsAlreadyBorrowed(true);

      toast.add({
        type: 'success',
        title: '✅ Book Borrowed Successfully!',
        description: `"${book.bookTitle}" added. Return by ${new Date(returnBy).toLocaleDateString()}.`,
      });
      
      setTimeout(() => {
        setOpenDialog(false);
        window.location.href = '/my-borrows';
      }, 1500);
    } catch (err) {
      toast.add({
        type: 'error',
        title: '❌ Failed to Borrow',
        description: 'Something went wrong. Please try again.',
      });
      console.error(err);
    } finally {
      setBorrowLoading(false);
    }
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

  const copiesLeft = book.totalCopies ?? 0;
  const noCopiesLeft = copiesLeft <= 0;

  return (
    <div className="min-h-screen bg-[#f8f5ea] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="relative w-full h-80 rounded overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={getImageUrl()}
                alt={book.bookTitle || 'Book cover'}
                fill
                className="object-contain p-3"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            </div>
          </div>

          {/* Book Info */}
          <div className="md:col-span-2 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs rounded mb-4 capitalize w-fit">
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
            <div className="border border-gray-200 rounded p-4 mb-6 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Added by</p>
                  <p className="text-sm font-medium text-gray-800">
                    {book.userName || 'Shahin Mahmud'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {book.userEmail || 'shahinph306@gmail.com'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Copies Left</p>
                  {/* ✅ কপি শেষ হলে বিশেষ বার্তা */}
                  {noCopiesLeft ? (
                    <p className="text-lg font-semibold text-red-500">This book has no copies left</p>
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{copiesLeft}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap items-center">
              {/* ✅ কপি নেই বা আগে বুক করলে বাটন নিষ্ক্রিয় */}
              <Button
                onClick={() => setOpenDialog(true)}
                disabled={isAlreadyBorrowed || noCopiesLeft}
                className={`px-6 ${
                  isAlreadyBorrowed || noCopiesLeft
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#2f6b52] hover:bg-[#275c46] text-white'
                }`}
              >
                {noCopiesLeft
                  ? '📕 Not Available'
                  : isAlreadyBorrowed
                    ? '✅ Already Borrowed'
                    : 'Borrow This Book'}
              </Button>

              <Link
                href="/all-books"
                className="relative px-1 py-1 text-gray-600 text-sm font-medium 
                          after:absolute after:bottom-0 after:left-0 after:h-0.5 
                          after:w-0 hover:after:w-full 
                          after:bg-emerald-500 
                          after:transition-all after:duration-300 after:ease-out
                          hover:text-gray-900 transition-colors"
              >
                ← Back to all books
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Dialog Box */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-[#f8f5ea] border-amber-100">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Borrow &quot;{book.bookTitle}&quot;
            </DialogTitle>
            <DialogDescription>
              You can keep this book for 7 days.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={borrowerName}
                readOnly
                disabled
                className="bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={borrowerEmail}
                readOnly
                disabled
                className="bg-gray-50 border-gray-200 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpenDialog(false)}
              disabled={borrowLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmBorrow}
              disabled={borrowLoading}
              className="bg-[#2f6b52] hover:bg-[#275c46] text-white"
            >
              {borrowLoading ? 'Confirming...' : 'Confirm Borrow'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookDetailsPage;
