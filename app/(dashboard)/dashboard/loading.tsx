export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="bg-gray-100 rounded-3xl p-6 sm:p-8 h-40" />

      {/* Quick Action Hubs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-24" />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-64" />
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-48" />
        </div>
        <div className="space-y-6">
          <div className="bg-gray-100 rounded-3xl p-6 h-64" />
          <div className="bg-white rounded-3xl border border-gray-100 p-5 h-48" />
        </div>
      </div>
    </div>
  );
}
