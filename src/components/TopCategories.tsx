import Link from 'next/link';

const categories = [
  {
    id: 'fiction',
    title: 'Fiction',
    description: 'Novels and short stories',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2f6b52" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'science',
    title: 'Science',
    description: 'How the world works',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2f6b52" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    id: 'history',
    title: 'History',
    description: 'Stories from the past',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2f6b52" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 12h18M3 9h18M3 6h18M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'kids',
    title: 'Kids',
    description: 'Picture books and more',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#2f6b52" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

const TopCategories = () => {
  return (
    <section className="py-16 px-4 bg-amber-50">
      <div className="max-w-350 mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl font-serif text-gray-900 mb-3">Top Categories</h2>
        <p className="text-gray-500 mb-10">Pick a shelf and start reading.</p>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group bg-white/60 border border-black-100 rounded-lg p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-md hover:border-[#2f6b52]/20"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                {category.icon}
              </div>
              {/* Title */}
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">
                {category.title}
              </h3>
              {/* Description */}
              <p className="text-sm text-gray-500">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCategories;