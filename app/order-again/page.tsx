import OrderAgainIntervention from "@/components/OrderAgainIntervention";

export default function OrderAgainPage() {
  return (
    <div className="space-y-3">
      {/* Customer Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-blinkit-border shadow-xs">
        <h1 className="text-base font-extrabold text-blinkit-black">
          Order Again
        </h1>
        <p className="text-xs text-blinkit-muted">
          Quickly reorder your past items with verified freshness guarantees.
        </p>
      </div>

      {/* Main Clean Order Again Component */}
      <OrderAgainIntervention />
    </div>
  );
}
