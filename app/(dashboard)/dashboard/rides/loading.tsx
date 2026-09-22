export default function RidesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 bg-gray-200 rounded-xl" />
          <div className="h-4 w-60 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-xl" />
      </div>

      {/* Search Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 h-24" />

      {/* Rides List Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-32 flex items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-1/4 bg-gray-100 rounded" />
            </div>
            <div className="h-10 w-28 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
