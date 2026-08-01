import OrderAgainIntervention from "@/components/OrderAgainIntervention";

export default function OrderAgainPage() {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-2xl border border-blinkit-border shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blinkit-green uppercase tracking-wider bg-blinkit-green-light px-2 py-0.5 rounded-full">
            Primary Customer Surface
          </span>
          <h1 className="text-lg font-extrabold text-blinkit-black mt-1">
            Order Again
          </h1>
          <p className="text-xs text-blinkit-muted">
            Quickly reorder your past items with verified freshness guarantees.
          </p>
        </div>
      </div>

      {/* Main Order Again Component */}
      <OrderAgainIntervention />
    </div>
  );
}
