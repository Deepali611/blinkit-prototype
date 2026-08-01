import CategoryReEntryRow from "@/components/CategoryReEntryRow";

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blinkit-black uppercase tracking-wider bg-blinkit-yellow/30 px-2 py-0.5 rounded-full">
            Secondary Surface
          </span>
          <h1 className="text-lg font-extrabold text-blinkit-black mt-1">
            Category & PDP Re-Entry
          </h1>
          <p className="text-xs text-blinkit-muted">
            Inline trust row matching native Blinkit &quot;72 hours only replacement&quot; pattern.
          </p>
        </div>
      </div>

      {/* Main Secondary Surface Component */}
      <CategoryReEntryRow />
    </div>
  );
}
