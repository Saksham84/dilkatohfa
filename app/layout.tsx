import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppProvider } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ShoppingCartDrawer } from "./components/ShoppingCartDrawer";
import { AuthModal } from "./components/AuthModal";

import { Toaster } from "react-hot-toast"; // ✅ correct toaster

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dilkatohfa | Gifting Store",
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

            <main className="flex-1">{children}</main>

            <Footer />

            {/* Global UI */}
            <ShoppingCartDrawer />
            <AuthModal />

            {/* Toast Notifications */}
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#ffffff",
                  color: "#333333",
                },
                success: {
                  style: {
                    border: "1px solid #22c55e",
                  },
                },
                error: {
                  style: {
                    border: "1px solid #ef4444",
                  },
                },
              }}
            />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
