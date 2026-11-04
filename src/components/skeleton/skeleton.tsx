type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded-lg ${className}`}
    />
  );
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}

// Book Card Skeleton
export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <Skeleton className="h-52 w-full rounded-xl mb-4" />
      <Skeleton className="h-5 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

// Book Grid Skeleton
export function BookGridSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

// Table Skeleton
export function TableSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center gap-4">
      <Skeleton className="h-28 w-28 rounded-full" />
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64 max-w-full" />
      <Skeleton className="h-10 w-36 rounded-xl" />
    </div>
  );
}