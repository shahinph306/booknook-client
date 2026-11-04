/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
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
  shortDescription?: string;
  userName?: string;
  userEmail?: string;
  createdAt?: string;
}

type BookForm = {
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImageUrl: string;
  shortDescription: string;
};

// Safe JSON response handler
async function getResponseData(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    throw new Error(
      `Server returned an invalid response (${response.status}). Check your API server and endpoint.`
    );
  }

  return response.json();
}

export default function MyBooksPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BookForm>({
    bookTitle: "",
    authorName: "",
    category: "fiction",
    totalCopies: 1,
    bookImageUrl: "",
    shortDescription: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  // Load user's books
  const loadBooks = useCallback(
    async (signal?: AbortSignal) => {
      if (!user?.email) return;

      setLoading(true);
      setError("");

      try {
        const email = user.email.trim().toLowerCase();

        const response = await fetch(
          `${API_URL}/my-books/${encodeURIComponent(email)}`,
          {
            method: "GET",
            cache: "no-store",
            signal,
          }
        );

        const data = await getResponseData(response);

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message || "Failed to load your books."
          );
        }

        const bookList = Array.isArray(data)
          ? data
          : data.books;

        if (!Array.isArray(bookList)) {
          throw new Error("Invalid books data received from server.");
        }

        setBooks(bookList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while loading books.";

        console.error("Load Books Error:", err);

        setError(message);
        setBooks([]);

        toast.add({
          type: "error",
          title: "Failed to Load Books",
          description: message,
        });
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [user?.email]
  );

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
      totalCopies: Number(book.totalCopies) || 1,
      bookImageUrl: book.bookImageUrl || "",
      shortDescription: book.shortDescription || "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Handle form changes
  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]:
        name === "totalCopies" ? Number(value) : value,
    }));
  };

  // Update book
  const saveEdit = async () => {
    if (!editingId || isSaving) return;

    if (
      !editForm.bookTitle.trim() ||
      !editForm.authorName.trim() ||
      !editForm.category ||
      !editForm.bookImageUrl.trim() ||
      !Number.isInteger(editForm.totalCopies) ||
      editForm.totalCopies < 1
    ) {
      toast.add({
        type: "error",
        title: "Invalid Information",
        description: "Please enter valid book information.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const updatedData = {
        bookTitle: editForm.bookTitle.trim(),
        authorName: editForm.authorName.trim(),
        category: editForm.category,
        totalCopies: editForm.totalCopies,
        bookImageUrl: editForm.bookImageUrl.trim(),
        shortDescription: editForm.shortDescription.trim(),
      };

      const response = await fetch(
        `${API_URL}/edit-book/${encodeURIComponent(editingId)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const data = await getResponseData(response);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not update book."
        );
      }

      // Reload updated books from server
      await loadBooks();

      toast.add({
        type: "success",
        title: "Book Updated",
        description: "Your book has been updated successfully.",
      });

      setEditingId(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      console.error("Update Book Error:", err);

      toast.add({
        type: "error",
        title: "Update Failed",
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete book
  const handleDelete = async (id: string) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/delete-book/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await getResponseData(response);

      if (!response.ok || !data.success) {
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
        description: "Book removed successfully.",
      });

      if (editingId === id) {
        setEditingId(null);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      console.error("Delete Book Error:", err);

      toast.add({
        type: "error",
        title: "Delete Failed",
        description: message,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p className="text-gray-600">
          Loading your books...
        </p>
      </div>
    );
  }

  // Authentication
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p className="text-gray-600">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <main className="container mx-auto min-h-screen bg-amber-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-gray-900">
              My Books
            </h1>

            <p className="mt-2 text-sm text-gray-500">
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

        {/* Error */}
        {error ? (
          <div className="rounded-lg border border-red-200 bg-white p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">
              Unable to Load Books
            </h2>

            <p className="mb-5 text-sm text-gray-600">
              {error}
            </p>

            <button
              onClick={() => loadBooks()}
              className="rounded bg-[#2f6b52] px-5 py-2 text-white hover:bg-[#275c46]"
            >
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (

          /* Empty State */
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No Books Added Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You have not added any books yet.
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
                className="rounded-xl border border-black/5 bg-white p-5 shadow-sm"
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
                      value={editForm.bookTitle}
                      onChange={handleEditChange}
                      className="w-full rounded border px-3 py-2"
                      placeholder="Book Title"
                    />

                    <input
                      type="text"
                      name="authorName"
                      value={editForm.authorName}
                      onChange={handleEditChange}
                      className="w-full rounded border px-3 py-2"
                      placeholder="Author Name"
                    />

                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="fiction">Fiction</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="kids">Kids</option>
                    </select>

                    <input
                      type="number"
                      name="totalCopies"
                      value={editForm.totalCopies}
                      min={1}
                      step={1}
                      onChange={handleEditChange}
                      className="w-full rounded border px-3 py-2"
                      placeholder="Total Copies"
                    />

                    <input
                      type="url"
                      name="bookImageUrl"
                      value={editForm.bookImageUrl}
                      onChange={handleEditChange}
                      className="w-full rounded border px-3 py-2"
                      placeholder="Book Image URL"
                    />

                    {editForm.bookImageUrl && (
                      <div>
                        <p className="mb-2 text-sm text-gray-600">
                          Image Preview
                        </p>

                        <img
                          src={editForm.bookImageUrl}
                          alt="Book cover preview"
                          className="h-40 w-28 rounded border object-contain"
                        />
                      </div>
                    )}

                    <textarea
                      name="shortDescription"
                      value={editForm.shortDescription}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full rounded border px-3 py-2"
                      placeholder="Short Description"
                    />

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={isSaving}
                        className="rounded bg-[#2f6b52] px-5 py-2 text-white disabled:bg-gray-400"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="rounded bg-gray-200 px-5 py-2 text-gray-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                ) : (

                  /* Book Details */
                  <div className="flex flex-col gap-5 md:flex-row">
                    {book.bookImageUrl ? (
                      <div className="flex h-48 w-36 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100 p-2">
                        <img
                          src={book.bookImageUrl}
                          alt={book.bookTitle}
                          className="h-full w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 w-36 shrink-0 items-center justify-center rounded bg-gray-100 text-sm text-gray-400">
                        No Book Cover
                      </div>
                    )}

                    <div className="flex-1">
                      <h2 className="mb-1 text-xl font-semibold text-gray-900">
                        {book.bookTitle}
                      </h2>

                      <p className="mb-3 text-gray-600">
                        Author: {book.authorName}
                      </p>

                      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className="rounded bg-amber-100 px-3 py-1 capitalize text-amber-800">
                          {book.category}
                        </span>

                        <span className="text-gray-500">
                          Copies: {Number(book.totalCopies) || 0}
                        </span>
                      </div>

                      {book.shortDescription && (
                        <p className="line-clamp-3 text-sm leading-6 text-gray-700">
                          {book.shortDescription}
                        </p>
                      )}

                      <div className="mt-3 text-xs text-gray-400">
                        Added by: {book.userName || user.name || "You"}
                      </div>

                      {book.createdAt && (
                        <p className="mt-1 text-xs text-gray-400">
                          Added on:{" "}
                          {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(book)}
                          disabled={!!deletingId}
                          className="rounded bg-green-500 px-5 py-2 text-white transition hover:bg-green-600 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(book._id)}
                          disabled={!!deletingId || isSaving}
                          className="rounded bg-red-500 px-5 py-2 text-white transition hover:bg-red-600 disabled:bg-gray-400"
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
}
