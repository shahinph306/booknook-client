/* eslint-disable react-hooks/purity */

"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";

type BorrowBookDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  authorName: string;
  bookImageUrl: string;
  totalCopies: number;
  borrowerName: string;
  borrowerEmail: string;
  borrowLoading: boolean;
  sessionLoading: boolean;
  onConfirm: () => void;
};

export default function BorrowBookDialog({
  open,
  onOpenChange,
  bookTitle,
  authorName,
  bookImageUrl,
  totalCopies,
  borrowerName,
  borrowerEmail,
  borrowLoading,
  sessionLoading,
  onConfirm,
}: BorrowBookDialogProps) {
  const formattedReturnDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imageSrc =
    bookImageUrl?.trim() ||
    "https://placehold.co/300x450?text=Book+Cover";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (borrowLoading && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop
          className="
            fixed inset-0 z-50
            bg-black/40
            backdrop-blur-sm
            data-open:animate-in
            data-[open]:fade-in-0
          "
        />

        <Dialog.Popup
          className="
            fixed left-1/2 top-1/2 z-50
            -translate-x-1/2 -translate-y-1/2

            w-[calc(100%-24px)]
            max-w-162.5

            max-h-[calc(100vh-32px)]

            overflow-x-hidden
            overflow-y-auto
            overscroll-contain

            rounded-3xl
            border-2 border-[#c8dcb8]

            bg-linear-to-br
            from-[#fffdf3]
            via-[#fff8e8]
            to-[#e1efd9]

            p-4 sm:p-7

            shadow-[0_25px_80px_rgba(31,75,45,0.35)]

            outline-none
          "
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#a6c987]/30 blur-3xl" />
            <div className="absolute top-1/3 -left-24 h-64 w-64 rounded-full bg-[#f1d99b]/40 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#8dbd84]/30 blur-3xl" />

            <div className="absolute top-10 right-3 text-8xl opacity-[0.10] rotate-12">
              🌿
            </div>

            <div className="absolute bottom-0 left-0 text-8xl opacity-[0.10] -rotate-12">
              🍃
            </div>

            <div className="absolute top-1/2 right-0 text-7xl opacity-[0.07]">
              🌱
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-5">

            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="
                    h-14 w-14 sm:h-16 sm:w-16
                    shrink-0
                    rounded-full
                    bg-linear-to-br
                    from-[#e6f3d5]
                    to-[#b9d69e]
                    border-4 border-white
                    shadow-md
                    flex items-center justify-center
                  "
                >
                  <span className="text-3xl sm:text-4xl">📖</span>
                </div>

                <div className="space-y-1">
                  <Dialog.Title
                    className="
                      text-2xl sm:text-3xl
                      font-serif font-bold
                      text-[#172d1e]
                    "
                  >
                    Borrow This Book
                  </Dialog.Title>

                  <p className="text-sm font-semibold text-[#267044]">
                    BookNook Library
                  </p>
                </div>
              </div>

              <Dialog.Description
                className="
                  text-sm sm:text-base
                  text-[#625b4d]
                  leading-relaxed
                "
              >
                Review your account information and confirm your borrowing
                request.
              </Dialog.Description>
            </div>

            {/* Close Button */}
            <Dialog.Close
              disabled={borrowLoading}
              className="
                absolute right-3 top-3 z-20
                h-8 w-8 rounded-full
                bg-white/80
                text-[#263d2d]
                text-xl
                hover:bg-[#e7f0e2]
                disabled:opacity-40
              "
              aria-label="Close dialog"
            >
              ×
            </Dialog.Close>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-[#c9b77e] to-transparent" />

            {/* Book Preview */}
            <div
              className="
                relative overflow-hidden
                flex items-center gap-4
                rounded-2xl
                border border-[#ead8ad]
                bg-linear-to-r
                from-[#fff7e6]
                via-[#fffdf5]
                to-[#eaf2df]
                p-3 sm:p-4
                shadow-sm
              "
            >
              <div className="absolute -right-5 -top-5 text-8xl opacity-[0.07] pointer-events-none">
                🌿
              </div>

              <div
                className="
                  relative shrink-0
                  h-24 w-16 sm:h-28 sm:w-20
                  overflow-hidden
                  rounded-lg
                  bg-white
                  shadow-md
                  border border-[#e8dfcb]
                "
              >
                <Image
                  src={imageSrc}
                  alt={bookTitle || "Book cover"}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                  unoptimized
                />
              </div>

              <div className="relative min-w-0 flex-1 space-y-2">
                <h3 className="text-lg sm:text-2xl font-serif font-bold text-[#1c291d] line-clamp-2">
                  {bookTitle}
                </h3>

                <p className="text-sm sm:text-base text-[#685f50]">
                  By {authorName}
                </p>

                <span
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    bg-linear-to-r
                    from-[#e0efcf]
                    to-[#d1e6bc]
                    px-3 py-1.5
                    text-xs sm:text-sm
                    font-semibold text-[#205b34]
                  "
                >
                  📚 {totalCopies} copies available
                </span>
              </div>
            </div>

            {/* Borrower Information */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-[#263a29]">
                  <span className="text-xl">👥</span>
                  Borrower Information
                </h3>

                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-full
                    border border-[#a8d18e]
                    bg-linear-to-r
                    from-[#e1f3d5]
                    to-[#d4eac5]
                    px-3 py-1
                    text-xs font-bold text-[#28653a]
                  "
                >
                  ✓ Verified Account
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* User Name */}
                <div className="space-y-2 rounded-2xl border border-[#d9d3c7] bg-gradient-to-br from-white/95 to-[#f0eee8]/95 p-4 shadow-sm">
                  <label
                    htmlFor="borrowerName"
                    className="text-sm font-semibold text-[#625c51]"
                  >
                    User Name
                  </label>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">👤</span>

                    <input
                      id="borrowerName"
                      value={borrowerName}
                      readOnly
                      className="
                        w-full min-w-0
                        border-0 bg-transparent p-0
                        text-sm sm:text-base
                        font-semibold text-[#29352b]
                        outline-none
                      "
                    />
                  </div>
                </div>

                {/* User Email */}
                <div className="space-y-2 rounded-2xl border border-[#d9d3c7] bg-linear-to-br from-white/95 to-[#f0eee8]/95 p-4 shadow-sm">
                  <label
                    htmlFor="borrowerEmail"
                    className="text-sm font-semibold text-[#625c51]"
                  >
                    User Email
                  </label>

                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">✉️</span>

                    <input
                      id="borrowerEmail"
                      type="email"
                      value={borrowerEmail}
                      readOnly
                      className="
                        w-full min-w-0
                        border-0 bg-transparent p-0
                        text-xs sm:text-sm
                        font-semibold text-[#29352b]
                        outline-none
                      "
                    />
                  </div>
                </div>
              </div>

              <p className="flex items-center gap-2 text-xs text-[#777365]">
                <span>ℹ️</span>
                Your registered email cannot be changed.
              </p>
            </div>

            {/* Borrow Duration */}
            <div
              className="
                rounded-2xl
                border border-[#a9ce8e]
                bg-linear-to-br
                from-[#e7f4d9]
                via-[#edf4df]
                to-[#dcebd0]
                p-4 sm:p-5
                shadow-sm
                space-y-4
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <span className="text-sm sm:text-base font-medium text-[#465b43]">
                    Borrow Duration
                  </span>
                </div>

                <span className="text-lg sm:text-2xl font-bold text-[#236536]">
                  7 Days
                </span>
              </div>

              <div className="h-px bg-[#bdd3a9]" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕒</span>
                  <span className="text-sm sm:text-base font-medium text-[#465b43]">
                    Return Before
                  </span>
                </div>

                <span className="text-xs sm:text-base font-bold text-[#283d2b] text-right">
                  {formattedReturnDate}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={borrowLoading}
                className="
                  h-12 rounded-xl
                  border-2 border-[#568c66]
                  bg-white/80
                  text-[#263d2d]
                  font-bold text-base
                  hover:bg-[#e7f0e2]
                  hover:border-[#2f6b52]
                  disabled:opacity-50
                  transition-all duration-300
                "
              >
                ✕ Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={
                  borrowLoading ||
                  sessionLoading ||
                  !borrowerName?.trim() ||
                  !borrowerEmail?.trim() ||
                  totalCopies <= 0
                }
                className="
                  h-12 rounded-xl
                  bg-linear-to-r
                  from-[#478d43]
                  via-[#287343]
                  to-[#145b37]
                  text-white font-bold text-base
                  shadow-lg shadow-green-900/20
                  hover:from-[#397b37]
                  hover:via-[#216239]
                  hover:to-[#104b2d]
                  hover:shadow-xl
                  hover:-translate-y-0.5
                  active:translate-y-0
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition-all duration-300
                "
              >
                {borrowLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  "✓ Confirm Borrow →"
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#c9b77e]" />

              <p className="text-center text-xs sm:text-sm italic font-serif text-[#756b5b] whitespace-nowrap">
                Thank you for using BookNook Library ❤️
              </p>

              <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#c9b77e]" />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
