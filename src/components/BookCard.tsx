import Image from 'next/image';
import Link from 'next/link';

export type Book = {
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

type Props = {
  book: Book;
};

// ✅ একই রকম ছবি না দেখানোর জন্য প্রতিটি কার্ডে আলাদা URL
const getImageUrl = (book: Book): string => {
  const url = book.bookImageUrl || book.bookImage || '';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // ডিফল্ট ছবিকে ইউনিক করুন যাতে ক্যাশ না হয়
  return `https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg?unique=${book._id}-${encodeURIComponent(book.bookTitle || 'book')}`;
};

const BookCard = ({ book }: Props) => {
  const imageUrl = getImageUrl(book);

  return (
    <Link href={`/book/${book._id}`} className="group block">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow">
        <div className="relative w-full h-64 bg-gray-100">
          <Image
            src={imageUrl}
            alt={book.bookTitle || 'Book cover'}
            fill
            className="object-contain p-3"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized // ✅ ডেভেলপমেন্টে ভালো কাজ করবে
            onError={(e) => {
              // ✅ ভুল লিঙ্ক হলে ডিফল্ট ছবি দেখান
              (e.target as HTMLImageElement).src = 
                `https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg?fallback=${book._id}`;
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#2f6b52] transition-colors">
            {book.bookTitle || 'Unknown Title'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {book.authorName || 'Unknown Author'}
          </p>
          <span className="inline-block mt-3 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded capitalize">
            {book.category || 'General'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
