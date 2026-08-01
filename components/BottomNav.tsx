"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RotateCcw, LayoutGrid, Printer } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home, id: "nav-home" },
    { label: "Order Again", href: "/order-again", icon: RotateCcw, id: "nav-order-again" },
    { label: "Categories", href: "/categories", icon: LayoutGrid, id: "nav-categories" },
    { label: "Print", href: "/print", icon: Printer, id: "nav-print" },
  ];

  return (
    <nav
      id="bottom-navigation"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-blinkit-border shadow-lg max-w-md mx-auto"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              id={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-blinkit-green font-semibold"
                  : "text-blinkit-black/70 hover:text-blinkit-black"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 stroke-[2] ${
                    isActive ? "text-blinkit-green" : "text-blinkit-black/70"
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blinkit-green rounded-full" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
