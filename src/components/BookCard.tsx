
import Image from 'next/image';
import Link from 'next/link';

export type Book = {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImage: string;
  shortDescription: string;
};

type BookCardProps = {
  book: Book;
};

const BookCard = ({ book }: BookCardProps) => {
  const imageUrl = book.bookImage?.startsWith('http')
    ? book.bookImage
    : 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg';

  return (
    <div
      className="group bg-white rounded-xl shadow-sm overflow-hidden border border-black-50
      transition-all duration-300 ease-out
      hover:shadow-lg hover:-translate-y-1 cursor-pointer"
    >
      {/* Book Cover Image */}
      <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
        <Image
          src={imageUrl}
          alt={book.bookTitle || 'Book cover'}
          fill
          className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
      </div>

      {/* Card Information */}
      <div className="p-4 flex flex-col min-h-48">

        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-green-100 text-red-700 border border-red-200 text-xs rounded-full capitalize">
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
            className="px-4 py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white text-center text-xs font-semibold rounded transition-colors whitespace-nowrap"
          >
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookCard;
