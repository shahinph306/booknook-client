/* eslint-disable @next/next/no-img-element */

"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AddBookPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState({
    bookTitle: "",
    authorName: "",
    category: "fiction",
    totalCopies: 1,
    bookImageUrl: "",
    shortDescription: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalCopies" ? Number(value) : value,
    }));
  };

  // Submit book
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (!user?.email || !user?.name) {
      toast.add({
        type: "error",
        title: "Login Required",
        description: "Please log in with your account before adding a book.",
      });
      return;
    }

    if (
      !formData.bookTitle.trim() ||
      !formData.authorName.trim() ||
      !formData.category.trim() ||
      !formData.bookImageUrl.trim()
    ) {
      toast.add({
        type: "error",
        title: "Required Fields",
        description: "Please complete all required book information.",
      });
      return;
    }

    if (
      !Number.isInteger(formData.totalCopies) ||
      formData.totalCopies < 1
    ) {
      toast.add({
        type: "error",
        title: "Invalid Copies",
        description: "Total copies must be at least 1.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // IMPORTANT: Include userName and userEmail
      const bookData = {
        bookTitle: formData.bookTitle.trim(),
        authorName: formData.authorName.trim(),
        category: formData.category,
        totalCopies: formData.totalCopies,
        bookImageUrl: formData.bookImageUrl.trim(),
        shortDescription: formData.shortDescription.trim(),

        userName: user.name,
        userEmail: user.email.trim().toLowerCase(),
      };

      console.log("📤 Sending Book Data:", bookData);

      const res = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      // Safely read server response
      const contentType = res.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await res.json()
        : null;

      console.log("📥 Backend Response:", data);

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || `Request failed with status ${res.status}`
        );
      }

      toast.add({
        type: "success",
        title: "Book Added Successfully!",
        description: `${bookData.bookTitle} has been added to your library.`,
      });

      setFormData({
        bookTitle: "",
        authorName: "",
        category: "fiction",
        totalCopies: 1,
        bookImageUrl: "",
        shortDescription: "",
      });

      router.push("/my-books");
      router.refresh();
    } catch (error) {
      console.error("❌ Frontend Add Book Error:", error);

      toast.add({
        type: "error",
        title: "Failed to Add Book",
        description:
          error instanceof Error
            ? error.message
            : "Unable to connect to the server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto min-h-screen bg-amber-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl text-gray-900">
            Add a Book
          </h1>

          <p className="text-gray-500">
            Add a new book to your personal library.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Book Title and Author */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="bookTitle"
                className="mb-1.5 block text-sm text-gray-700"
              >
                Book Title
              </label>

              <input
                type="text"
                id="bookTitle"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                placeholder="Enter book title"
                required
                className="w-full rounded border border-black/10 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="authorName"
                className="mb-1.5 block text-sm text-gray-700"
              >
                Author Name
              </label>

              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                placeholder="Enter author name"
                required
                className="w-full rounded border border-black/10 bg-white px-3 py-2"
              />
            </div>
          </div>

          {/* Category and Copies */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-1.5 block text-sm text-gray-700"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded border border-black/10 bg-white px-3 py-2"
              >
                <option value="fiction">Fiction</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="totalCopies"
                className="mb-1.5 block text-sm text-gray-700"
              >
                Total Copies
              </label>

              <input
                type="number"
                id="totalCopies"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                min={1}
                step={1}
                required
                className="w-full rounded border border-black/10 bg-white px-3 py-2"
              />
            </div>
          </div>

          {/* Book Image */}
          <div>
            <label
              htmlFor="bookImageUrl"
              className="mb-1.5 block text-sm text-gray-700"
            >
              Book Cover Image URL
            </label>

            <input
              type="text"
              id="bookImageUrl"
              name="bookImageUrl"
              value={formData.bookImageUrl}
              onChange={handleChange}
              placeholder="Paste an image URL"
              required
              className="w-full rounded border border-black/10 bg-white px-3 py-2"
            />

            {formData.bookImageUrl && (
              <div className="mt-4 rounded-lg border bg-white p-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Book Cover Preview
                </p>

                <img
                  src={formData.bookImageUrl}
                  alt="Book cover preview"
                  className="h-56 w-40 rounded-lg border object-contain shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="shortDescription"
              className="mb-1.5 block text-sm text-gray-700"
            >
              Short Description
            </label>

            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={3}
              maxLength={1000}
              placeholder="Write a short description..."
              className="w-full rounded border border-black/10 bg-white px-3 py-2"
            />
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="userName"
                className="mb-1.5 block text-sm text-gray-700"
              >
                User Name
              </label>

              <input
                id="userName"
                type="text"
                value={user.name || ""}
                readOnly
                className="w-full cursor-not-allowed rounded border border-black/10 bg-gray-100 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="userEmail"
                className="mb-1.5 block text-sm text-gray-700"
              >
                User Email
              </label>

              <input
                id="userEmail"
                type="email"
                value={user.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded border border-black/10 bg-gray-100 px-3 py-2"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded bg-[#2f6b52] py-2.5 font-medium text-white transition-colors hover:bg-[#275c46] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}
