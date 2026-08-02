import CategoryReEntryRow from "@/components/CategoryReEntryRow";

export default function CategoriesPage() {
  return (
    <div className="space-y-3">
      {/* Customer Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-blinkit-border shadow-xs">
        <h1 className="text-base font-extrabold text-blinkit-black">
          Categories
        </h1>
        <p className="text-xs text-blinkit-muted">
          Browse items by category with 10-minute delivery.
        </p>
      </div>

      {/* Main Clean Category Re-Entry Row */}
      <CategoryReEntryRow />
    </div>
  );
}
