"use client";

import { ShoppingBag } from "lucide-react";
import { MOCK_ORDERS, MOCK_PRODUCTS_EVIDENCE } from "@/lib/data/mockData";

interface OrderAgainInterventionProps {
  caseId?: string;
  showCaseSelector?: boolean;
}

export default function OrderAgainIntervention({
  caseId,
  showCaseSelector,
}: OrderAgainInterventionProps = {}) {
  return (
    <div className="space-y-2.5">
      {MOCK_ORDERS.slice(0, 3).map((order) => {
        const product = MOCK_PRODUCTS_EVIDENCE[order.product_id];

        return (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-blinkit-border shadow-xs overflow-hidden transition-all"
          >
            {/* Clean Standard Card Header */}
            <div className="bg-neutral-50/80 border-b border-blinkit-border px-3.5 py-1.5 flex items-center justify-between text-[11px]">
              <span className="text-blinkit-muted font-medium">
                Ordered {order.days_ago} days ago
              </span>
              <span className="text-blinkit-muted font-medium text-[10px]">
                {order.category_name}
              </span>
            </div>

            {/* Product Details Section */}
            <div className="p-3 flex items-center gap-3">
              {/* Product Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                {order.product_image ? (
                  <img
                    src={order.product_image}
                    alt={order.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ShoppingBag className="w-6 h-6 text-neutral-400" />
                )}
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase text-blinkit-muted tracking-wider block">
                  {product?.brand_name || "Blinkit Selection"}
                </span>
                <h2 className="text-xs font-bold text-blinkit-black truncate leading-snug">
                  {order.product_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-extrabold text-blinkit-black">
                    ₹{order.price}
                  </span>
                </div>
              </div>

              {/* Standard Add Button */}
              <button className="bg-white border-2 border-blinkit-green text-blinkit-green hover:bg-blinkit-green hover:text-white font-extrabold text-xs px-3.5 py-1 rounded-xl shadow-2xs transition-colors shrink-0">
                + ADD
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
