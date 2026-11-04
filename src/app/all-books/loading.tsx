
import {
  BookGridSkeleton,
  PageHeaderSkeleton,
} from "@/components/skeleton/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-500 py-12 px-4">

      <div className="container mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="text-center mb-10">
          <PageHeaderSkeleton />
        </div>

        {/* Search and Filter Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="skeleton animate-pulse h-12 flex-1 rounded-xl" />
          <div className="skeleton animate-pulse h-12 w-full sm:w-44 rounded-xl" />
        </div>

        {/* Books Grid */}
        <BookGridSkeleton count={6} />

        {/* DaisyUI Loading Spinner */}
        <div className="flex flex-col items-center justify-center mt-12 gap-3">

          <span className="loading loading-spinner loading-lg text-success" />

          <p className="text-sm font-medium text-green-500 animate-pulse">
            Discovering amazing books...
          </p>

        </div>

      </div>

    </main>
  );
}
