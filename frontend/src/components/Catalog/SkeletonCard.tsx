export function SkeletonCard() {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-white/5 animate-pulse">
      {}
      <div className="aspect-video w-full bg-gray-800"></div>
      {}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <div className="h-5 bg-gray-800 rounded-md w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-800 rounded-md w-1/2"></div>
        </div>
        {}
        <div className="h-10 bg-gray-800 rounded-lg w-full mt-2"></div>
      </div>
    </div>
  );
}
