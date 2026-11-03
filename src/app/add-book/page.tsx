/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */

"use client";

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const API_URL = "http://localhost:8000";

type GoogleBook = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
  };
};

const AddBookPage = () => {
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
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Redirect if user is not logged in
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  // Search Google Books API when title changes
  useEffect(() => {
    const title = formData.bookTitle.trim();

    if (title.length < 3) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError("");

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            `intitle:${title}`
          )}&maxResults=6&printType=books`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Google Books search failed.");
        }

        const data = await response.json();

        setSearchResults(data.items || []);

        if (!data.items || data.items.length === 0) {
          setSearchError("No books found. Try another title.");
        }
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Google Books Error:", error);
          setSearchError("Unable to search books. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [formData.bookTitle]);

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

  // Select a book from Google Books
  const handleSelectBook = (book: GoogleBook) => {
    const info = book.volumeInfo;

    const imageUrl =
      info.imageLinks?.extraLarge ||
      info.imageLinks?.large ||
      info.imageLinks?.medium ||
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      "";

    const secureImageUrl = imageUrl
      .replace("http://", "https://")
      .replace("&edge=curl", "");

    setFormData((prev) => ({
      ...prev,
      bookTitle: info.title || prev.bookTitle,
      authorName: info.authors?.join(", ") || prev.authorName,
      bookImageUrl: secureImageUrl,
      shortDescription: info.description
        ? info.description.replace(/<[^>]*>/g, "").slice(0, 1000)
        : prev.shortDescription,
    }));

    setSearchResults([]);
    setSearchError("");

    toast.add({
      type: "success",
      title: "Book Selected",
      description: "Book information has been filled automatically.",
    });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.add({
        type: "error",
        title: "Login Required",
        description: "Please login before adding a book.",
      });
      return;
    }

    if (!formData.bookImageUrl) {
      toast.add({
        type: "error",
        title: "Book Image Required",
        description: "Please select a book or provide an image URL.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const bookData = {
        ...formData,
        userName: user.name || "",
        userEmail: user.email || "",
        createdAt: new Date(),
      };

      const res = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || data.message || "Failed to add book."
        );
      }

      toast.add({
        type: "success",
        title: "Book Added Successfully!",
        description: `${formData.bookTitle} has been added to your library.`,
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
    } catch (error) {
      console.error("Add Book Error:", error);

      toast.add({
        type: "error",
        title: "Failed to Add Book",
        description:
          error instanceof Error
            ? error.message
            : "Please check your server connection.",
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

        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl text-gray-900">
            Add a Book
          </h1>

          <p className="text-gray-500">
            Put a book from your shelf into the library.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Book Title & Author */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div className="relative">
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
                autoComplete="off"
                className="w-full rounded border border-black/10 bg-white px-3 py-2"
              />

              {isSearching && (
                <p className="mt-2 text-sm text-gray-500">
                  Searching Google Books...
                </p>
              )}

              {searchError && !isSearching && (
                <p className="mt-2 text-sm text-gray-500">
                  {searchError}
                </p>
              )}

              {/* Google Books Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-lg border bg-white shadow-xl">

                  <p className="border-b px-3 py-2 text-xs font-semibold text-gray-500">
                    SELECT YOUR BOOK
                  </p>

                  {searchResults.map((book) => {
                    const info = book.volumeInfo;

                    const image =
                      info.imageLinks?.thumbnail ||
                      info.imageLinks?.smallThumbnail;

                    return (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleSelectBook(book)}
                        className="flex w-full items-center gap-3 border-b p-3 text-left transition hover:bg-amber-50"
                      >
                        {image ? (
                          <img
                            src={image.replace("http://", "https://")}
                            alt={info.title || "Book cover"}
                            className="h-16 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-12 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {info.title || "Unknown Title"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {info.authors?.join(", ") || "Unknown Author"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
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
                required
                className="w-full rounded border border-black/10 bg-white px-3 py-2"
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
              type="url"
              id="bookImageUrl"
              name="bookImageUrl"
              value={formData.bookImageUrl}
              onChange={handleChange}
              placeholder="Select a book or paste an image URL"
              required
              className="w-full rounded border border-black/10 bg-white px-3 py-2"
            />

            {/* Image Preview */}
            {formData.bookImageUrl && (
              <div className="mt-4 rounded-lg border bg-white p-4">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Book Cover Preview
                </p>

                <img
                  src={formData.bookImageUrl}
                  alt="Selected book cover"
                  className="h-56 w-40 rounded-lg border object-contain shadow-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
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
              placeholder="Write a short description..."
              className="w-full rounded border border-black/10 bg-white px-3 py-2"
            />
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-1.5 block text-sm text-gray-700">
                User Name
              </label>

              <input
                type="text"
                value={user.name || ""}
                readOnly
                className="w-full cursor-not-allowed rounded border border-black/10 bg-gray-100 px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-gray-700">
                User Email
              </label>

              <input
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
            disabled={isLoading || isSearching}
            className="mt-2 w-full rounded bg-[#2f6b52] py-2.5 font-medium text-white transition-colors hover:bg-[#275c46] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? "Adding Book..." : "Add Book"}
          </button>

        </form>
      </div>
    </main>
  );
};

export default AddBookPage;
