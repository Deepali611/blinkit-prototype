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
      className="shrink-0 z-50 bg-white border-t border-blinkit-border shadow-md w-full"
    >
      <div className="flex items-center justify-around h-14 px-1">
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
                  className={`w-5 h-5 stroke-[2] ${
                    isActive ? "text-blinkit-green" : "text-blinkit-black/70"
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blinkit-green rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
