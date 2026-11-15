

/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

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

  // =====================================
  // HANDLE INPUT CHANGES
  // =====================================
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

  // =====================================
  // SUBMIT BOOK
  // =====================================
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isLoading) return;

    if (!user?.email || !user?.name) {
      toast.add({
        type: "error",
        title: "Login Required",
        description: "Please log in before adding a book.",
      });
      return;
    }

    // Validate required fields
    if (
      !formData.bookTitle.trim() ||
      !formData.authorName.trim() ||
      !formData.category.trim() ||
      !formData.bookImageUrl.trim()
    ) {
      toast.add({
        type: "error",
        title: "Required Fields",
        description: "Please complete all required fields.",
      });
      return;
    }

    // Validate total copies
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



// =====================================
// STEP 1: GENERATE JWT TOKEN
// =====================================

const { data: tokenData, error: tokenError } =
  await authClient.token();

// console.log("JWT Token Response:", tokenData);

if (tokenError || !tokenData?.token) {
  throw new Error(
    tokenError?.message || "JWT token generation failed!"
  );
}

const token = tokenData.token;

console.log("JWT Token Generated:", Boolean(token));

// =====================================
// STEP 2: PREPARE BOOK DATA
// =====================================

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

console.log("Sending Book Data:", bookData);

// =====================================
// STEP 3: SEND JWT TO BACKEND
// =====================================

const res = await fetch(`${API_URL}/add-book`, {
  method: "POST",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },

  body: JSON.stringify(bookData),
});

// =====================================
// STEP 4: BACKEND RESPONSE
// =====================================

const responseData = await res.json();

console.log("Backend Status:", res.status);
console.log("Backend Response:", responseData);

if (!res.ok || !responseData.success) {
  throw new Error(
    responseData.message || "Failed to add book."
  );
}


      // =====================================
      // STEP 5: SUCCESS
      // =====================================

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
      console.error("Add Book Error:", error);

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

  // =====================================
  // LOADING
  // =====================================

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // =====================================
  // MAIN FORM
  // =====================================

  return (
    <main className="container mx-auto min-h-screen bg-amber-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl text-gray-900">
            Add a Book
          </h1>

          <p className="text-gray-500">
            Add a new book to your personal library.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Book Title & Author */}
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
                className="w-full rounded border border-black bg-white px-3 py-2"
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
                className="w-full rounded border border-black bg-white px-3 py-2"
              />
            </div>

          </div>

          {/* Category & Copies */}
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
                className="w-full rounded border border-black bg-white px-3 py-2"
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
                className="w-full rounded border border-black bg-white px-3 py-2"
              />
            </div>

          </div>

          {/* Book Image URL */}
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
              className="w-full rounded border border-black bg-white px-3 py-2"
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
              className="w-full rounded border border-black bg-white px-3 py-2"
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
                value={user?.name || ""}
                readOnly
                className="w-full cursor-not-allowed rounded border border-black bg-gray-100 px-3 py-2"
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
                value={user?.email || ""}
                readOnly
                className="w-full cursor-not-allowed rounded border border-black bg-gray-100 px-3 py-2"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isPending}
            className="mt-2 w-full rounded bg-[#2f6b52] py-2.5 font-medium text-white transition-colors hover:bg-[#275c46] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? "Adding Book..." : "Add Book"}
          </button>

        </form>
      </div>
    </main>
  );
}
