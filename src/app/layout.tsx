import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientDrawers from "@/components/ClientDrawers";

export const metadata: Metadata = {
  title: "Hot Wheels Premium Store",
  description: "High-quality die-cast cars and collectibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-luxury-bg text-luxury-text selection:bg-black selection:text-white">
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            
            <Footer />
            <ClientDrawers />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
