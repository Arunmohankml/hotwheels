import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Hot Wheels | Premium Diecast Collector Store",
  description: "The ultimate destination for premium diecast car collectors. Exclusive drops, rare finds, and cinematic experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-hw-dark text-white font-sans selection:bg-hw-red selection:text-white">
        <Navbar />
        <main>{children}</main>
        {/* Footer will be added here later */}
      </body>
    </html>
  );
}
