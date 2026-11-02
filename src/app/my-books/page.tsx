/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/toast'; // ✅ Toast import

interface Book {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImageUrl: string;
  shortDescription: string;
  userName: string;
  userEmail: string;
}

const getLoggedInUser = () => {
  return { name: 'xyz', email: 'xyz@gmail.com' };
};

export default function MyBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Book>>({});
  const user = getLoggedInUser();

  const loadBooks = async () => {
    try {
      const res = await fetch(`http://localhost:8000/my-books/${user.email}`);
      const data = await res.json();
      if (data.success) setBooks(data.books);
    } catch {
      toast.add({
        type: 'error',
        title: '❌ Failed to Load',
        description: 'Could not load your books. Please refresh.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBooks(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure to delete this book?')) return;
    try {
      const res = await fetch(`http://localhost:8000/delete-book/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBooks(prev => prev.filter(b => b._id !== id));
        // ✅ Delete Toast
        toast.add({
          type: 'success',
          title: '✅ Book Deleted',
          description: 'The book has been removed successfully.',
        });
      } else {
        toast.add({
          type: 'error',
          title: '❌ Delete Failed',
          description: data.message || 'Could not delete the book.',
        });
      }
    } catch {
      toast.add({
        type: 'error',
        title: '❌ Delete Failed',
        description: 'Something went wrong. Try again.',
      });
    }
  };

  const startEdit = (book: Book) => {
    setEditingId(book._id);
    setEditForm({
      bookTitle: book.bookTitle,
      authorName: book.authorName,
      category: book.category,
      totalCopies: book.totalCopies,
      bookImageUrl: book.bookImageUrl,
      shortDescription: book.shortDescription,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`http://localhost:8000/edit-book/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setBooks(prev => prev.map(b => b._id === editingId ? { ...b, ...data.book } : b));
        setEditingId(null);
        // ✅ Save Success Toast
        toast.add({
          type: 'success',
          title: '✅ Book Updated',
          description: `"${editForm.bookTitle}" has been updated successfully!`,
        });
      } else {
        toast.add({
          type: 'error',
          title: '❌ Update Failed',
          description: data.message || 'Could not save changes.',
        });
      }
    } catch {
      toast.add({
        type: 'error',
        title: '❌ Update Failed',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (loading) return <p className="text-center py-10">Loading your books...</p>;

  return (
    <main className="min-h-screen bg-amber-50 py-10 px-4 container mx-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif text-gray-900 mb-6 text-center">My Books</h1>

        {books.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            You haven&apos;t added any books yet.{' '}
            <a href="/add-book" className="text-[#2f6b52] underline font-medium">Add your first book</a>
          </p>
        ) : (
          <div className="space-y-6">
            {books.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow p-5 border">
                {editingId === book._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.bookTitle || ''}
                      onChange={(e) => setEditForm(p => ({ ...p, bookTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-black/10 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                      placeholder="Book Title"
                      required
                    />
                    <input
                      type="text"
                      value={editForm.authorName || ''}
                      onChange={(e) => setEditForm(p => ({ ...p, authorName: e.target.value }))}
                      className="w-full px-3 py-2 border border-black/10 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                      placeholder="Author Name"
                      required
                    />
                    <select
                      value={editForm.category || 'Fiction'}
                      onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-black/10 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                    >
                      <option value="Fiction">Fiction</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                      <option value="Kids">Kids</option>
                    </select>
                    <input
                      type="number"
                      value={editForm.totalCopies || 1}
                      min={1}
                      onChange={(e) => setEditForm(p => ({ ...p, totalCopies: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-black/10 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                      placeholder="Total Copies"
                    />
                    <input
                      type="url"
                      value={editForm.bookImageUrl || ''}
                      onChange={(e) => setEditForm(p => ({ ...p, bookImageUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-black/10 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                      placeholder="Book Image URL"
                    />
                    <textarea
                      value={editForm.shortDescription || ''}
                      onChange={(e) => setEditForm(p => ({ ...p, shortDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-black/10 rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#2f6b52]"
                      placeholder="Short Description"
                    />
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={saveEdit}
                        className="px-4 py-2 bg-[#2f6b52] hover:bg-[#275c46] text-white rounded transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-5">
                    {book.bookImageUrl && (
                      <img
                        src={book.bookImageUrl}
                        alt={book.bookTitle}
                        className="w-32 h-44 object-cover rounded shadow-sm shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x176?text=No+Image';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{book.bookTitle}</h3>
                      <p className="text-gray-600 mb-1">✍️ {book.authorName}</p>
                      <p className="text-sm text-gray-500 mb-1">
                        <span className="bg-amber-100 px-2 py-0.5 rounded text-xs">{book.category}</span>
                        {' • '}Copies: {book.totalCopies}
                      </p>
                      {book.shortDescription && (
                        <p className="text-gray-700 text-sm mt-2 line-clamp-2">{book.shortDescription}</p>
                      )}
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => startEdit(book)}
                          className="px-4 py-2 bg-green-400 hover:bg-green-600 text-black rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
