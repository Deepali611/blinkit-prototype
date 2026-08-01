export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl border border-blinkit-border shadow-sm">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-blinkit-yellow/30 text-blinkit-black rounded-full mb-2">
          Product Categories
        </span>
        <h1 className="text-xl font-bold text-blinkit-black mb-1">
          Categories
        </h1>
        <p className="text-xs text-blinkit-muted">
          Browse all grocery, gourmet, electronics, and household categories.
        </p>
      </div>

      <div className="border border-dashed border-blinkit-border p-8 rounded-2xl text-center text-blinkit-muted bg-white/50">
        <p className="text-xs">Empty Categories tab shell ready for category layout.</p>
      </div>
    </div>
  );
}
