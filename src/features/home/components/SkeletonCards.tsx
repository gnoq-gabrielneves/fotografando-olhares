export function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse shadow-sm"
        >
          <div className="h-3 w-24 bg-slate-100 rounded mb-3" />
          <div className="h-8 w-16 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}
