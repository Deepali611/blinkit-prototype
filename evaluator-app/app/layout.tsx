import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blinkit Mission Recovery — Standalone Evaluator System",
  description: "Internal Evaluator Dashboard & AI Decision Trace Pipeline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </body>
    </html>
  );
}
