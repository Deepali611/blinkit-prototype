import Link from "next/link";
import { Sparkles, Clock, ArrowRight, ShieldCheck, ShoppingBag, Plus } from "lucide-react";
import OrderAgainIntervention from "@/components/OrderAgainIntervention";

export default function HomePage() {
  const categories = [
    { name: "Vegetables & Fruits", icon: "🥦", bg: "bg-emerald-50 text-emerald-700" },
    { name: "Dairy, Bread & Eggs", icon: "🥛", bg: "bg-amber-50 text-amber-700" },
    { name: "Munchies & Chips", icon: "🥨", bg: "bg-orange-50 text-orange-700" },
    { name: "Cold Drinks & Juices", icon: "🧃", bg: "bg-cyan-50 text-cyan-700" },
    { name: "Gourmet & World Food", icon: "🧀", bg: "bg-yellow-50 text-yellow-700" },
    { name: "Specialty Teas", icon: "🍵", bg: "bg-green-50 text-green-700" },
    { name: "Beauty & Cosmetics", icon: "✨", bg: "bg-pink-50 text-pink-700" },
    { name: "Cleaning Essentials", icon: "🧹", bg: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="space-y-3.5">
      {/* 10-Minute Delivery Promo Banner */}
      <div className="bg-gradient-to-r from-blinkit-yellow via-amber-300 to-blinkit-yellow p-3.5 rounded-2xl border border-black/5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blinkit-black" />
            <span className="font-extrabold text-blinkit-black text-xs uppercase tracking-wide">
              SUPERFAST 10 MINS
            </span>
          </div>
          <h1 className="text-sm font-extrabold text-blinkit-black mt-0.5">
            Fresh Groceries & Essentials
          </h1>
          <p className="text-[10px] text-blinkit-black/80 font-medium">
            Flat ₹50 OFF on re-orders • Code: REORDER50
          </p>
        </div>
        <div className="bg-blinkit-black text-white p-2.5 rounded-xl text-center shrink-0">
          <span className="text-[10px] font-bold uppercase block text-blinkit-yellow">⚡ 8 MINS</span>
          <span className="text-[9px] text-neutral-300">Indiranagar</span>
        </div>
      </div>

      {/* "Previously Bought / Order Again" Re-Engagement Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blinkit-green" />
            <h2 className="text-xs font-extrabold text-blinkit-black uppercase tracking-wider">
              Order Again
            </h2>
          </div>
          <Link
            href="/order-again"
            className="text-[11px] font-bold text-blinkit-green flex items-center gap-0.5 hover:underline"
          >
            <span>See All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Clean Customer-Facing Order Again Card */}
        <OrderAgainIntervention />
      </div>

      {/* Blinkit Categories Grid */}
      <div className="bg-white p-3.5 rounded-2xl border border-blinkit-border shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-blinkit-black uppercase tracking-wider">
            Explore Categories
          </h2>
          <Link href="/categories" className="text-[11px] font-bold text-blinkit-green">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href="/categories"
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-neutral-100 hover:border-blinkit-green/40 transition-all text-center bg-neutral-50/50"
            >
              <span className="text-xl mb-1">{cat.icon}</span>
              <span className="text-[10px] font-bold text-blinkit-black leading-tight line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Near You Items */}
      <div className="bg-white p-3.5 rounded-2xl border border-blinkit-border shadow-xs space-y-2.5">
        <h2 className="text-xs font-extrabold text-blinkit-black uppercase tracking-wider">
          Trending Near You
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/40 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-neutral-400 block">Amul</span>
              <h3 className="text-xs font-bold text-blinkit-black">Taaza Toned Milk</h3>
              <span className="text-xs font-extrabold text-blinkit-black mt-1 block">₹27</span>
            </div>
            <button className="bg-white border border-blinkit-green text-blinkit-green font-bold text-xs px-2.5 py-1 rounded-lg shadow-2xs">
              + ADD
            </button>
          </div>

          <div className="p-2.5 rounded-xl border border-neutral-200 bg-neutral-50/40 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold text-neutral-400 block">Harvest</span>
              <h3 className="text-xs font-bold text-blinkit-black">Brown Bread 400g</h3>
              <span className="text-xs font-extrabold text-blinkit-black mt-1 block">₹45</span>
            </div>
            <button className="bg-white border border-blinkit-green text-blinkit-green font-bold text-xs px-2.5 py-1 rounded-lg shadow-2xs">
              + ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
