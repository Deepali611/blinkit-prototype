export default function PrintPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl border border-blinkit-border shadow-sm">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-neutral-100 text-blinkit-black rounded-full mb-2">
          Print Store
        </span>
        <h1 className="text-xl font-bold text-blinkit-black mb-1">
          Print Store
        </h1>
        <p className="text-xs text-blinkit-muted">
          Print documents, passport photos, and custom prints delivered in 10 minutes.
        </p>
      </div>

      <div className="border border-dashed border-blinkit-border p-8 rounded-2xl text-center text-blinkit-muted bg-white/50">
        <p className="text-xs">Empty Print tab shell ready for document print service.</p>
      </div>
    </div>
  );
}
