import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppProvider } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ShoppingCartDrawer } from "./components/ShoppingCartDrawer";
import { AuthModal } from "./components/AuthModal";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dillkatofa | Gifting Store",
  description: "Online gifting store for every occasion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <Footer />

            {/* Global UI */}
            <ShoppingCartDrawer />
            <AuthModal />

            {/* Toast */}
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: {
                  background: "white",
                  color: "#333",
                },
              }}
            />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
