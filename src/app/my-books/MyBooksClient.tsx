
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// =====================================
// TYPES
// =====================================

interface Book {
  _id: string;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImageUrl?: string;
  shortDescription?: string;
  userName?: string;
  createdAt?: string;
}

interface BookForm {
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImageUrl: string;
  shortDescription: string;
}

interface MyBooksClientProps {
  userEmail: string;
  userName: string;
}

// =====================================
// INITIAL FORM
// =====================================

const initialForm: BookForm = {
  bookTitle: "",
  authorName: "",
  category: "fiction",
  totalCopies: 1,
  bookImageUrl: "",
  shortDescription: "",
};

// =====================================
// GET RESPONSE DATA
// =====================================

async function getResponseData(response: Response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Invalid server response (${response.status}).`
    );
  }

  return response.json();
}

// =====================================
// GET BETTER AUTH JWT TOKEN
// =====================================

async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    console.error("JWT Token Error:", error);

    throw new Error(
      error?.message || "Unable to generate JWT token."
    );
  }

  // Do not log the actual token.
  console.log("JWT Token Generated:", Boolean(data.token));

  return data.token;
}

// =====================================
// COMPONENT
// =====================================

export default function MyBooksClient({
  userEmail,
  userName,
}: MyBooksClientProps) {

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BookForm>(initialForm);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // =====================================
  // LOAD MY BOOKS WITH JWT
  // =====================================

  const loadBooks = useCallback(
    async (signal?: AbortSignal) => {
      if (!userEmail) {
        setError("User information is unavailable.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Step 1: Get JWT Token
        const token = await getAuthToken();

        if (signal?.aborted) return;

        // Step 2: Fetch My Books
        const email = userEmail.trim().toLowerCase();

        const response = await fetch(
          `${API_URL}/my-books/${encodeURIComponent(email)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal,

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Step 3: Read Backend Response
        const data = await getResponseData(response);

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load your books."
          );
        }

        if (!Array.isArray(data.books)) {
          throw new Error("Invalid books data received.");
        }

        setBooks(data.books);

        console.log("My Books Loaded:", data.books.length);

      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong.";

        console.error("Load Books Error:", message);

        setError(message);
        setBooks([]);

      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [userEmail]
  );

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    const controller = new AbortController();

    loadBooks(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadBooks]);

  // =====================================
  // START EDITING
  // =====================================

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

  // =====================================
  // CANCEL EDITING
  // =====================================

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(initialForm);
  };

  // =====================================
  // HANDLE EDIT INPUT
  // =====================================

  const handleEditChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]:
        name === "totalCopies" ? Number(value) : value,
    }));
  };

  // =====================================
  // UPDATE BOOK WITH JWT
  // =====================================

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

      // Step 1: Get JWT Token
      const token = await getAuthToken();

      console.log("Updating Book:", editingId);

      // Step 2: Send PUT Request
      const response = await fetch(
        `${API_URL}/edit-book/${encodeURIComponent(editingId)}`,
        {
          method: "PUT",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            bookTitle: editForm.bookTitle.trim(),
            authorName: editForm.authorName.trim(),
            category: editForm.category,
            totalCopies: editForm.totalCopies,
            bookImageUrl: editForm.bookImageUrl.trim(),
            shortDescription: editForm.shortDescription.trim(),
          }),
        }
      );

      // Step 3: Backend Response
      const data = await getResponseData(response);

      console.log("Update Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not update book."
        );
      }

      // Step 4: Update UI
      setBooks((previous) =>
        previous.map((book) =>
          book._id === editingId
            ? {
                ...book,
                ...editForm,
              }
            : book
        )
      );

      toast.add({
        type: "success",
        title: "Book Updated",
        description: "Your book has been updated successfully.",
      });

      cancelEdit();

    } catch (err) {
      console.error("Update Book Error:", err);

      toast.add({
        type: "error",
        title: "Update Failed",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });

    } finally {
      setIsSaving(false);
    }
  };

  // =====================================
  // DELETE BOOK WITH JWT
  // =====================================

  const handleDelete = async (id: string) => {
    if (deletingId || isSaving) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      // Step 1: Get JWT Token
      const token = await getAuthToken();

      console.log("Deleting Book:", id);

      // Step 2: Send DELETE Request
      const response = await fetch(
        `${API_URL}/delete-book/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          credentials: "include",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Step 3: Backend Response
      const data = await getResponseData(response);

      console.log("Delete Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not delete the book."
        );
      }

      // Step 4: Update UI
      setBooks((previous) =>
        previous.filter((book) => book._id !== id)
      );

      if (editingId === id) {
        cancelEdit();
      }

      toast.add({
        type: "success",
        title: "Book Deleted",
        description: "Book removed successfully.",
      });

    } catch (err) {
      console.error("Delete Book Error:", err);

      toast.add({
        type: "error",
        title: "Delete Failed",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong.",
      });

    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // LOADING UI
  // =====================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-green-800" />

          <p className="mt-4 text-gray-600">
            Loading your books...
          </p>
        </div>
      </main>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              My Books
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage the books you have added to BookNook.
            </p>

            <p className="mt-2 text-sm font-medium text-green-800">
              Total Books: {books.length}
            </p>
          </div>

          <Link
            href="/add-book"
            className="rounded-lg bg-[#2f6b52] px-5 py-3 font-medium text-white transition hover:bg-[#275c46]"
          >
            + Add New Book
          </Link>
        </div>

        {/* Error */}

        {error ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Unable to Load Books
            </h2>

            <p className="mt-3 text-sm text-gray-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadBooks()}
              className="mt-5 rounded-lg bg-green-800 px-6 py-2 text-white hover:bg-green-900"
            >
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          /* Empty State */

          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-20 text-center">
            <div className="mb-4 text-5xl">
              📚
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No Books Added Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You have not added any books yet.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-block rounded-lg bg-[#2f6b52] px-6 py-3 font-medium text-white hover:bg-[#275c46]"
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
                className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {editingId === book._id ? (

                  /* Edit Form */

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Edit Book
                    </h2>

                    <input
                      type="text"
                      name="bookTitle"
                      value={editForm.bookTitle}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border p-3 text-gray-800 outline-none focus:border-green-700"
                      placeholder="Book Title"
                    />

                    <input
                      type="text"
                      name="authorName"
                      value={editForm.authorName}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border p-3 text-gray-800 outline-none focus:border-green-700"
                      placeholder="Author Name"
                    />

                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border p-3 text-gray-800"
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
                      onChange={handleEditChange}
                      min={1}
                      step={1}
                      className="w-full rounded-lg border p-3 text-gray-800"
                      placeholder="Total Copies"
                    />

                    <input
                      type="url"
                      name="bookImageUrl"
                      value={editForm.bookImageUrl}
                      onChange={handleEditChange}
                      className="w-full rounded-lg border p-3 text-gray-800"
                      placeholder="Book Image URL"
                    />

                    {editForm.bookImageUrl && (
                      <div>
                        <p className="mb-2 text-sm text-gray-500">
                          Image Preview
                        </p>

                        <img
                          src={editForm.bookImageUrl}
                          alt="Book cover preview"
                          className="h-40 w-28 rounded-lg border object-contain"
                        />
                      </div>
                    )}

                    <textarea
                      name="shortDescription"
                      value={editForm.shortDescription}
                      onChange={handleEditChange}
                      rows={3}
                      className="w-full rounded-lg border p-3 text-gray-800"
                      placeholder="Short Description"
                    />

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={isSaving}
                        className="rounded-lg bg-green-800 px-6 py-2.5 text-white disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isSaving}
                        className="rounded-lg bg-gray-200 px-6 py-2.5 text-gray-800 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                ) : (

                  /* Book Details */

                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="flex h-48 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 p-2">
                      {book.bookImageUrl ? (
                        <img
                          src={book.bookImageUrl}
                          alt={book.bookTitle}
                          className="h-full w-full object-contain"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          No Book Cover
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">
                        {book.bookTitle}
                      </h2>

                      <p className="mt-1 text-gray-600">
                        Author: {book.authorName}
                      </p>

                      <div className="my-3 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-amber-100 px-3 py-1 capitalize text-amber-800">
                          {book.category}
                        </span>

                        <span className="text-gray-500">
                          Copies: {Number(book.totalCopies) || 0}
                        </span>
                      </div>

                      {book.shortDescription && (
                        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                          {book.shortDescription}
                        </p>
                      )}

                      <p className="mt-3 text-xs text-gray-400">
                        Added by: {book.userName || userName}
                      </p>

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
                          className="rounded-lg bg-green-600 px-6 py-2.5 text-white transition hover:bg-green-700 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(book._id)}
                          disabled={!!deletingId || isSaving}
                          className="rounded-lg bg-red-500 px-6 py-2.5 text-white transition hover:bg-red-600 disabled:bg-gray-400"
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
