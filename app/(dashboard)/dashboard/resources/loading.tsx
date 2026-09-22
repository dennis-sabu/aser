export default function ResourcesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded-xl" />
          <div className="h-4 w-72 bg-gray-100 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-gray-100 rounded-xl" />
          <div className="h-10 w-36 bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* Filter / Search Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 h-28" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-72 flex flex-col justify-between p-4">
            <div className="h-36 bg-gray-100 rounded-xl mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
            <div className="h-8 bg-gray-100 rounded-lg mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
