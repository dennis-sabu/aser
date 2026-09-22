export default function ChatLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 bg-gray-200 rounded-xl" />
        <div className="h-4 w-24 bg-gray-100 rounded-lg" />
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
