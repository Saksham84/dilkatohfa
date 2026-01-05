"use client";

import Link from "next/link";
import { Heart, ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { useApp } from "../context/AppContext";

export function Header() {
  const {
    user,
    wishlist,
    getCartItemsCount,
    setIsCartOpen,
    setIsAuthOpen,
    logout,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cartItemsCount = getCartItemsCount();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
      <div className="container mx-auto px-4">
        {/* ================= TOP BAR ================= */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Dillkatofa
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for gifts, occasions, or categories..."
                className="w-full px-4 py-2 pl-10 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-pink-50 rounded-full hidden sm:block"
            >
              <Heart className="w-6 h-6 text-pink-500" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-pink-50 rounded-full"
            >
              <ShoppingCart className="w-6 h-6 text-pink-500" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative hidden sm:block">
              <button
                onClick={() =>
                  user ? setShowUserMenu(!showUserMenu) : setIsAuthOpen(true)
                }
                className="p-2 hover:bg-pink-50 rounded-full"
              >
                <User className="w-6 h-6 text-pink-500" />
              </button>

              {user && showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-pink-100 overflow-hidden"
                >
                  <div className="p-3 border-b border-pink-100">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <Link
                    href="/orders"
                    className="block px-4 py-2 hover:bg-pink-50"
                  >
                    My Orders
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 hover:bg-pink-50"
                  >
                    Wishlist
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-pink-50 text-red-600"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-pink-50 rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden md:flex gap-8 py-3 border-t border-pink-100">
          {[
            ["Birthday", "/products/birthday"],
            ["Anniversary", "/products/anniversary"],
            ["Valentine", "/products/valentine"],
            ["Customized Gifts", "/products/customized"],
            ["Surprise Gifts", "/products/surprise"],
            ["Trending", "/products/trending"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-gray-700 hover:text-pink-600"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-pink-100"
          >
            <div className="p-4 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 border-2 border-pink-200 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              {[
                ["Birthday", "/products/birthday"],
                ["Anniversary", "/products/anniversary"],
                ["Valentine", "/products/valentine"],
                ["Customized Gifts", "/products/customized"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-pink-600"
                >
                  {label}
                </Link>
              ))}

              {!user && (
                <button
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
