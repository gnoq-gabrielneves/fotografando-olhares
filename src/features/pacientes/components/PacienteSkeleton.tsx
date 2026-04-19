export function PacienteSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-slate-800 rounded" />
            <div className="h-4 w-40 bg-slate-800 rounded" />
          </div>
          <div className="h-9 w-28 bg-slate-800 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-800 rounded" />
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-slate-800 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
