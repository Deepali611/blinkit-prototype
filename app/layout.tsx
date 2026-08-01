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
      <body className="antialiased min-h-screen bg-neutral-100 flex flex-col items-center">
        {/* Mobile Viewport Container Shell */}
        <div className="w-full max-w-md min-h-screen bg-blinkit-light flex flex-col relative pb-20 shadow-2xl">
          <Header />
          <main className="flex-1 px-4 py-4">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
