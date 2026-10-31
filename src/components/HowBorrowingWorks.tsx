const HowBorrowingWorks = () => {
  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      step: "Step 1",
      title: "Find a book",
      description: "Browse the shelf and open any book you like."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      step: "Step 2",
      title: "Borrow it",
      description: "Confirm the borrow. The book is yours for 7 days."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      step: "Step 3",
      title: "Return it",
      description: "Done reading? Return it from My Borrows in one click."
    }
  ];

  return (
    <section className="py-12 px-6 bg-blue-100">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-gray-900 mb-3">How Borrowing Works</h2>
        <p className="text-gray-500 mb-10">Three steps. No library card needed.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, index) => (
            <div 
              key={index} 
              className="bg-white/50 border border-black-100 rounded-lg p-8"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <p className="text-amber-700 text-sm font-medium mb-1">{item.step}</p>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowBorrowingWorks;