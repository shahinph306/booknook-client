
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API_URL = "http://localhost:8000";

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
  createdAt?: string;
}

const MyBooksPage = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Book>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  // Load logged-in user's books
  const loadBooks = useCallback(async (signal?: AbortSignal) => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/my-books/${encodeURIComponent(user.email)}`,
        {
          cache: "no-store",
          signal,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load books.");
      }

      setBooks(data.books || []);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Load Books Error:", error);

        toast.add({
          type: "error",
          title: "Failed to Load Books",
          description: error.message,
        });
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [user?.email]);

  useEffect(() => {
    if (isPending || !user?.email) return;

    const controller = new AbortController();

    loadBooks(controller.signal);

    return () => controller.abort();
  }, [isPending, user?.email, loadBooks]);

  // Start editing
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

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle edit input changes
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: name === "totalCopies" ? Number(value) : value,
    }));
  };

  // Save edited book
  const saveEdit = async () => {
    if (!editingId || isSaving) return;

    // Validate form
    if (
      !editForm.bookTitle?.trim() ||
      !editForm.authorName?.trim() ||
      !editForm.category ||
      !editForm.bookImageUrl?.trim() ||
      !Number.isInteger(editForm.totalCopies) ||
      editForm.totalCopies! < 1
    ) {
      toast.add({
        type: "error",
        title: "Invalid Information",
        description: "Please enter valid book information.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const updatedData = {
        bookTitle: editForm.bookTitle.trim(),
        authorName: editForm.authorName.trim(),
        category: editForm.category,
        totalCopies: Number(editForm.totalCopies),
        bookImageUrl: editForm.bookImageUrl.trim(),
        shortDescription: editForm.shortDescription?.trim() || "",
      };

      const res = await fetch(
        `${API_URL}/edit-book/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success || !data.book) {
        throw new Error(
          data.message || "Could not update book."
        );
      }

      // Update frontend state immediately
      setBooks((prev) =>
        prev.map((book) =>
          book._id === editingId ? data.book : book
        )
      );

      toast.add({
        type: "success",
        title: "Book Updated Successfully",
        description: `${data.book.bookTitle} has been updated.`,
      });

      // Close edit form
      setEditingId(null);
      setEditForm({});

    } catch (error) {
      console.error("Update Book Error:", error);

      toast.add({
        type: "error",
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete book
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(
        `${API_URL}/delete-book/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Could not delete the book."
        );
      }

      setBooks((prev) =>
        prev.filter((book) => book._id !== id)
      );

      toast.add({
        type: "success",
        title: "Book Deleted",
        description: "The book has been removed successfully.",
      });
    } catch (error) {
      console.error("Delete Book Error:", error);

      toast.add({
        type: "error",
        title: "Delete Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (isPending || !user || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p className="text-gray-600">Loading your books...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto min-h-screen bg-amber-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-serif text-gray-900">
              My Books
            </h1>

            <p className="text-gray-500">
              Manage the books you have added to BookNook.
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Total Books: {books.length}
            </p>
          </div>

          <Link
            href="/add-book"
            className="rounded bg-[#2f6b52] px-5 py-2.5 font-medium text-white transition hover:bg-[#275c46]"
          >
            + Add New Book
          </Link>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No Books Added Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven&apos;t added any books yet.
            </p>

            <Link
              href="/add-book"
              className="mt-5 inline-block rounded bg-[#2f6b52] px-5 py-2.5 font-medium text-white hover:bg-[#275c46]"
            >
              Add Your First Book
            </Link>
          </div>
        ) : (

          /* Book List */
          <div className="space-y-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="rounded-lg border bg-white p-5 shadow-sm"
              >
                {editingId === book._id ? (

                  /* Edit Form */
                  <div className="space-y-4">

                    <h2 className="text-xl font-semibold text-gray-800">
                      Edit Book
                    </h2>

                    <input
                      type="text"
                      name="bookTitle"
                      value={editForm.bookTitle || ""}
                      onChange={handleEditChange}
                      className="w-full rounded border border-black/10 bg-white px-3 py-2"
                      placeholder="Book Title"
                      required
                    />

                    <input
                      type="text"
                      name="authorName"
                      value={editForm.authorName || ""}
                      onChange={handleEditChange}
                      className="w-full rounded border border-black/10 bg-white px-3 py-2"
                      placeholder="Author Name"
                      required
                    />

                    <select
                      name="category"
                      value={editForm.category || "fiction"}
                      onChange={handleEditChange}
                      className="w-full rounded border border-black/10 bg-white px-3 py-2"
                    >
                      <option value="fiction">Fiction</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="kids">Kids</option>
                    </select>

                    <input
                      type="number"
                      name="totalCopies"
                      value={editForm.totalCopies ?? 1}
                      min={1}
                      step={1}
                      onChange={handleEditChange}
                      className="w-full rounded border border-black/10 bg-white px-3 py-2"
                      placeholder="Total Copies"
                      required
                    />

                    <input
                      type="url"
                      name="bookImageUrl"
                      value={editForm.bookImageUrl || ""}
                      onChange={handleEditChange}
                      className="w-full rounded border border-black/10 bg-white px-3 py-2"
                      placeholder="Book Image URL"
                    />

                    {/* Image Preview */}
                    {editForm.bookImageUrl && (
                      <div>
                        <p className="mb-2 text-sm text-gray-600">
                          Image Preview
                        </p>

                        <img
                          src={editForm.bookImageUrl}
                          alt="Book cover preview"
                          className="h-40 w-28 rounded border object-cover"
                        />
                      </div>
                    )}

                    <textarea
                      name="shortDescription"
                      value={editForm.shortDescription || ""}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full rounded border border-black/10 bg-white px-3 py-2"
                      placeholder="Short Description"
                    />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={isSaving}
                        className="rounded bg-[#2f6b52] px-4 py-2 text-white hover:bg-[#275c46] disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                ) : (

                  /* Book Details */
                  <div className="flex flex-col gap-5 md:flex-row">

                    {book.bookImageUrl ? (
                      <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded bg-gray-100">
                        <Image
                          src={book.bookImageUrl}
                          alt={book.bookTitle}
                          fill
                          unoptimized
                          sizes="128px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex h-44 w-32 shrink-0 items-center justify-center rounded bg-gray-100 text-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}

                    <div className="flex-1">
                      <h2 className="mb-1 text-xl font-semibold text-gray-900">
                        {book.bookTitle}
                      </h2>

                      <p className="mb-2 text-gray-600">
                        Author: {book.authorName}
                      </p>

                      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded bg-amber-100 px-2 py-1 capitalize text-amber-800">
                          {book.category}
                        </span>

                        <span className="text-gray-500">
                          Copies: {book.totalCopies}
                        </span>
                      </div>

                      {book.shortDescription && (
                        <p className="line-clamp-3 text-sm text-gray-700">
                          {book.shortDescription}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(book)}
                          className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(book._id)}
                          disabled={deletingId === book._id}
                          className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 disabled:bg-gray-400"
                        >
                          {deletingId === book._id
                            ? "Deleting..."
                            : "Delete"}
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
};

export default MyBooksPage;
