// /* eslint-disable react-hooks/set-state-in-effect */

// 'use client';

// import { useState, useEffect } from 'react';

// // লগইন করা ব্যবহারকারীর ডেটা (পরবর্তীতে আপনার auth থেকে নিয়ে বসিয়ে দেবেন)
// const getLoggedInUser = () => {
//   // অস্থায়ীভাবে ডিফল্ট মান — পরে এটাকে আপনার auth সিস্টেমের ডেটা দিয়ে প্রতিস্থাপন করুন
//   return {
//     name: 'xyz',
//     email: 'xyz@gmail.com',
//   };
// };

// const AddBookPage = () => {
//   const [formData, setFormData] = useState({
//     bookTitle: '',
//     authorName: '',
//     category: 'Fiction',
//     totalCopies: 1,
//     bookImage: null as File | null,
//     shortDescription: '',
//     userName: '',
//     userEmail: '',
//   });

//   // পেজ লোড হলে লগইন ব্যবহারকারীর ডেটা বসিয়ে দিন
//   useEffect(() => {
//     const user = getLoggedInUser();
//     setFormData((prev) => ({
//       ...prev,
//       userName: user.name,
//       userEmail: user.email,
//     }));
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     if (type === 'file') {
//       const fileInput = e.target as HTMLInputElement;
//       setFormData((prev) => ({
//         ...prev,
//         bookImage: fileInput.files ? fileInput.files[0] : null,
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // console.log('📚 Book Data:', formData);
//     // এখানে API কল করে ডেটা সাবমিট করুন
//     const res = await fetch("http://localhost:8000/add-book", {
//       method: "POST",
//       body: JSON.stringify(formData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await res.json();
//     // console.log('📚 Book Data:', formData);
//     console.log(data);
    
//   };
//   // console.log(formData);
  

//   return (
//     <main className="min-h-screen bg-amber-50 py-10 px-4 mx-auto container">
//       <div className="max-w-2xl mx-auto">
//         {/* Heading */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-serif text-gray-900 mb-2">Add a Book</h1>
//           <p className="text-gray-500">Put a book from your shelf into the library.</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Row 1: Book Title & Author Name */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <label htmlFor="bookTitle" className="block text-sm text-gray-700 mb-1.5">
//                 Book Title
//               </label>
//               <input
//                 type="text"
//                 id="bookTitle"
//                 name="bookTitle"
//                 value={formData.bookTitle}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="authorName" className="block text-sm text-gray-700 mb-1.5">
//                 Author Name
//               </label>
//               <input
//                 type="text"
//                 id="authorName"
//                 name="authorName"
//                 value={formData.authorName}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
//                 required
//               />
//             </div>
//           </div>

//           {/* Row 2: Category & Total Copies */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <label htmlFor="category" className="block text-sm text-gray-700 mb-1.5">
//                 Category
//               </label>
//               <select
//                 id="category"
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
//               >
//                 <option value="Fiction">Fiction</option>
//                 <option value="Science">Science</option>
//                 <option value="History">History</option>
//                 <option value="Kids">Kids</option>
//               </select>
//             </div>
//             <div>
//               <label htmlFor="totalCopies" className="block text-sm text-gray-700 mb-1.5">
//                 Total Copies
//               </label>
//               <input
//                 type="number"
//                 id="totalCopies"
//                 name="totalCopies"
//                 value={formData.totalCopies}
//                 onChange={handleChange}
//                 min={1}
//                 className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
//               />
//             </div>
//           </div>

//           {/* Book Image */}
//           <div>
//             <label htmlFor="bookImage" className="block text-sm text-gray-700 mb-1.5">
//               Book Image
//             </label>
//             <input
//               type="file"
//               id="bookImage"
//               name="bookImage"
//               accept="image/*"
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-black-100 rounded bg-white text-sm text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-black-100 file:text-gray-700 hover:file:bg-black-200"
//             />
//           </div>

//           {/* Short Description */}
//           <div>
//             <label htmlFor="shortDescription" className="block text-sm text-gray-700 mb-1.5">
//               Short Description
//             </label>
//             <textarea
//               id="shortDescription"
//               name="shortDescription"
//               value={formData.shortDescription}
//               onChange={handleChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
//             />
//           </div>

//           {/* User Name & Email — Read Only */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div>
//               <label htmlFor="userName" className="block text-sm text-gray-700 mb-1.5">
//                 User Name
//               </label>
//               <input
//                 type="text"
//                 id="userName"
//                 name="userName"
//                 value={formData.userName}
//                 readOnly
//                 className="w-full px-3 py-2 border border-black-100 rounded bg-black-50 text-gray-600 cursor-not-allowed"
//               />
//             </div>
//             <div>
//               <label htmlFor="userEmail" className="block text-sm text-gray-700 mb-1.5">
//                 User Email
//               </label>
//               <input
//                 type="email"
//                 id="userEmail"
//                 name="userEmail"
//                 value={formData.userEmail}
//                 readOnly
//                 className="w-full px-3 py-2 border border-black-100 rounded bg-black-50 text-gray-600 cursor-not-allowed"
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full py-2.5 bg-[#2f6b52] hover:bg-[#275c46] text-white font-medium rounded transition-colors mt-2"
//           >
//             Add Book
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// };

// export default AddBookPage;





/* eslint-disable react-hooks/set-state-in-effect */

'use client';

import { useState, useEffect } from 'react';

// লগইন করা ব্যবহারকারীর ডেটা
const getLoggedInUser = () => {
  return {
    name: 'xyz',
    email: 'xyz@gmail.com',
  };
};

const AddBookPage = () => {
  const [formData, setFormData] = useState({
    bookTitle: '',
    authorName: '',
    category: 'Fiction',
    totalCopies: 1,
    bookImageUrl: '', // ✅ ফাইলের বদলে URL
    shortDescription: '',
    userName: '',
    userEmail: '',
  });

  useEffect(() => {
    const user = getLoggedInUser();
    setFormData((prev) => ({
      ...prev,
      userName: user.name,
      userEmail: user.email,
    }));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("http://localhost:8000/add-book", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4 mx-auto container">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Add a Book</h1>
          <p className="text-gray-500">Put a book from your shelf into the library.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Book Title & Author Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="bookTitle" className="block text-sm text-gray-700 mb-1.5">
                Book Title
              </label>
              <input
                type="text"
                id="bookTitle"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                required
              />
            </div>
            <div>
              <label htmlFor="authorName" className="block text-sm text-gray-700 mb-1.5">
                Author Name
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                required
              />
            </div>
          </div>

          {/* Row 2: Category & Total Copies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className="block text-sm text-gray-700 mb-1.5">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
              >
                <option value="Fiction">Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <label htmlFor="totalCopies" className="block text-sm text-gray-700 mb-1.5">
                Total Copies
              </label>
              <input
                type="number"
                id="totalCopies"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
              />
            </div>
          </div>

          {/* ✅ Book Image — Now URL Only */}
          <div>
            <label htmlFor="bookImageUrl" className="block text-sm text-gray-700 mb-1.5">
              Book Image URL
            </label>
            <input
              type="url"
              id="bookImageUrl"
              name="bookImageUrl"
              value={formData.bookImageUrl}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Give the link of the book cover image — like: https://example.com/book.jpg
            </p>
          </div>

          {/* Short Description */}
          <div>
            <label htmlFor="shortDescription" className="block text-sm text-gray-700 mb-1.5">
              Short Description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-black-100 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
            />
          </div>

          {/* User Name & Email — Read Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="userName" className="block text-sm text-gray-700 mb-1.5">
                User Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                readOnly
                className="w-full px-3 py-2 border border-black-100 rounded bg-white text-gray-600 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="userEmail" className="block text-sm text-gray-700 mb-1.5">
                User Email
              </label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                value={formData.userEmail}
                readOnly
                className="w-full px-3 py-2 border border-black-100 rounded bg-white text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#2f6b52] hover:bg-[#275c46] text-white font-medium rounded transition-colors mt-2"
          >
            Add Book
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddBookPage;