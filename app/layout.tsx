import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Blinkit - 10 Minute Delivery & Quick Commerce",
  description: "Order fresh groceries, daily essentials, and quick delivery items in 10 minutes on Blinkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-neutral-900 py-4 flex flex-col items-center justify-center">
        {/* Mobile Phone Mockup Frame (max-w-[400px]) */}
        <div className="w-full max-w-[400px] h-[840px] max-h-[92vh] bg-blinkit-light border-[8px] border-neutral-800 rounded-[40px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col relative overflow-hidden">
          {/* Phone Speaker Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-neutral-800 rounded-b-xl z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-neutral-600 rounded-full" />
          </div>

          {/* App Header */}
          <Header />

          {/* Main App Content Area */}
          <main className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {children}
          </main>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
