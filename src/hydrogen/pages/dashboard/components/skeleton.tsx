export const DashboardSkeleton = () => {
  return (
    <div className="flex gap-2 px-2 flex-col">
      <div className="animate-pulse h-20 bg-gray-200 rounded" />

      <div className="animate-pulse border-gray-200 border rounded p-3">
        <div className="flex flex-wrap">
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="animate-pulse h-36 bg-gray-200 rounded" />

      <div className="animate-pulse border-gray-200 border rounded p-3">
        <div className="w-16 h-9 bg-gray-200 rounded mb-2" />
        <div className="flex flex-wrap">
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="animate-pulse border-gray-200 border rounded p-3">
        <div className="w-16 h-9 bg-gray-200 rounded mb-2" />
        <div className="flex flex-wrap">
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
          <div className="w-1/5 h-14 scale-90 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  )
}
