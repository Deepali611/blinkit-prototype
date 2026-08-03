import { MapPin, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="shrink-0 z-40 bg-blinkit-yellow border-b border-blinkit-yellow-dark/20 px-3.5 pt-5 pb-3 w-full shadow-xs">
      {/* Top Location Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-blinkit-black text-white p-1 rounded-full shrink-0">
            <MapPin className="w-3.5 h-3.5 text-blinkit-yellow" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-blinkit-black text-[11px] tracking-wider uppercase">
                Delivery in 8 minutes
              </span>
            </div>
            <p className="text-[10px] text-blinkit-black/80 font-medium truncate">
              Home - B-402, Green Valley Apartments, Indiranagar...
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar Visual Token */}
      <div className="relative mt-1.5">
        <div className="w-full bg-white rounded-xl py-2 px-3 pl-9 text-xs text-blinkit-muted border border-black/5 flex items-center justify-between shadow-inner">
          <span className="truncate">Search &quot;milk, bread, cheese, olive oil...&quot;</span>
        </div>
        <Search className="w-3.5 h-3.5 text-blinkit-muted absolute left-3 top-1/2 -translate-y-1/2" />
      </div>
    </header>
  );
}
