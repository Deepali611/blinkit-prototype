export default function OrderAgainPage() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl border border-blinkit-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-blinkit-green animate-pulse" />
          <span className="text-xs font-semibold text-blinkit-green uppercase tracking-wide">
            Primary Intervention Surface
          </span>
        </div>
        <h1 className="text-xl font-bold text-blinkit-black mb-1">
          Order Again
        </h1>
        <p className="text-xs text-blinkit-muted">
          Your past purchases and category re-ordering suggestions will be rendered here.
        </p>
      </div>

      <div className="border border-dashed border-blinkit-border p-8 rounded-2xl text-center text-blinkit-muted bg-white/50">
        <p className="text-xs">Empty Order Again tab shell ready for Mission Recovery modules.</p>
      </div>
    </div>
  );
}
