import { MapPin, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-blinkit-yellow border-b border-blinkit-yellow-dark/20 px-4 pt-3 pb-3 max-w-md mx-auto shadow-sm">
      {/* Top Location Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="bg-blinkit-black text-white p-1.5 rounded-full shrink-0">
            <MapPin className="w-4 h-4 text-blinkit-yellow" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-blinkit-black text-xs tracking-wider uppercase">
                Delivery in 8 minutes
              </span>
            </div>
            <p className="text-xs text-blinkit-black/80 font-medium truncate">
              Home - B-402, Green Valley Apartments, Indiranagar...
            </p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blinkit-black/10 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-blinkit-black" />
        </div>
      </div>

      {/* Search Bar Visual Token */}
      <div className="relative mt-2">
        <div className="w-full bg-white rounded-xl py-2.5 px-3.5 pl-10 text-sm text-blinkit-muted border border-black/5 flex items-center justify-between shadow-inner">
          <span className="truncate">Search &quot;milk, bread, chips, printer...&quot;</span>
        </div>
        <Search className="w-4 h-4 text-blinkit-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>
    </header>
  );
}
